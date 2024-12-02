import { ModelContext } from './modelContextProtocol';

export interface ModelResponse {
  content: string;
  tokens: number;
  modelId: string;
}

export interface ModelRequestOptions {
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
}

export class ModelIntegration {
  private apiKeys: Map<string, string> = new Map();
  private endpointUrls: Map<string, string> = new Map();

  constructor() {
    // Default endpoints for common models
    this.endpointUrls.set('anthropic', 'https://api.anthropic.com/v1/messages');
    this.endpointUrls.set('openai', 'https://api.openai.com/v1/chat/completions');
  }

  public async setApiKey(provider: string, apiKey: string): Promise<void> {
    this.apiKeys.set(provider, apiKey);
  }

  public async setEndpoint(provider: string, url: string): Promise<void> {
    this.endpointUrls.set(provider, url);
  }

  public async generateResponse(
    context: ModelContext,
    prompt: string,
    options: ModelRequestOptions = {}
  ): Promise<ModelResponse> {
    const provider = this.getProviderFromModel(context.modelId);
    const apiKey = this.apiKeys.get(provider);
    const endpoint = this.endpointUrls.get(provider);

    if (!apiKey || !endpoint) {
      throw new Error(`API key or endpoint not configured for provider: ${provider}`);
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };

    const requestBody = this.formatRequestBody(
      provider,
      context.modelId,
      prompt,
      options
    );

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return this.parseModelResponse(provider, data);
    } catch (error) {
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }

  private getProviderFromModel(modelId: string): string {
    if (modelId.startsWith('gpt-')) return 'openai';
    if (modelId.startsWith('claude-')) return 'anthropic';
    throw new Error(`Unknown provider for model: ${modelId}`);
  }

  private formatRequestBody(
    provider: string,
    modelId: string,
    prompt: string,
    options: ModelRequestOptions
  ): any {
    switch (provider) {
      case 'anthropic':
        return {
          model: modelId,
          messages: [{role: "user", content: prompt}],
          max_tokens: options.maxTokens,
          temperature: options.temperature,
          stop_sequences: options.stopSequences
        };

      case 'openai':
        return {
          model: modelId,
          messages: [{role: "user", content: prompt}],
          max_tokens: options.maxTokens,
          temperature: options.temperature,
          stop: options.stopSequences
        };

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private parseModelResponse(provider: string, response: any): ModelResponse {
    switch (provider) {
      case 'anthropic':
        return {
          content: response.messages[0].content,
          tokens: response.usage.total_tokens,
          modelId: response.model
        };

      case 'openai':
        return {
          content: response.choices[0].message.content,
          tokens: response.usage.total_tokens,
          modelId: response.model
        };

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }
}