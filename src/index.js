import { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "firebase/auth";

const AuthContext = createContext();
const REFRESH_TOKEN = '_fb_auth_tok';

export const AuthProvider = ({ children, firebaseConfig }) => {
  const [app, setApp] = useState(() => initializeApp(firebaseConfig));
  const [auth, setAuth] = useState(() => getAuth(app));
  const [error, setError] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (refreshToken) {
      window.sessionStorage.setItem(REFRESH_TOKEN, refreshToken);
    }
  }, [refreshToken]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        user.getIdToken(true).then(setRefreshToken).catch(console.error);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  const handleAuthOperation = async (operation, ...params) => {
    try {
      setLoading(true);
      await operation(auth, ...params);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const login = (email, password) => handleAuthOperation(signInWithEmailAndPassword, email, password);
  const signup = (email, password) => handleAuthOperation(createUserWithEmailAndPassword, email, password);
  const logout = async () => {
    await handleAuthOperation(signOut)
    window.sessionStorage.removeItem(REFRESH_TOKEN);
  };
  const resetPassword = (email) => handleAuthOperation(sendPasswordResetEmail, email);

  const value = {
    loading,
    error,
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    refreshToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const getRefreshToken = () => window.sessionStorage.getItem(REFRESH_TOKEN);
export const useAuth = () => useContext(AuthContext);
