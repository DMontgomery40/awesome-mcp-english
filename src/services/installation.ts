import { checkSystemRequirements } from '../utils/systemCheck';
import { Logger } from '../utils/logger';
import path from 'path';
import fs from 'fs/promises';

const logger = new Logger('installation-service');

export interface InstallationOptions {
  version?: string;
  customPath?: string;
  force?: boolean;
}

const DEFAULT_INSTALL_PATH = process.platform === 'darwin' 
  ? '/Applications/MCP'
  : process.platform === 'win32'
    ? 'C:\\Program Files\\MCP'
    : '/opt/mcp';

/**
 * Install MCP with specified options
 */
export async function installMCP(options: InstallationOptions = {}) {
  const {
    version = 'latest',
    customPath = DEFAULT_INSTALL_PATH,
    force = false
  } = options;

  logger.info('Starting MCP installation', { version, customPath });

  try {
    // Check system requirements
    await checkSystemRequirements();

    // Create installation directory
    const installPath = await createDirectories(customPath);

    // Download and extract MCP files
    const downloadedFiles = await downloadMCPFiles(version, installPath);
    
    // Configure the environment
    await configureEnvironment(installPath, version);
    
    // Verify the installation
    await verifyInstallation(installPath);

    logger.info('MCP installation completed successfully', {
      path: installPath,
      version: version
    });

    return {
      success: true,
      path: installPath,
      version: version
    };
  } catch (error) {
    logger.error('Installation failed', error);
    throw error;
  }
}

/**
 * Create necessary directories for MCP
 */
async function createDirectories(customPath: string): Promise<string> {
  const installPath = path.resolve(customPath);
  
  try {
    await fs.mkdir(installPath, { recursive: true });
    await fs.mkdir(path.join(installPath, 'bin'), { recursive: true });
    await fs.mkdir(path.join(installPath, 'config'), { recursive: true });
    await fs.mkdir(path.join(installPath, 'data'), { recursive: true });
    await fs.mkdir(path.join(installPath, 'logs'), { recursive: true });
    
    logger.info('Created installation directories', { path: installPath });
    return installPath;
  } catch (error) {
    logger.error('Failed to create directories', error);
    throw new Error(`Failed to create installation directories: ${error.message}`);
  }
}

/**
 * Download MCP files for specified version
 */
async function downloadMCPFiles(version: string, installPath: string): Promise<string[]> {
  const downloadUrl = `https://github.com/petiky/awesome-mcp/releases/download/${version}/mcp-${version}.tar.gz`;
  const downloadPath = path.join(installPath, `mcp-${version}.tar.gz`);

  try {
    // Ensure curl or wget is available
    const hasCurl = await commandExists('curl');
    const hasWget = await commandExists('wget');

    if (!hasCurl && !hasWget) {
      throw new Error('Neither curl nor wget is available for downloading');
    }

    // Download the file
    if (hasCurl) {
      await executeCommand(`curl -L "${downloadUrl}" -o "${downloadPath}"`);
    } else {
      await executeCommand(`wget "${downloadUrl}" -O "${downloadPath}"`);
    }

    // Extract the files
    await executeCommand(`tar -xzf "${downloadPath}" -C "${installPath}"`);
    
    // Clean up the downloaded archive
    await fs.unlink(downloadPath);

    logger.info('Downloaded and extracted MCP files', { version });
    return [downloadPath];
  } catch (error) {
    logger.error('Failed to download MCP files', error);
    throw new Error(`Failed to download MCP files: ${error.message}`);
  }
}

/**
 * Configure MCP environment
 */
