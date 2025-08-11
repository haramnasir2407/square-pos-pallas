# for styling

https://panda-css.com/docs/concepts/slot-recipes

https://dev.to/shubhamtiwari909/react-context-api-vs-zustand-pki

## for error boundary

https://dev.to/rajeshkumaryadavdotcom/understanding-error-boundaries-in-nextjs-a-deep-dive-with-examples-fk0

useContext does not have built-in support for persisting state across sessions. If you need to persist state (e.g., across page reloads), you typically need to implement this manually using browser storage APIs like localStorage or sessionStorage. This requires additional code to save and retrieve context state from storage, and to initialize context state from storage on app startup.

Zustand has built-in support for persisting state. Zustand can easily integrate with browser storage APIs, allowing you to persist and rehydrate state with minimal boilerplate. This is typically achieved by using middleware provided by Zustand, such as zustand/middleware.

Your cart state will be saved to localStorage under the key cart-storage.
On page reload, Zustand will rehydrate the state from storage.

## to-do

- go thru auth.ts
