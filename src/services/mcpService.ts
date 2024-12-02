import { ModelContextManager, ModelIntegration, ModelContext, StateUpdate } from '../core';

export class MCPService {
  private contextManager: ModelContextManager;
  private modelIntegration: ModelIntegration;
  private static instance: MCPService;

  private constructor() {
    this.contextManager = new ModelContextManager();
    this.modelIntegration = new ModelIntegration();
    this.setupEventListeners();
  }

  public static getInstance(): MCPService {
    if (!MCPService.instance) {
      MCPService.instance = new MCPService();
    }
    return MCPService.instance;
  }

  public async initialize(config: {
    apiKeys: { [provider: string]: string },
    endpoints?: { [provider: string]: string }
  }): Promise<void> {
    // Set up API keys for each provider
    for (const [provider, apiKey] of Object.entries(config.apiKeys)) {
      await this.modelIntegration.setApiKey(provider, apiKey);
    }

    // Set up custom endpoints if provided
    if (config.endpoints) {
      for (const [provider, endpoint] of Object.entries(config.endpoints)) {
        await this.modelIntegration.setEndpoint(provider, endpoint);
      }
    }
  }

  public createContext(modelId: string): ModelContext {
    return this.contextManager.createContext(modelId);
  }

  public async processInput(
    contextId: string,
    input: string,
    options: {
      temperature?: number;
      maxTokens?: number;
      stopSequences?: string[];
    } = {}
  ): Promise<string> {
    const context = this.contextManager.getContext(contextId);
    
    // Update context with user input
    const userUpdate: StateUpdate = {
      type: 'append',
      content: { role: 'user', content: input }
    };
    this.contextManager.updateState(contextId, userUpdate);

    // Generate model response
    const response = await this.modelIntegration.generateResponse(
      context,
      input,
      options
    );

    // Update context with model response
    const assistantUpdate: StateUpdate = {
      type: 'append',
      content: { role: 'assistant', content: response.content }
    };
    this.contextManager.updateState(contextId, assistantUpdate);

    return response.content;
  }

  public getContext(contextId: string): ModelContext {
    return this.contextManager.getContext(contextId);
  }

  public deleteContext(contextId: string): void {
    this.contextManager.deleteContext(contextId);
  }

  private setupEventListeners(): void {
    this.contextManager.on('contextCreated', (context: ModelContext) => {
      console.log('Context created:', context.contextId);
    });

    this.contextManager.on('stateUpdated', (context: ModelContext) => {
      console.log('State updated for context:', context.contextId);
    });

    this.contextManager.on('contextDeleted', (context: ModelContext) => {
      console.log('Context deleted:', context.contextId);
    });
  }
}

// Export a singleton instance
export const mcpService = MCPService.getInstance();