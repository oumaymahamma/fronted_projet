import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Image
} from 'react-native';

const TracksToHealth = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>

        {/* Illustration */}
        <Image
          source={require('../assets/track.png')} // change si ton image a un autre nom
          style={styles.image}
        />

        {/* Title */}
        <Text style={styles.mainTitle}>Track to Health</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Personalized meal plans and daily nutrition tips{"\n"}
          to help you achieve your fitness and{"\n"}
          wellness goals effortlessly.
        </Text>

        {/* Get Started Button */}
        <TouchableOpacity 
          style={styles.getStartedButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <Text style={styles.loginText}>
          Already Have An Account? 
          <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}> Log in</Text>
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 40,
  },
  image: {
    width: 260,
    height: 260,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  getStartedButton: {
    backgroundColor: '#9BD79F',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignItems: 'center',
    width: '80%',
    marginBottom: 25,
  },
  getStartedButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  loginText: {
    fontSize: 14,
    color: '#6c757d',
  },
  loginLink: {
    color: '#6DB47C',
    fontWeight: '600',
  }
});

export default TracksToHealth;
