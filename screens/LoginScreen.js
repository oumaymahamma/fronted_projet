import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/token/', { email, password });
      const { access, refresh } = response.data;

      await AsyncStorage.setItem('access_token', access);
      await AsyncStorage.setItem('refresh_token', refresh);

      Alert.alert('Succès', 'Connexion réussie !');
      navigation.navigate('Profile');
    } catch (error) {
      console.log('Erreur de connexion:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        Alert.alert('Erreur', 'Email ou mot de passe incorrect');
      } else if (error.response?.status === 400) {
        Alert.alert('Erreur', 'Données invalides');
      } else if (error.code === 'NETWORK_ERROR') {
        Alert.alert('Erreur', 'Problème de connexion. Vérifiez votre internet.');
      } else {
        Alert.alert('Erreur', 'Impossible de se connecter');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!isLoading}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
      />
      
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Se connecter</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity 
        onPress={() => navigation.navigate('Register')}
        disabled={isLoading}
      >
        <Text style={[styles.link, isLoading && styles.linkDisabled]}>
          Créer un compte
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: { 
    backgroundColor: 'white',
    borderWidth: 1, 
    borderColor: '#ddd',
    padding: 15, 
    marginVertical: 5, 
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: { 
    color: 'white', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: { 
    color: '#007bff', 
    marginTop: 15, 
    textAlign: 'center',
    fontSize: 16,
  },
  linkDisabled: {
    color: '#6c757d',
  }
});