import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";


const AuthContext = createContext();

export const AuthProvider = ({ children, config }) => {
  const [app, setApp] = useState(null);
  const [auth, setAuth] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    let appInstance = app
    let authInstance = auth
    if (!app) {
      appInstance = initializeApp(firebaseConfig);
      setApp(appInstance)
      authInstance = getAuth(app);
      setAuth(authInstance)
    }

    const unsubscribe = authInstance.onAuthStateChanged(user => {
      setCurrentUser(user);
      // setLoading(false);
    });

    return () => unsubscribe();
  }, [config]);

  const login = (email, password) => signInWithEmailAndPassword(email, password);

  const signup = (email, password) => createUserWithEmailAndPassword(email, password);

  const logout = () => signOut();

  const resetPassword = (email) => sendPasswordResetEmail(email);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
