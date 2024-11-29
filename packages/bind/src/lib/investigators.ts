import { IInitialBindingState } from './interfaces';

export class MethodBindingInvestigator {
  /* Is this an access directly on the prototype? */
  static isPrototypeAccess(state: IInitialBindingState): boolean {
    return state.instance === state.target;
  }

  /* Does this instance already have its own bound version? */
  static hasExistingBinding(state: IInitialBindingState): boolean {
    return Object.prototype.hasOwnProperty.call(
      state.instance,
      state.methodName
    );
  }

  /* Should this method be bound to the prototype? */
  static shouldBindToPrototype(state: IInitialBindingState): boolean {
    // Changed: Now returns true for normal class instances
    return !(state.target.constructor === Object);
  }
}