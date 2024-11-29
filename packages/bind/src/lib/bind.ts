import {
  BindingErrorState,
  DefinedPropertyState,
  ExistingBindState,
  InitialBindingState,
  MethodProcessedState,
  PrototypeMethodState
} from './states';
import { MethodBindingInvestigator } from './investigators';
import {
  CreateMethodBindingWorker,
  DefinePropertyWorker,
  ErrorTransitionWorker,
  RetrieveExistingBindingWorker,
  RetrieveOriginalMethodWorker
} from './workers';
import { MethodBindingDelegator } from './delegators';
import { BindError } from './errors';

/**
 * Method decorator that binds a method to the instance context, ensuring that the method
 * has the correct `this` reference when invoked. This is particularly useful for class methods
 * that are passed around as callbacks, maintaining their intended reference.
 *
 * @return {function(Object, string|symbol, PropertyDescriptor): PropertyDescriptor} A modified
 * PropertyDescriptor with the `get` accessor configured to provide a bound version of the original method.
 * The descriptor is configurable and retains the original method's enumerability.
 * Throws a BindError if an invalid state occurs during the binding process.
 */
export function Bind(): (
  arg0: object,
  arg1: string | symbol,
  arg2: PropertyDescriptor,
) => PropertyDescriptor {
  return function (
    target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor {
    const delegator = new MethodBindingDelegator(
      RetrieveOriginalMethodWorker,
      RetrieveExistingBindingWorker,
      CreateMethodBindingWorker,
      DefinePropertyWorker,
      ErrorTransitionWorker,
      MethodBindingInvestigator,
    );

    return {
      configurable: true,
      enumerable: descriptor.enumerable,
      get(this: object) {
        const state = new InitialBindingState({
          target,
          methodName: propertyKey,
          method: descriptor.value,
          instance: this,
          enumerable: descriptor.enumerable ?? false,
        });

        const result: MethodProcessedState = delegator.process(state);

        if (result instanceof PrototypeMethodState) {
          return result.method;
        }

        if (result instanceof ExistingBindState) {
          return result.boundMethod;
        }

        if (result instanceof DefinedPropertyState) {
          return result.boundMethod;
        }

        if (result instanceof BindingErrorState) {
          throw new BindError(result.error);
        }

        throw new BindError("Invalid state returned from delegator");
      },
    };
  };
}
