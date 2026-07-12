import React, { useContext } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { Feather } from '@expo/vector-icons';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import InventoryScreen from '../screens/InventoryScreen';
import RestockScreen from '../screens/RestockScreen';
import TransaksiScreen from '../screens/TransaksiScreen';
import StatsScreen from '../screens/StatsScreen';
import AddFruitScreen from '../screens/AddFruitScreen';
import StockOutScreen from '../screens/StockOutScreen';
import EditFruitScreen from '../screens/EditFruitScreen';
import SettingScreen from '../screens/SettingScreen';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import ReportDetailScreen from '../screens/ReportDetailScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator for Inventory nested inside Tab Navigator
function InventoryStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InventoryList" component={InventoryScreen} />
      <Stack.Screen name="Restock" component={RestockScreen} />
      <Stack.Screen name="AddFruit" component={AddFruitScreen} />
      <Stack.Screen name="EditFruit" component={EditFruitScreen} />
      <Stack.Screen name="StockOut" component={StockOutScreen} />
    </Stack.Navigator>
  );
}

// Tab Navigator setup for protected screens
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#ECEEF0',
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#006C49',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ color }) => {
          let iconName;
          if (route.name === 'DashboardTab') {
            iconName = 'grid';
          } else if (route.name === 'InventoryTab') {
            iconName = 'archive';
          } else if (route.name === 'TransaksiTab') {
            iconName = 'file-text';
          } else if (route.name === 'StatsTab') {
            iconName = 'bar-chart-2';
          }
          return <Feather name={iconName} size={18} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="DashboardTab" 
        component={DashboardScreen} 
        options={{ title: 'Dashboard' }} 
      />
      <Tab.Screen 
        name="InventoryTab" 
        component={InventoryStackNavigator} 
        options={{ title: 'Inventory' }} 
      />
      <Tab.Screen 
        name="TransaksiTab" 
        component={TransaksiScreen} 
        options={{ title: 'Transaksi' }} 
      />
      <Tab.Screen 
        name="StatsTab" 
        component={StatsScreen} 
        options={{ title: 'Stats' }} 
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-[#F4F9F6]">
        <ActivityIndicator size="large" color="#006C49" />
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
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="Setting" component={SettingScreen} />
            <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
            <Stack.Screen name="ReportDetail" component={ReportDetailScreen} />
          </>
        ) : (
          // Render Login Stack when logged out
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
