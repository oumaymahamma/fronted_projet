import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import api from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/register/', { username, email, password });
      const { access, refresh } = response.data;
     
      await AsyncStorage.setItem('access_token', access);
      await AsyncStorage.setItem('refresh_token', refresh);

      Alert.alert('Succès', 'Inscription réussie !');
      navigation.navigate('Profile');
    } catch (error) {
      console.log('Erreur d\'inscription:', error.response?.data || error.message);

      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.email) {
          Alert.alert('Erreur', 'Cet email est déjà utilisé');
        } else if (errorData.username) {
          Alert.alert('Erreur', 'Ce nom d\'utilisateur est déjà pris');
        } else {
          Alert.alert('Erreur', 'Données invalides');
        }
      } else {
        Alert.alert('Erreur', 'Impossible de s\'inscrire');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>

          {/* Back Button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>

          {/* Illustration */}
          <Image source={require('../assets/register.png')} style={styles.image} />

          {/* Title */}
          <Text style={styles.title}>Sign Up</Text>

          <TextInput
            style={styles.input}
            placeholder="User name"
            value={username}
            onChangeText={setUsername}
            editable={!isLoading}
          />

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
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
          />

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.bottomText}>
            Already Have An Account ?
            <Text onPress={() => navigation.navigate('Login')} style={styles.signInText}>  Sign In</Text>
          </Text>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: { 
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 30,
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
  signInText: {
    color: '#6DB47C',
    fontWeight: '600'
  },
});
