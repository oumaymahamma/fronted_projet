import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState({ visible: false, message: '', type: '' });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const showAlert = (message, type = 'success') => {
    setAlert({ visible: true, message, type });
    setTimeout(() => {
      setAlert({ visible: false, message: '', type: '' });
    }, 3000);
  };

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getProfile();
      const userProfile = response.data;
      await AsyncStorage.setItem('userData', JSON.stringify(userProfile));
      setUser(userProfile);
      return userProfile;
    } catch (error) {
      console.log('Erreur récupération profil:', error);
      throw error;
    }
  };

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const userData = await AsyncStorage.getItem('userData');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        
        try {
          await fetchUserProfile();
        } catch (error) {
          console.log('Rafraîchissement profil échoué:', error);
        }
      }
    } catch (error) {
      console.log('Erreur vérification auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const { tokens } = response.data;
      
      await AsyncStorage.setItem('accessToken', tokens.access);
      await AsyncStorage.setItem('refreshToken', tokens.refresh);
      
      const userProfile = await fetchUserProfile();
      
      showAlert('Connexion réussie!', 'success');
      return { success: true, user: userProfile };
      
    } catch (error) {
      const message = error.response?.data?.error || 'Erreur de connexion';
      showAlert(message, 'error');
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { tokens } = response.data;
      
      await AsyncStorage.setItem('accessToken', tokens.access);
      await AsyncStorage.setItem('refreshToken', tokens.refresh);
      
      const userProfile = await fetchUserProfile();
      
      showAlert('Compte créé avec succès!', 'success');
      return { success: true, user: userProfile };
      
    } catch (error) {
      let message = 'Erreur lors de la création du compte';
      
      if (error.response?.data) {
        const data = error.response.data;
        if (data.password) message = data.password[0];
        else if (data.username) message = data.username[0];
        else if (data.email) message = data.email[0];
        else if (typeof data === 'object') {
          message = Object.values(data)[0]?.[0] || message;
        }
      }
      
      showAlert(message, 'error');
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData']);
      setUser(null);
      showAlert('Déconnexion réussie', 'success');
    } catch (error) {
      console.log('Erreur déconnexion:', error);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      const updatedUser = { ...user, ...response.data.user };
      
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
      showAlert('Profil mis à jour avec succès!', 'success');
      return { success: true };
    } catch (error) {
      const message = 'Erreur lors de la mise à jour du profil';
      showAlert(message, 'error');
      return { success: false, error: message };
    }
  };

  // NOUVELLES FONCTIONS POUR LES INFORMATIONS PERSONNELLES ET MOT DE PASSE
  const updatePersonalInfo = async (personalData) => {
    try {
      const response = await authAPI.updatePersonalInfo(personalData);
      const updatedUser = { ...user, ...response.data.user };
      
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      setUser(updatedUser);
      showAlert('Informations personnelles mises à jour!', 'success');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de la mise à jour';
      showAlert(message, 'error');
      return { success: false, error: message };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await authAPI.changePassword(passwordData);
      showAlert('Mot de passe changé avec succès!', 'success');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Erreur lors du changement de mot de passe';
      showAlert(message, 'error');
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    isLoading,
    alert,
    login,
    register,
    logout,
    updateProfile,
    updatePersonalInfo,
    changePassword,
    showAlert,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};