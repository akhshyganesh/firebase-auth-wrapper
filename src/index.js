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

const REFRESH_TOKEN = '_fb_auth_tok'

export const AuthProvider = ({ children, firebaseConfig }) => {
  const [app, setApp] = useState(null);
  const [error, setError] = useState(null);
  const [auth, setAuth] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (refreshToken) {
      window.sessionStorage.setItem(REFRESH_TOKEN, refreshToken);
    }
  }, [refreshToken])

  const genRefreshToken = async (user = currentUser) => {
    if (user) {
      try {
        setLoading(true);
        const token = await user.getIdToken(true)
        setRefreshToken(token);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    let appInstance = app;
    let authInstance = auth;
    if (!app) {
      appInstance = initializeApp(firebaseConfig);
      setApp(appInstance);
      authInstance = getAuth(appInstance);
      setAuth(authInstance);
    }

    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      setCurrentUser(user);
      setLoading(false);
      genRefreshToken(user)
    });
    
    return () => unsubscribe();
  }, [firebaseConfig]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      genRefreshToken();
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  const signup = async (email, password) => {
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      genRefreshToken();
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setRefreshToken(null);
      window.sessionStorage.removeItem(REFRESH_TOKEN);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  const resetPassword = async (email) => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  const value = {
    loading,
    error,
    genRefreshToken,
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

export const getRefreshToken = () => window.sessionStorage.getItem(REFRESH_TOKEN)

export const useAuth = () => {
  return useContext(AuthContext);
};
