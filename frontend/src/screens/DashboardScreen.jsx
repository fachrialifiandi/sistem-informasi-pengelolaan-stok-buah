import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';

export default function DashboardScreen( { navigation }) {
  const { user, logout } = useContext(AuthContext);
  
  // Mengambil state dan fungsi toggle tema dari NativeWind
  const { colorScheme, toggleColorScheme } = useColorScheme();


  return (
    <SafeAreaView className="flex-1 bg-[#F7F9FB] dark:bg-[#121212]">
      {/* StatusBar akan berubah menyesuaikan tema */}
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {/* Top App Bar */}
      <View className="flex-row justify-between items-center px-5 pt-3 pb-2 bg-[#F7F9FB] dark:bg-[#121212] shadow-sm z-10 border-b border-gray-100 dark:border-gray-800">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-full bg-[#006C49] dark:bg-[#004F32] items-center justify-center shadow-sm shadow-[#006C49]/10">
             <MaterialIcons name="eco" size={22} color="white" />
          </View>
          <Text className="text-[20px] font-bold text-[#006C49] dark:text-[#4EDEA3]">Stock Fruit</Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => navigation.navigate('Setting')} 
          activeOpacity={0.6}
          className="w-10 h-10 rounded-full items-center justify-center bg-[#ECEEF0] dark:bg-[#2D3133]"
        >
          <MaterialIcons name="settings" size={24} color={colorScheme === 'dark' ? '#4EDEA3' : '#006C49'} />
        </TouchableOpacity>
      </View>

      {/* Main Content Scrollable */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 py-6">
          
          {/* Search and Quick Actions */}
          <View className="flex-row gap-3 items-center mb-6">
            <View className="flex-1 relative justify-center">
              <MaterialIcons name="search" size={22} color={colorScheme === 'dark' ? '#8B9990' : '#6C7A71'} style={{position: 'absolute', left: 16, zIndex: 1}} />
              <TextInput 
                placeholder="Search inventory..." 
                placeholderTextColor={colorScheme === 'dark' ? '#8B9990' : '#BBCABF'}
                className="w-full h-14 pl-12 pr-12 rounded-xl bg-[#F2F4F6] dark:bg-[#2D3133] text-[16px] text-[#191C1E] dark:text-white"
              />
              <MaterialIcons name="tune" size={22} color={colorScheme === 'dark' ? '#8B9990' : '#6C7A71'} style={{position: 'absolute', right: 16, zIndex: 1}} />
            </View>
          <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => navigation.navigate('InventoryTab', { screen: 'Restock' })}
          className="flex-1 h-14 bg-white border border-[#D6E4DB] rounded-2xl flex-row items-center justify-center shadow-sm">
          <View className="w-8 h-8 rounded-full bg-[#EAF7F1] items-center justify-center">
            <Feather name="refresh-cw" size={16} color="#006C49" />
          </View>

          <Text className="ml-3 text-[15px] font-semibold text-[#006C49]">
            Restock
          </Text>
         </TouchableOpacity>
          </View>

          {/* Overview Metric */}
          <View className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6 overflow-hidden relative">
            <View className="absolute -right-8 -top-8 w-32 h-32 bg-[#78B300]/10 dark:bg-[#78B300]/20 rounded-full"></View>
            
            <Text className="text-[14px] font-medium text-[#3C4A42] dark:text-[#BBCABF] mb-1">Total Stock Volume</Text>
            <View className="flex-row items-baseline gap-2">
              <Text className="text-[48px] font-bold text-[#006C49] dark:text-[#4EDEA3] tracking-tighter">2,450</Text>
              <Text className="text-[16px] text-[#6C7A71] dark:text-[#8B9990]">kg</Text>
            </View>
            <View className="flex-row items-center gap-1 mt-2 mb-5">
              <MaterialIcons name="trending-up" size={16} color="#10B981" />
              <Text className="text-[12px] font-semibold text-[#10B981]">+12% from last week</Text>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1 bg-[#F2F4F6] dark:bg-[#2D3133] rounded-xl p-4 items-center justify-center">
                <Text className="text-[20px] font-bold text-[#191C1E] dark:text-white mb-1">142</Text>
                <Text className="text-[12px] font-semibold text-[#6C7A71] dark:text-[#8B9990]">SKUs</Text>
              </View>
              <View className="flex-1 bg-[#F2F4F6] dark:bg-[#2D3133] rounded-xl p-4 items-center justify-center">
                <Text className="text-[20px] font-bold text-[#191C1E] dark:text-white mb-1">98%</Text>
                <Text className="text-[12px] font-semibold text-[#6C7A71] dark:text-[#8B9990]">Freshness</Text>
              </View>
            </View>
          </View>

          {/* Ringkasan Stok Bulanan */}
          <View className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
            <Text className="text-[20px] font-bold text-[#191C1E] dark:text-white mb-4">Ringkasan Stok Bulanan</Text>
            <View className="flex-row gap-3">
              <View className="flex-1 bg-[#F2F4F6] dark:bg-[#2D3133] rounded-xl p-4 border-l-4 border-l-[#10B981]">
                <Text className="text-[10px] font-bold text-[#6C7A71] dark:text-[#8B9990] mb-1 uppercase tracking-widest">Total Stok Masuk</Text>
                <View className="flex-row items-baseline gap-1">
                  <Text className="text-[20px] font-bold text-[#006C49] dark:text-[#4EDEA3]">+1,240</Text>
                  <Text className="text-[12px] font-medium text-[#6C7A71] dark:text-[#8B9990]">kg</Text>
                </View>
              </View>
              <View className="flex-1 bg-[#F2F4F6] dark:bg-[#2D3133] rounded-xl p-4 border-l-4 border-l-[#9D4300] dark:border-l-[#FFB690]">
                <Text className="text-[10px] font-bold text-[#6C7A71] dark:text-[#8B9990] mb-1 uppercase tracking-widest">Total Stok Keluar</Text>
                <View className="flex-row items-baseline gap-1">
                  <Text className="text-[20px] font-bold text-[#9D4300] dark:text-[#FFB690]">-850</Text>
                  <Text className="text-[12px] font-medium text-[#6C7A71] dark:text-[#8B9990]">kg</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Low Stock Alerts */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="warning" size={22} color={colorScheme === 'dark' ? '#FFB690' : '#9D4300'} />
                <Text className="text-[20px] font-bold text-[#191C1E] dark:text-white">Low Stock Alerts</Text>
              </View>
              <TouchableOpacity activeOpacity={0.6}>
                <Text className="text-[14px] font-bold text-[#006C49] dark:text-[#4EDEA3]">View All</Text>
              </TouchableOpacity>
            </View>

            {/* Alert Card 1 */}
            <View className="bg-white dark:bg-[#1E1E1E] rounded-xl p-4 shadow-sm border border-[#FFDAD6] dark:border-[#93000A] flex-row items-center gap-4 mb-3">
              <View className="w-16 h-16 rounded-lg bg-[#ECEEF0] dark:bg-[#2D3133] items-center justify-center">
                 <Text className="text-[28px]">🥭</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-medium text-[#191C1E] dark:text-white">Premium Mangoes</Text>
                <View className="flex-row items-center justify-between mt-2">
                  <Text className="text-[20px] font-bold text-[#9D4300] dark:text-[#FFB690]">5 <Text className="text-[12px] font-normal text-[#6C7A71] dark:text-[#8B9990]">kg left</Text></Text>
                  <View className="bg-[#FFDAD6] dark:bg-[#93000A]/30 px-2 py-1 rounded-full border border-[#93000A]/10">
                    <Text className="text-[#93000A] dark:text-[#FFDAD6] text-[10px] font-bold uppercase tracking-widest">Critical</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Alert Card 2 */}
            <View className="bg-white dark:bg-[#1E1E1E] rounded-xl p-4 shadow-sm border border-[#FFDBCA] dark:border-[#783200] flex-row items-center gap-4">
              <View className="w-16 h-16 rounded-lg bg-[#ECEEF0] dark:bg-[#2D3133] items-center justify-center">
                 <Text className="text-[28px]">🥑</Text>
              </View>
              <View className="flex-1">
                <Text className="text-[14px] font-medium text-[#191C1E] dark:text-white">Hass Avocados</Text>
                <View className="flex-row items-center justify-between mt-2">
                  <Text className="text-[20px] font-bold text-[#9D4300] dark:text-[#FFB690]">12 <Text className="text-[12px] font-normal text-[#6C7A71] dark:text-[#8B9990]">kg left</Text></Text>
                  <View className="bg-[#FFDBCA] dark:bg-[#783200]/30 px-2 py-1 rounded-full border border-[#783200]/20">
                    <Text className="text-[#341100] dark:text-[#FFDBCA] text-[10px] font-bold uppercase tracking-widest">Low</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Top Movers */}
          <View className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
            <Text className="text-[20px] font-bold text-[#191C1E] dark:text-white mb-5">Top Movers</Text>
            
            <View className="flex-row items-center gap-4 mb-5">
               <View className="w-12 h-12 rounded-lg bg-[#ECEEF0] dark:bg-[#2D3133] items-center justify-center">
                 <Text className="text-[24px]">🫐</Text>
               </View>
               <View className="flex-1">
                 <Text className="text-[14px] font-medium text-[#191C1E] dark:text-white">Organic Blueberries</Text>
                 <Text className="text-[12px] font-semibold text-[#6C7A71] dark:text-[#8B9990]">SKU-BLU-01</Text>
               </View>
               <Text className="text-[14px] font-bold text-[#006C49] dark:text-[#4EDEA3]">-45kg</Text>
            </View>

            <View className="flex-row items-center gap-4">
               <View className="w-12 h-12 rounded-lg bg-[#ECEEF0] dark:bg-[#2D3133] items-center justify-center">
                 <Text className="text-[24px]">🍎</Text>
               </View>
               <View className="flex-1">
                 <Text className="text-[14px] font-medium text-[#191C1E] dark:text-white">Fuji Apples</Text>
                 <Text className="text-[12px] font-semibold text-[#6C7A71] dark:text-[#8B9990]">SKU-APP-F2</Text>
               </View>
               <Text className="text-[14px] font-bold text-[#006C49] dark:text-[#4EDEA3]">-32kg</Text>
            </View>
          </View>

        </View>
      </ScrollView>

    </SafeAreaView>
  );
}