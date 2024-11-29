import {
  CreateMethodBindingWorker,
  DefinePropertyWorker,
  ErrorTransitionWorker,
  RetrieveExistingBindingWorker,
  RetrieveOriginalMethodWorker
} from './workers';
import { MethodBindingInvestigator } from './investigators';
import { BoundMethodState, InitialBindingState, MethodProcessedState } from './states';
import { BindingError } from './errors';

/**
 * Coordinates the method binding workflow
 */
export class MethodBindingDelegator {
  constructor(
    private retrieveOriginalWorker: typeof RetrieveOriginalMethodWorker,
    private retrieveExistingWorker: typeof RetrieveExistingBindingWorker,
    private createMethodBindingWorker: typeof CreateMethodBindingWorker,
    private defineProperty: typeof DefinePropertyWorker,
    private errorTransition: typeof ErrorTransitionWorker,
    private investigator: typeof MethodBindingInvestigator
  ) {
  }

  process(state: InitialBindingState): MethodProcessedState {
    try {
      if (this.investigator.isPrototypeAccess(state)) {
        return this.retrieveOriginalWorker.retrieveFromPrototype(state);
      }

      if (this.investigator.hasExistingBinding(state)) {
        return this.retrieveExistingWorker.retrieveFromInstance(state);
      }

      const boundState: BoundMethodState =
        this.createMethodBindingWorker.bindToInstance(state);

      return this.defineProperty.defineOnInstance(boundState);
    } catch (error) {
      if (error instanceof BindingError) {
        return this.errorTransition.createErrorState({
          ...state,
          error: error.message,
          failedOperation: 'bind'
        });
      }
      throw error;
    }
  }
}