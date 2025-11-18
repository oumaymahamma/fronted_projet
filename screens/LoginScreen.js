import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
      navigation.navigate('Home');
    } catch (error) {
      console.log('Erreur de connexion:', error.response?.data || error.message);
      Alert.alert('Erreur', 'Identifiants invalides ou problème réseau');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >

        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Illustration */}
        <Image source={require('../assets/login.png')} style={styles.image} />

        {/* Title */}
        <Text style={styles.title}>Sign In</Text>

        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="User name"
          value={email}
          onChangeText={setEmail}
          editable={!isLoading}
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!isLoading}
        />

        {/* Login Button */}
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Log in</Text>
          )}
        </TouchableOpacity>

        {/* Sign Up Link */}
        <Text style={styles.bottomText}>
          Don't Have An Account ?  
          <Text onPress={() => navigation.navigate('Register')} style={styles.signUpText}>  Sign Up</Text>
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1,
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 30
  },
  backBtn: {
    marginBottom: 10,
  },
  image: {
    width: 220,
    height: 220,
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#6DB47C',
    marginBottom: 20,
  },
  input: { 
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 }
  },
  button: {
    backgroundColor: '#9BD79F',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: { 
    color: 'white', 
    fontSize: 17,
    fontWeight: 'bold',
  },
  bottomText: {
    textAlign: 'center',
    marginTop: 18,
    fontSize: 14,
    color: '#000',
  },
  signUpText: {
    color: '#6DB47C',
    fontWeight: '600'
  },
});
