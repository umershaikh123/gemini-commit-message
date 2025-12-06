# AutoDoc: AI-Powered Documentation

## _"Write code, not comments. Let AI handle the docs."_

---

## 1. The Problem

Writing high-quality documentation is crucial for maintainable code, but it's often a tedious and time-consuming task that gets skipped during tight deadlines. Manually documenting every function, its parameters, and its return value is repetitive work that distracts from solving core business problems. This results in a knowledge gap, making it difficult for new developers to onboard and for existing developers to remember the intricacies of their own code.

## 2. The Solution: AutoDoc

**AutoDoc** is a VS Code extension that acts as your personal "senior dev" documentation partner. It leverages the power of Large Language Models (like Google's Gemini) to automatically generate rich, professional, and context-aware documentation comments for your code with a single command.

By analyzing the function signature, body, and surrounding code, AutoDoc generates docstrings that are not just descriptive but also insightful, explaining the "why" behind the code, not just the "what."

## 3. Core Features

-   **One-Click Generation:** Right-click any function or method and select "Generate Documentation" from the context menu.
-   **Intelligent Analysis:** The AI model analyzes the function's logic to infer purpose, identify complex operations, and understand edge cases.
-   **Professional Formatting:** Generates documentation that adheres to standard formats like JSDoc (for JavaScript/TypeScript), PyDoc (for Python), and others.
-   **Parameter & Return Value Inference:** Automatically describes each parameter and infers the type and purpose of the return value, even for complex or untyped code.
-   **Language Agnostic:** Designed to support a wide variety of popular programming languages.

## 4. Example Workflow

Imagine you have this TypeScript function:

**Before:**
```typescript
function calculateDiscount(price, quantity, loyaltyLevel) {
    if (price <= 0 || quantity <= 0) {
        throw new Error("Price and quantity must be positive.");
    }

    let discount = 0;
    if (quantity > 10) {
        discount += 0.1; // 10% discount for bulk orders
    }

    if (loyaltyLevel === 'gold') {
        discount += 0.05; // Extra 5% for gold members
    } else if (loyaltyLevel === 'silver') {
        discount += 0.02; // Extra 2% for silver members
    }

    const finalPrice = price * quantity * (1 - discount);
    return Math.max(0, finalPrice);
}
```

**After running AutoDoc:**
```typescript
/**
 * Calculates the final price of an item after applying applicable discounts based on quantity and customer loyalty level.
 *
 * This function applies a bulk discount for orders of more than 10 items and adds an additional
 * tiered discount for 'gold' or 'silver' level loyalty members. It ensures that the final price cannot be negative.
 *
 * @param {number} price - The base price of a single item. Must be a positive number.
 * @param {number} quantity - The number of items being purchased. Must be a positive integer.
 * @param {'gold' | 'silver' | 'bronze'} loyaltyLevel - The loyalty status of the customer.
 * @returns {number} The calculated final price after all discounts are applied.
 * @throws {Error} If the price or quantity are not positive numbers.
 */
function calculateDiscount(price, quantity, loyaltyLevel) {
    // ... function body
}
```

## 5. Future Roadmap

-   [ ] Support for documenting entire classes, including properties and methods.
-   [ ] "Update Documentation" command to refresh docs after a function's logic has changed.
-   [ ] Configurable documentation styles and strictness levels.
-   [ ] Integration with `package.json` to read dependency descriptions for better context.

---
