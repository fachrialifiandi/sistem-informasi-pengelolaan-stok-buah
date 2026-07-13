import React, { useState, useEffect } from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { NotificationProvider } from './src/context/NotificationContext';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500); // Tampilkan splash screen selama 2.5 detik
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <NotificationProvider>
        <AuthProvider>
          {showSplash ? <SplashScreen /> : <AppNavigator />}
        </AuthProvider>
      </NotificationProvider>
    </SafeAreaProvider>
  );
}
