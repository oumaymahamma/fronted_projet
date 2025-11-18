import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';
import TracksToHealth from './screens/TracksToHealth';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
       
      >
        <Stack.Screen 
          name="Welcome" 
          component={TracksToHealth}
         options={{ headerShown: false }}  
        />

         <Stack.Screen 
          name="Home" 
          component={HomeScreen}
         options={{ headerShown: false }}  
        />
        
        <Stack.Screen 
          name="Login" 
          component={LoginScreen}
          options={{ headerShown: false }}  
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
         options={{ headerShown: false }}  
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
         options={{ headerShown: false }}  
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}