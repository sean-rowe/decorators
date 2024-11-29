/**
 * The IHasInstance interface is designed to provide a contract for classes
 * that have a property representing an instance of an object.
 * It contains a single read-only property, `instance`,
 * which holds a reference to an object.
 *
 * Implementing this interface allows you to standardize the way
 * instance references are accessed within your application.
 *
 * Properties:
 * - `instance`: A read-only property that should return an Object.
 */
export interface IHasInstance {
  readonly instance: object;
}

/**
 * The IHasMethodName interface defines a contract for objects that expose a method name property.
 * This property represents the name of a method, and it can be of type string or symbol.
 * The methodName is intended to be read-only, indicating that it cannot be modified after being set.
 */
export interface IHasMethodName {
  readonly methodName: string | symbol;
}

/**
 * Interface representing an object that has an enumerable property.
 *
 * The IHasEnumerable interface defines a contract for objects that include
 * a boolean property indicating whether the object or its properties can be
 * enumerated. This is typically relevant for tasks such as iteration, where
 * one needs to know if a property can be traversed.
 *
 * Properties:
 * @property {boolean} enumerable - A read-only boolean value that indicates
 * whether the object or its properties are enumerable.
 */
export interface IHasEnumerable {
  readonly enumerable: boolean;
}

/**
 * The IHasTarget interface defines an object that contains a target.
 * This target is represented by an immutable property.
 *
 * The primary purpose of the interface is to enforce a contract
 * for objects that inherently have a target as part of their structure.
 */
export interface IHasTarget {
  readonly target: object;
}

/**
 * Interface representing an entity that has a method.
 *
 * The IHasMethod interface requires implementing objects to provide a
 * readonly property named `method` that is a function. This allows for
 * consistent access to a specified method across different implementations.
 *
 * @interface
 * @property {Function} method - The method associated with the implementing object.
 *                               This property is read-only and must be implemented
 *                               as a function by any class that uses this interface.
 */
export interface IHasMethod {
  readonly method: () => void;
}

/**
 * Interface representing an entity that maintains a record of its previous state.
 *
 * The `IHasPreviousState` interface is designed for objects that need to keep track of a historical state.
 * It provides a property to access this prior state.
 *
 * @interface IHasPreviousState
 * @property {IBindingState} previousState - The read-only property that holds the previous state of the object.
 */
export interface IHasPreviousState {
  readonly previousState: IBindingState;
}

/**
 * Interface representing an entity that has a bound method.
 *
 * The IHasBoundMethod interface defines a contract for objects that
 * include a method which is bound to a specific instance. This ensures
 * that the method retains the correct context (`this` value) when passed
 * as a callback or used in other asynchronous operations.
 *
 * Properties:
 * @property {Function} boundMethod - A read-only function that is bound
 *                                    to the instance, preserving the
 *                                    intended execution context.
 */
export interface IHasBoundMethod {
  readonly boundMethod: () => void;
}

/**
 * Interface representing an object that is associated with a specific binding time.
 *
 * Objects implementing this interface provide a way to retrieve a binding time value,
 * which indicates the time at which a particular binding occurs. The binding time can
 * be used to determine the order or timing of operations or processes that rely on binding.
 */
export interface IHasBindingTime {
  readonly bindingTime: number;
}

/**
 * Interface representing an entity that can have an error.
 *
 * This interface is designed to encapsulate the details of an error, including
 * the error message, the time the error occurred, and the specific operation
 * that failed resulting in this error. Implementers of this interface can be
 * used to handle and manage errors in a consistent manner.
 */
export interface IHasError {
  readonly error: string;
  readonly errorTime: number;
  readonly failedOperation: 'bind' | 'define';
}

/**
 * IBindingState is an interface that defines the state of an object's method binding configuration.
 * It extends three other interfaces: IHasInstance, IHasMethodName, and IHasEnumerable.
 *
 * - IHasInstance: Ensures that the implementing object maintains an instance property or method
 *   that provides access or reflection capabilities related to instances.
 *
 * - IHasMethodName: Requires the implementing object to maintain a method name property or
 *   mechanism which is used to identify or manage method interactions.
 *
 * - IHasEnumerable: Dictates that the implementing object should have characteristics or behaviors
 *   that allow for enumeration, typically over object properties or similar structures.
 *
 * This interface is commonly used in contexts where method binding configurations are required,
 * and it serves to abstract the binding details, allowing for consistent and structured access
 * and management of these settings across different implementations.
 */
export interface IBindingState extends IHasInstance, IHasMethodName, IHasEnumerable {
}

/**
 * IInitialBindingState is an interface that extends IBindingState, IHasTarget, and IHasMethod.
 * This interface represents the initial state of a binding process, combining the characteristics
 * of the associated interfaces. It is designed to be used in scenarios where an object's binding
 * state needs to be managed with additional details about the method and target involved.
 *
 * While extending the capabilities of IBindingState, it also incorporates the traits from
 * IHasTarget and IHasMethod, ensuring a comprehensive representation of the object's
 * configuration in a binding context.
 *
 * Extending Interfaces:
 * - IBindingState: Provides the foundational binding state functionalities.
 * - IHasTarget: Ensures the presence of target-related information.
 * - IHasMethod: Ensures the inclusion of method-specific details.
 */
export interface IInitialBindingState extends IBindingState, IHasTarget, IHasMethod {
}

/**
 * State for prototype chain access
 */
export interface IPrototypeMethodState
  extends IBindingState,
    IHasTarget,
    IHasMethod,
    IHasPreviousState {
  readonly isPrototype: true;
}

/**
 * State for existing bound methods
 */
export interface IExistingBindState
  extends IBindingState,
    IHasBoundMethod,
    IHasPreviousState {
  readonly isExisting: true;
}

/**
 * State for newly bound methods
 */
export interface IBoundMethodState
  extends IBindingState,
    IHasBoundMethod,
    IHasBindingTime,
    IHasPreviousState {
}

/**
 * State for defined properties
 */
export interface IDefinedPropertyState extends IBoundMethodState {
  readonly propertyDescriptor: PropertyDescriptor;
  readonly definitionTime: number;
}

/**
 * Error state interface
 */
export interface IBindingErrorState
  extends IBindingState,
    IHasError,
    IHasPreviousState {
}

/**
 * Input state for error transitions
 */
export interface IErrorTransitionState extends IBindingState {
  readonly error: string;
  readonly failedOperation: 'bind' | 'define';
}