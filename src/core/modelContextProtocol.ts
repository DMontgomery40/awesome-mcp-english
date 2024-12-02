import { EventEmitter } from 'events';

export interface ModelContext {
  contextId: string;
  modelId: string;
  state: any;
  metadata: {
    created: number;
    updated: number;
    tokens: number;
    maxTokens: number;
  };
}

export interface StateUpdate {
  type: 'append' | 'replace' | 'clear';
  content?: any;
  position?: number;
}

export class ModelContextManager extends EventEmitter {
  private contexts: Map<string, ModelContext> = new Map();
  
  constructor() {
    super();
  }

  public createContext(modelId: string, initialState: any = null): ModelContext {
    const contextId = this.generateContextId();
    const context: ModelContext = {
      contextId,
      modelId,
      state: initialState,
      metadata: {
        created: Date.now(),
        updated: Date.now(),
        tokens: 0,
        maxTokens: this.getModelMaxTokens(modelId)
      }
    };

    this.contexts.set(contextId, context);
    this.emit('contextCreated', context);
    return context;
  }

  public updateState(contextId: string, update: StateUpdate): void {
    const context = this.contexts.get(contextId);
    if (!context) throw new Error(`Context not found: ${contextId}`);

    switch (update.type) {
      case 'append':
        context.state = this.appendState(context.state, update.content);
        break;
      case 'replace':
        context.state = update.content;
        break;
      case 'clear':
        context.state = null;
        break;
    }

    context.metadata.updated = Date.now();
    context.metadata.tokens = this.calculateTokens(context.state);
    
    this.validateTokenLimit(context);
    this.emit('stateUpdated', context);
  }

  public getContext(contextId: string): ModelContext {
    const context = this.contexts.get(contextId);
    if (!context) throw new Error(`Context not found: ${contextId}`);
    return context;
  }

  public deleteContext(contextId: string): void {
    const context = this.contexts.get(contextId);
    if (context) {
      this.contexts.delete(contextId);
      this.emit('contextDeleted', context);
    }
  }

  private generateContextId(): string {
    return `ctx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private appendState(currentState: any, newContent: any): any {
    if (Array.isArray(currentState)) {
      return [...currentState, newContent];
    }
    if (typeof currentState === 'string') {
      return currentState + String(newContent);
    }
    if (currentState === null) {
      return newContent;
    }
    return newContent;
  }

  private calculateTokens(state: any): number {
    if (!state) return 0;
    const stateStr = typeof state === 'string' ? state : JSON.stringify(state);
    // Approximate token count - replace with actual tokenizer
    return Math.ceil(stateStr.length / 4);
  }

  private getModelMaxTokens(modelId: string): number {
    const tokenLimits: { [key: string]: number } = {
      'gpt-4': 8192,
      'gpt-3.5-turbo': 4096,
      'claude-2': 100000,
      'claude-instant': 100000
    };
    return tokenLimits[modelId] || 4096;
  }

  private validateTokenLimit(context: ModelContext): void {
    if (context.metadata.tokens > context.metadata.maxTokens) {
      throw new Error(`Token limit exceeded for context ${context.contextId}`);
    }
  }
}