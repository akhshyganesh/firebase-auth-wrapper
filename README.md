### Usage
When using the `AuthProvider` in your application, you can now pass the Firebase configuration as a prop:

```javascript
import { AuthProvider } from 'firebase-auth-wrapper';

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
    <AuthProvider config={firebaseConfig}>
      <ExampleComponent />
    </AuthProvider>
  );
}
```

This approach allows you to define the Firebase configuration outside of the `AuthProvider` and pass it dynamically where the provider is used, enhancing modularity and security.

```javascript
import React from 'react';
import { useAuth } from 'firebase-auth-wrapper';

function ExampleComponent() {
  const {
    currentUser,
    login,
    signup,
    logout,
    resetPassword
  } = useAuth();

  return (
    <div>
      <h1>Welcome {currentUser?.email}</h1>
      <button onClick={() => login('email@example.com', 'password')}>Login</button>
      <button onClick={() => signup('email@example.com', 'password')}>Signup</button>
      <button onClick={() => logout()}>Logout</button>
      <button onClick={() => resetPassword('email@example.com')}>Reset Password</button>
    </div>
  );
}

export default ExampleComponent;
```