async function configureEnvironment(installPath: string, version: string): Promise<void> {
  const configPath = path.join(installPath, 'config', 'mcp.json');
  const configTemplate = {
    version,
    installPath,
    timestamp: new Date().toISOString(),
    settings: {
      maxThreads: Math.max(1, Math.floor(require('os').cpus().length / 2)),
      logLevel: 'info',
      autoUpdate: true
    }
  };

  try {
    // Write configuration file
    await fs.writeFile(
      configPath, 
      JSON.stringify(configTemplate, null, 2)
    );

    // Set up environment variables
    const envPath = process.platform === 'win32' 
      ? path.join(installPath, 'bin', 'env.bat')
      : path.join(installPath, 'bin', 'env.sh');

    const envContent = process.platform === 'win32'
      ? `@echo off\nset MCP_HOME=${installPath}\nset PATH=%MCP_HOME%\\bin;%PATH%`
      : `export MCP_HOME=${installPath}\nexport PATH=$MCP_HOME/bin:$PATH`;

    await fs.writeFile(envPath, envContent);

    if (process.platform !== 'win32') {
      await fs.chmod(envPath, '755');
    }

    logger.info('Configured MCP environment', { configPath });
  } catch (error) {
    logger.error('Failed to configure environment', error);
    throw new Error(`Failed to configure environment: ${error.message}`);
  }
}

/**
 * Verify MCP installation
 */
async function verifyInstallation(installPath: string): Promise<boolean> {
  const requiredFiles = [
    'bin',
    'config/mcp.json',
    'config',
    'data',
    'logs'
  ];

  try {
    // Check all required files and directories exist
    for (const file of requiredFiles) {
      const filePath = path.join(installPath, file);
      await fs.access(filePath);
    }

    // Test configuration is readable
    const configPath = path.join(installPath, 'config', 'mcp.json');
    const config = JSON.parse(await fs.readFile(configPath, 'utf8'));

    if (!config.version || !config.installPath) {
      throw new Error('Invalid configuration file');
    }

    logger.info('Installation verified successfully');
    return true;
  } catch (error) {
    logger.error('Installation verification failed', error);
    throw new Error(`Installation verification failed: ${error.message}`);
  }
}

/**
 * Uninstall MCP
 */
export async function uninstallMCP(installPath = DEFAULT_INSTALL_PATH): Promise<void> {
  try {
    logger.info('Starting MCP uninstallation', { path: installPath });
    
    // Remove installation directory
    await fs.rm(installPath, { recursive: true, force: true });
    
    logger.info('MCP uninstalled successfully');
  } catch (error) {
    logger.error('Uninstallation failed', error);
    throw new Error(`Failed to uninstall MCP: ${error.message}`);
  }
}

/**
 * Update MCP to specified version
 */
export async function updateMCP(version: string): Promise<void> {
  try {
    logger.info('Starting MCP update', { version });
    
    // Get current installation path
    const configPath = path.join(DEFAULT_INSTALL_PATH, 'config', 'mcp.json');
    const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
    
    // Backup current installation
    const backupPath = `${config.installPath}.backup`;
    await fs.cp(config.installPath, backupPath, { recursive: true });
    
    try {
      // Attempt update
      await installMCP({ version, customPath: config.installPath, force: true });
      
      // Remove backup on success
      await fs.rm(backupPath, { recursive: true });
      
      logger.info('MCP updated successfully', { version });
    } catch (error) {
      // Restore from backup on failure
      await fs.rm(config.installPath, { recursive: true, force: true });
      await fs.cp(backupPath, config.installPath, { recursive: true });
      await fs.rm(backupPath, { recursive: true });
      
      throw error;
    }
  } catch (error) {
    logger.error('Update failed', error);
    throw new Error(`Failed to update MCP: ${error.message}`);
  }
}

// Utility functions
async function commandExists(command: string): Promise<boolean> {
  try {
    if (process.platform === 'win32') {
      await executeCommand(`where ${command}`);
    } else {
      await executeCommand(`which ${command}`);
    }
    return true;
  } catch {
    return false;
  }
}

async function executeCommand(command: string): Promise<string> {
  return new Promise((resolve, reject) => {
    require('child_process').exec(command, (error: Error | null, stdout: string) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}