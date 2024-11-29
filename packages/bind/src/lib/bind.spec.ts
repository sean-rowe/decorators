import { describe, expect, test } from "vitest";
/// <reference lib="dom" />
import { Bind } from "./bind";

describe("Feature: Bind Decorator", () => {
  describe("Rule: Method calls must always execute in instance context", () => {
    test("Scenario: Execute bound method directly", () => {
      class Counter {
        count = 0;

        @Bind()
        increment() {
          this.count++;
          return this.count;
        }
      }

      const counter = new Counter();
      const incrementFn = counter.increment;
      const result = incrementFn();

      expect(counter.count).toBe(1);
      expect(result).toBe(1);
    });

    test("Scenario: Execute bound method as callback", () => {
      class Toggler {
        active = false;

        @Bind()
        toggle() {
          this.active = !this.active;
          return this.active;
        }
      }

      const toggler = new Toggler();
      const toggle = toggler.toggle;
      const result = toggle();

      expect(toggler.active).toBe(true);
      expect(result).toBe(true);
    });

    test("Scenario: Execute bound method with apply", () => {
      class Greeter {
        message = "Hello";

        @Bind()
        greet() {
          return this.message;
        }
      }

      const greeter = new Greeter();
      const greetFn = greeter.greet;
      const otherContext = { message: "Goodbye" };
      const result = greetFn.apply(otherContext);

      expect(result).toBe("Hello");
      expect(greeter.message).toBe("Hello");
    });
  });

  describe("Rule: Bound methods must retain instance across event listeners", () => {
    test("Scenario: Add bound method as event listener", () => {
      class Button {
        clicks = 0;

        @Bind()
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        handleClick(event: Event) {
          this.clicks++;
        }
      }

      const button = new Button();
      const clickEvent = new Event("click");

      // Get bound handler and call it
      const handler = button.handleClick;
      handler(clickEvent);

      expect(button.clicks).toBe(1);
    });

    test("Scenario: Remove bound event listener", () => {
      class Modal {
        closed = false;

        @Bind()
        handleEscape(event: KeyboardEvent) {
          if (event.key === "Escape") this.closed = true;
        }
      }

      const modal = new Modal();

      // Get multiple references - should be the same bound function
      const firstRef = modal.handleEscape;
      const secondRef = modal.handleEscape;

      expect(firstRef).toBe(secondRef);

      // Test the actual handler functionality
      const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
      firstRef(escapeEvent);
      expect(modal.closed).toBe(true);
    });
  });

  describe("Rule: Bound methods must be memory efficient", () => {
    test("Scenario: Reuse bound method reference", () => {
      class Handler {
        callCount = 0;

        @Bind()
        handle() {
          this.callCount++;
        }
      }

      const handler = new Handler();
      const refs = new Set();

      // Multiple accesses should return the same bound function
      for (let i = 0; i < 5; i++) {
        refs.add(handler.handle);
      }

      expect(refs.size).toBe(1);

      // Additional verification: the bound function works
      const boundFn = handler.handle;
      boundFn();
      expect(handler.callCount).toBe(1);
    });

    test("Scenario: Preserve method on prototype access", () => {
      class Example {
        @Bind()
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        method() {}
      }

      const example = new Example();

      // Direct prototype access should return original method
      const protoMethod = Object.getPrototypeOf(example).method;
      expect(protoMethod).toBeDefined();
      expect(typeof protoMethod).toBe("function");

      // Instance access should return bound method
      const boundMethod = example.method;
      expect(boundMethod).not.toBe(protoMethod);
    });
  });

  describe("Rule: Bound methods must preserve property descriptor characteristics", () => {
    test("Scenario: Maintain property descriptors", () => {
      class Example {
        @Bind()
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        visible() {}
      }

      const example = new Example();

      // Check prototype descriptor
      const protoDescriptor = Object.getOwnPropertyDescriptor(
        Example.prototype,
        "visible",
      );
      expect(protoDescriptor?.configurable).toBe(true);
      expect(protoDescriptor?.enumerable).toBe(false);

      // After accessing bound method, check instance descriptor
      // @ts-expect-error for testing
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const boundMethod = example.visible;
      const instanceDescriptor = Object.getOwnPropertyDescriptor(
        example,
        "visible",
      );

      expect(instanceDescriptor?.configurable).toBe(true);
      expect(instanceDescriptor?.writable).toBe(true);
      expect(instanceDescriptor?.enumerable).toBe(false);
    });

    test("Scenario: Handle non-method properties", () => {
      expect(() => {
        class Invalid {
          // @ts-expect-error for testing
          @Bind()
          property = "not a method";
        }
        new Invalid();
      }).toThrow(TypeError);
    });

    test("Scenario: Preserve method on multiple accesses", () => {
      class Example {
        @Bind()
        method() {
          return this;
        }
      }

      const example = new Example();
      const firstAccess = example.method;
      const secondAccess = example.method;

      expect(firstAccess).toBe(secondAccess);
      expect(firstAccess()).toBe(example);
      expect(secondAccess()).toBe(example);
    });
  });
});
