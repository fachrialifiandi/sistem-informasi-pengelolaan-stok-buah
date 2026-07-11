import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function DashboardScreen() {
  const { user, logout } = useContext(AuthContext);

  return (
    <SafeAreaView className="flex-1 bg-[#F4F9F6] justify-center items-center px-6">
      <StatusBar style="dark" />
      
      <View className="bg-white p-6 rounded-2xl w-full max-w-md border border-gray-100 shadow-md shadow-gray-200 items-center">
        {/* User avatar icon */}
        <View className="w-20 h-20 bg-[#E5F4EE] rounded-full items-center justify-center mb-4">
          <Feather name="user" size={40} color="#006B44" />
        </View>

        {/* User Detail Info */}
        <Text className="text-xl font-bold text-gray-800 mb-1">
          {user?.full_name || 'Pemilik Toko'}
        </Text>
        <Text className="text-gray-400 mb-4 text-sm">
          {user?.username || 'contoh@freshvitality.com'}
        </Text>
        
        {/* User Role Badge */}
        <View className="bg-[#E5F4EE] px-4 py-1.5 rounded-full mb-6">
          <Text className="text-[#006B44] font-bold text-xs uppercase tracking-wider">
            {user?.role || 'PEMILIK'}
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={logout}
          className="flex-row items-center justify-center bg-red-600 w-full py-3 rounded-xl shadow-sm shadow-red-600/10"
        >
          <Feather name="log-out" size={18} color="white" style={{ marginRight: 8 }} />
          <Text className="text-white font-bold text-[15px]">Keluar (Logout)</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
