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

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    setIsLoading(true);
    await register(formData);
    setIsLoading(false);
  };

  const isFormValid = () => {
    return (
      formData.username &&
      formData.email &&
      formData.password &&
      formData.password2 &&
      formData.password === formData.password2
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.container}>

        {/* Back Button */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Illustration */}
        <Image source={require('../assets/register.png')} style={styles.image} />

        {/* Title */}
        <Text style={styles.title}>Sign Up</Text>

        {/* Inputs */}
        <TextInput
          style={styles.input}
          placeholder="User name *"
          value={formData.username}
          onChangeText={(value) => handleChange('username', value)}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Email *"
          value={formData.email}
          onChangeText={(value) => handleChange('email', value)}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="First name"
          value={formData.first_name}
          onChangeText={(value) => handleChange('first_name', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Last name"
          value={formData.last_name}
          onChangeText={(value) => handleChange('last_name', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Password *"
          secureTextEntry
          value={formData.password}
          onChangeText={(value) => handleChange('password', value)}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm password *"
          secureTextEntry
          value={formData.password2}
          onChangeText={(value) => handleChange('password2', value)}
        />

        {/* Register Button */}
        <TouchableOpacity
          style={[styles.button, (!isFormValid() || isLoading) && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Link to Login */}
        <Text style={styles.bottomText}>
          Already have an account ?
          <Text
            style={styles.signInText}
            onPress={() => navigation.navigate('Login')}
          >
            {' '}Sign In
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
  signInText: {
    color: '#6DB47C',
    fontWeight: '600',
  },
});

export default RegisterScreen;
