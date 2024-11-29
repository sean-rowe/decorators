# @Bind Decorator

The `@Bind` decorator ensures that a method is always bound to its class instance, regardless of how it's called. This eliminates the need for manual `.bind()` calls and ensures consistent `this` context.

## Usage

Apply `@Bind` to class methods:

```typescript
class MyClass {
  value = 1;

  @Bind()
  myMethod() {
    return this.value;
  }
}

const instance = new MyClass();
const unboundMethod = instance.myMethod;

// unboundMethod() will still correctly reference 'this'
console.log(unboundMethod()); // Output: 1
```

## Benefits

* **Consistent `this`:**  Guarantees that the method's `this` always refers to the class instance, even when called as a callback or detached from the instance.
* **Simplified Code:** Eliminates the need for manual `.bind(this)` calls, making code cleaner and easier to read.
* **Event Handlers:** Ideal for event handlers, ensuring they always have the correct context.
* **Memory Efficiency:** Reuses the same bound function, optimizing performance and memory usage.
* **Preserves Descriptors:** Maintains property descriptors, ensuring compatibility with other libraries and tools.

## Error Handling

Applying `@Bind` to non-method properties will result in a `TypeError`.
