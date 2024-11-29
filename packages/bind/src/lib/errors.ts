import { IInitialBindingState } from './interfaces';
import { MethodBindingInvestigator } from './investigators';

/**
 * Error component for binding operations
 */
export class BindingError extends Error {
  static assertCanBind(state: IInitialBindingState): void {
    // Changed: Only prevent binding if we should NOT bind to prototype
    if (!MethodBindingInvestigator.shouldBindToPrototype(state)) {
      throw new BindingError(
        'Cannot bind: method should not bind to prototype'
      );
    }
  }
}

export class BindError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BindError';
  }
}