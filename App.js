import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './context/AuthContext';
import Alert from './components/Alert';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileFormScreen from './screens/ProfileFormScreen';
import TracksToHealth from './screens/TracksToHealth';
import { ActivityIndicator, View, Text } from 'react-native';
import RecommendationScreen from './screens/RecommendationScreen';
import MealDetailScreen from './screens/MealDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ChangePasswordScreen from './screens/ChangePasswordScreen';
import FruitDetectorScreen from './screens/FruitDetectorScreen';
import FavoritesScreen from './screens/FavoritesScreen';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const { user, isLoading, alert } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 15, fontSize: 16, color: '#666' }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false, // Désactive complètement le header bleu
          }}
        >
          {user ? (
            // Utilisateur connecté
            <>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="ProfileForm" component={ProfileFormScreen} />
              <Stack.Screen name="Recommendation" component={RecommendationScreen} />
              <Stack.Screen name="MealDetails" component={MealDetailScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="EditProfile" component={EditProfileScreen} />
              <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
              <Stack.Screen name="FruitDetector" component={FruitDetectorScreen} />
              <Stack.Screen name="Favorites" component={FavoritesScreen} />


            </>
          ) : (
            // Utilisateur non connecté
            <>
              <Stack.Screen name="Acceuil" component={TracksToHealth} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
      <Alert 
        visible={alert.visible} 
        message={alert.message} 
        type={alert.type} 
      />
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
