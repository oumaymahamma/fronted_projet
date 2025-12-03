import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, alert } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      alert.showAlert('Veuillez remplir tous les champs', 'error');
      return;
    }

    setIsLoading(true);
    await login({ username, password });
    setIsLoading(false);
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
        {/* Back button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Illustration */}
        <Image
          source={require('../assets/login.png')}
          style={styles.image}
        />

        {/* Title */}
        <Text style={styles.title}>Sign In</Text>

        {/* Username */}
        <TextInput
          style={styles.input}
          placeholder="User name"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
        />

        {/* Password */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
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
          <Text
            onPress={() => navigation.navigate('Register')}
            style={styles.signUpText}
          >
            {' '}Sign Up
          </Text>
        </Text>

      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
    shadowOffset: { width: 0, height: 2 },
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
    fontWeight: '600',
  },
});

export default LoginScreen;
