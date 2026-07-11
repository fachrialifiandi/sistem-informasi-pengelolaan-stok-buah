import React, { useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  // Show premium loading screen when loading token from device storage
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F4F9F6]">
        <ActivityIndicator size="large" color="#006B44" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          cardStyle: { backgroundColor: '#F4F9F6' } 
        }}
      >
        {isAuthenticated ? (
          // Protected Screens (Dashboard)
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
        ) : (
          // Auth Screens (Login)
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
