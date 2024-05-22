# Firebase Authentication Wrapper

This module provides a React context for Firebase authentication, simplifying the process of handling user authentication in your React applications.

## Features

- User login and logout
- User signup
- Password reset
- Access to the current authenticated user
- Loading and error state handling

## Installation

Ensure you have firebase-auth-wrapper installed in your project. If not, you can add it via npm:

```bash
npm install firebase-auth-wrapper
```

## Setup

1. **Firebase Configuration:**
   Set up your Firebase project and obtain your Firebase configuration object. This typically includes keys like `apiKey`, `authDomain`, etc.

2. **Integrate the Authentication Provider:**
   Wrap your application's root component with the `AuthProvider` from this module, passing the Firebase configuration object to it.

   ```jsx
   import { AuthProvider } from firebase-auth-wrapper;

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };

   function App() {
     return (
       <AuthProvider firebaseConfig={firebaseConfig}>
         <YourComponent />
       </AuthProvider>
     );
   }
   ```

## Usage

You can use the `useAuth` hook to access authentication functionality within your components.

```jsx
import { useAuth } from firebase-auth-wrapper;

function LoginComponent() {
  const { login, loading, error } = useAuth();

  const handleLogin = async () => {
    await login('email@example.com', 'password123');
  };

  return (
    <div>
      {loading ? <p>Loading...</p> : <button onClick={handleLogin}>Login</button>}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```

## API

- **login(email, password):** Authenticate a user with email and password.
- **signup(email, password):** Register a new user with email and password.
- **logout():** Log out the current user.
- **resetPassword(email):** Send a password reset email to the user.
- **currentUser:** The currently logged-in user object.
- **loading:** Boolean indicating if an auth operation is in progress.
- **error:** Contains error information when an auth operation fails.
- **refreshToken:** The current session's refresh token.

## Notes

- Ensure your Firebase project is set up to handle authentication and that the necessary authentication methods are enabled (e.g., email/password, Google, etc.).
- This module uses sessionStorage to store the refresh token. Ensure your application is configured to handle sessions appropriately.
