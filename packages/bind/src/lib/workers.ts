import { IBoundMethodState, IErrorTransitionState, IInitialBindingState } from './interfaces';
import {
  BindingErrorState,
  BoundMethodState,
  DefinedPropertyState,
  ExistingBindState,
  PrototypeMethodState
} from './states';
import { BindingError } from './errors';

/**
 * Worker that retrieves original methods
 */
export class RetrieveOriginalMethodWorker {
  static retrieveFromPrototype(
    state: IInitialBindingState
  ): PrototypeMethodState {
    return new PrototypeMethodState({
      ...state,
      previousState: state
    });
  }
}

/**
 * Worker that retrieves existing bindings
 */
export class RetrieveExistingBindingWorker {
  static retrieveFromInstance(state: IInitialBindingState): ExistingBindState {
    return new ExistingBindState({
      ...state,
      boundMethod:
        state.instance[state.methodName as keyof typeof state.instance],
      previousState: state
    });
  }
}

/**
 * Worker that creates method bindings
 */
export class CreateMethodBindingWorker {
  static bindToInstance(state: IInitialBindingState): BoundMethodState {
    BindingError.assertCanBind(state);

    return new BoundMethodState({
      ...state,
      boundMethod: state.method.bind(state.instance),
      bindingTime: Date.now(),
      previousState: state
    });
  }
}

/**
 * Worker that defines properties
 */
export class DefinePropertyWorker {
  static defineOnInstance(state: IBoundMethodState): DefinedPropertyState {
    const descriptor: PropertyDescriptor = {
      value: state.boundMethod,
      configurable: true,
      writable: true,
      enumerable: state.enumerable
    };

    Object.defineProperty(state.instance, state.methodName, descriptor);

    return new DefinedPropertyState({
      ...state,
      propertyDescriptor: descriptor,
      definitionTime: Date.now(),
      previousState: state
    });
  }
}

/**
 * Worker that creates error states
 */
export class ErrorTransitionWorker {
  static createErrorState(state: IErrorTransitionState): BindingErrorState {
    return new BindingErrorState({
      ...state,
      errorTime: Date.now(),
      previousState: state
    });
  }
}