import {
  IBindingErrorState,
  IBindingState,
  IBoundMethodState,
  IDefinedPropertyState,
  IExistingBindState,
  IInitialBindingState,
  IPrototypeMethodState
} from './interfaces';

/**
 * Base class for all binding states
 */
export class BaseBindingState {
  readonly instance!: object;
  readonly methodName!: string | symbol;
  readonly enumerable!: boolean;

  constructor(data: IBindingState) {
    this.validateInstance(data.instance);
    this.validateMethodName(data.methodName);

    const properties = {
      instance: { value: data.instance, writable: false, enumerable: true },
      methodName: { value: data.methodName, writable: false, enumerable: true },
      enumerable: { value: data.enumerable, writable: false, enumerable: true }
    };

    Object.defineProperties(this, properties);
  }

  protected validateInstance(instance: unknown): void {
    if (!instance) {
      throw new TypeError('Instance must be provided');
    }
  }

  protected validateMethodName(methodName: unknown): void {
    if (!methodName) {
      throw new TypeError('Method name must be provided');
    }
  }
}

/**
 * Initial binding state implementation
 */
export class InitialBindingState
  extends BaseBindingState
  implements IInitialBindingState {
  readonly target!: object;
  readonly method!: () => void;

  constructor(data: IInitialBindingState) {
    super(data);

    this.validateTarget(data.target);
    this.validateMethod(data.method);

    const properties = {
      target: { value: data.target, writable: false, enumerable: true },
      method: { value: data.method, writable: false, enumerable: true }
    };

    Object.defineProperties(this, properties);
    Object.freeze(this);
  }

  private validateTarget(target: unknown): void {
    if (!target) {
      throw new TypeError('Target must be provided');
    }
  }

  private validateMethod(method: unknown): void {
    if (typeof method !== 'function') {
      throw new TypeError('Method must be a function');
    }
  }
}

export class PrototypeMethodState
  extends BaseBindingState
  implements IPrototypeMethodState {
  readonly target: object;
  readonly method: () => void;
  readonly isPrototype = true;
  readonly previousState: IBindingState;

  constructor(data: Omit<IPrototypeMethodState, 'isPrototype'>) {
    super(data);
    this.target = data.target;
    this.method = data.method;
    this.previousState = data.previousState;
  }
}

export class ExistingBindState extends BaseBindingState implements IExistingBindState {
  readonly boundMethod: () => void;
  readonly isExisting = true;
  readonly previousState: IBindingState;

  constructor(data: Omit<IExistingBindState, 'isExisting'>) {
    super(data);
    this.boundMethod = data.boundMethod;
    this.previousState = data.previousState;
  }
}

export class BoundMethodState extends BaseBindingState implements IBoundMethodState {
  readonly boundMethod: () => void;
  readonly bindingTime: number;
  readonly previousState: IBindingState;

  constructor(data: IBoundMethodState) {
    super(data);
    this.boundMethod = data.boundMethod;
    this.bindingTime = data.bindingTime;
    this.previousState = data.previousState;
  }
}

export class DefinedPropertyState
  extends BoundMethodState
  implements IDefinedPropertyState {
  readonly propertyDescriptor: PropertyDescriptor;
  readonly definitionTime: number;

  constructor(data: IDefinedPropertyState) {
    super(data);
    this.propertyDescriptor = data.propertyDescriptor;
    this.definitionTime = data.definitionTime;
  }
}

export class BindingErrorState extends BaseBindingState implements IBindingErrorState {
  readonly error: string;
  readonly errorTime: number;
  readonly failedOperation: 'bind' | 'define';
  readonly previousState: IBindingState;

  constructor(data: IBindingErrorState) {
    super(data);
    this.error = data.error;
    this.errorTime = data.errorTime;
    this.failedOperation = data.failedOperation;
    this.previousState = data.previousState;
  }
}

export type MethodProcessedState =
  | PrototypeMethodState
  | ExistingBindState
  | BindingErrorState
  | DefinedPropertyState;