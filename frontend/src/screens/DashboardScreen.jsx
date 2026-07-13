import React, { useContext, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { inventoryService } from '../services/inventory.service';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';

import { getFruitEmoji } from '../utils/fruit';

export default function DashboardScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const { colorScheme } = useColorScheme();

  const [totalStock, setTotalStock] = useState(0);
  const [skuCount, setSkuCount] = useState(0);
  const [monthlyIn, setMonthlyIn] = useState(0);
  const [monthlyOut, setMonthlyOut] = useState(0);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [topMovers, setTopMovers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      setIsLoading(true);

      Promise.all([
        inventoryService.getInventory(),
        inventoryService.getStats('bulan_ini'),
        inventoryService.getTransactions('bulan_ini')
      ]).then(([fruits, stats, transactions]) => {
        if (!isMounted) return;

        // 1. Calculate total stock & count SKUs
        const total = fruits.reduce((sum, item) => sum + item.current_stock, 0);
        setTotalStock(total);
        setSkuCount(fruits.length);

        // 2. Set monthly stats
        setMonthlyIn(stats.total_stock_in || 0);
        setMonthlyOut(stats.total_stock_out || 0);

        // 3. Set low stock alerts (stock <= 15) sorted by stock ascending
        const lowStock = fruits
          .filter(item => item.current_stock <= 15)
          .sort((a, b) => a.current_stock - b.current_stock)
          .slice(0, 3); // limit to 3 alerts
        setLowStockAlerts(lowStock);

        // 4. Calculate Top Movers from outgoing transactions
        const outgoingTotals = {};
        transactions.forEach(tx => {
          if (tx.type === 'outgoing') {
            tx.items?.forEach(item => {
              const sku = item.sku;
              if (!outgoingTotals[sku]) {
                outgoingTotals[sku] = {
                  sku: sku,
                  name: item.nama_buah,
                  totalVolume: 0
                };
              }
              outgoingTotals[sku].totalVolume += item.jumlah;
            });
          }
        });

        // Convert to array and sort descending
        const movers = Object.values(outgoingTotals)
          .sort((a, b) => b.totalVolume - a.totalVolume)
          .slice(0, 3); // top 3 movers
        setTopMovers(movers);

        setIsLoading(false);
      }).catch(err => {
        console.error("Dashboard data load failed:", err);
        setIsLoading(false);
      });

      return () => {
        isMounted = false;
      };
    }, [])
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F7F9FB] dark:bg-[#121212]">
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
      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#006C49" />
          <Text className="text-xs text-gray-500 mt-2">Memuat dashboard...</Text>
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-5 py-6">
            
            {/* Quick Actions */}
            <View className="mb-6">
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate('InventoryTab', { screen: 'Restock' })}
                className="w-full h-14 bg-white border border-[#D6E4DB] rounded-2xl flex-row items-center justify-center shadow-sm"
              >
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
              
              <Text className="text-[14px] font-medium text-[#3C4A42] dark:text-[#BBCABF] mb-1">Total Volume Stok</Text>
              <View className="flex-row items-baseline gap-2">
                <Text className="text-[40px] font-bold text-[#006C49] dark:text-[#4EDEA3] tracking-tighter">
                  {totalStock.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 1 })}
                </Text>
                <Text className="text-[16px] text-[#6C7A71] dark:text-[#8B9990]">kg</Text>
              </View>
              <View className="flex-row items-center gap-1 mt-2 mb-5">
                <MaterialIcons name="trending-up" size={16} color="#10B981" />
                <Text className="text-[12px] font-semibold text-[#10B981]">Sinkronisasi Real-Time</Text>
              </View>

              <View className="flex-row gap-3">
                <View className="flex-1 bg-[#F2F4F6] dark:bg-[#2D3133] rounded-xl p-4 items-center justify-center">
                  <Text className="text-[20px] font-bold text-[#191C1E] dark:text-white mb-1">{skuCount}</Text>
                  <Text className="text-[12px] font-semibold text-[#6C7A71] dark:text-[#8B9990]">Total SKU</Text>
                </View>
                <View className="flex-1 bg-[#F2F4F6] dark:bg-[#2D3133] rounded-xl p-4 items-center justify-center">
                  <Text className="text-[20px] font-bold text-[#191C1E] dark:text-white mb-1">100%</Text>
                  <Text className="text-[12px] font-semibold text-[#6C7A71] dark:text-[#8B9990]">Terpantau</Text>
                </View>
              </View>
            </View>

            {/* Ringkasan Stok Bulanan */}
            <View className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
              <Text className="text-[20px] font-bold text-[#191C1E] dark:text-white mb-4">Ringkasan Stok Bulan Ini</Text>
              <View className="flex-row gap-3">
                <View className="flex-1 bg-[#F2F4F6] dark:bg-[#2D3133] rounded-xl p-4 border-l-4 border-l-[#10B981]">
                  <Text className="text-[10px] font-bold text-[#6C7A71] dark:text-[#8B9990] mb-1 uppercase tracking-widest">Total Stok Masuk</Text>
                  <View className="flex-row items-baseline gap-1">
                    <Text className="text-[18px] font-bold text-[#006C49] dark:text-[#4EDEA3]">
                      +{monthlyIn.toLocaleString('id-ID', { maximumFractionDigits: 1 })}
                    </Text>
                    <Text className="text-[12px] font-medium text-[#6C7A71] dark:text-[#8B9990]">kg</Text>
                  </View>
                </View>
                <View className="flex-1 bg-[#F2F4F6] dark:bg-[#2D3133] rounded-xl p-4 border-l-4 border-l-[#9D4300] dark:border-l-[#FFB690]">
                  <Text className="text-[10px] font-bold text-[#6C7A71] dark:text-[#8B9990] mb-1 uppercase tracking-widest">Total Stok Keluar</Text>
                  <View className="flex-row items-baseline gap-1">
                    <Text className="text-[18px] font-bold text-[#9D4300] dark:text-[#FFB690]">
                      -{monthlyOut.toLocaleString('id-ID', { maximumFractionDigits: 1 })}
                    </Text>
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
                  <Text className="text-[20px] font-bold text-[#191C1E] dark:text-white">Peringatan Stok Menipis</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('InventoryTab')}
                  activeOpacity={0.6}
                >
                  <Text className="text-[14px] font-bold text-[#006C49] dark:text-[#4EDEA3]">Lihat Semua</Text>
                </TouchableOpacity>
              </View>

              {lowStockAlerts.length === 0 ? (
                <View className="bg-white dark:bg-[#1E1E1E] rounded-xl p-5 border border-gray-150 dark:border-gray-800 items-center shadow-sm">
                  <Feather name="check-circle" size={24} color="#10B981" />
                  <Text className="text-xs text-gray-500 mt-1 font-semibold">Semua stok buah aman!</Text>
                </View>
              ) : (
                lowStockAlerts.map((item) => {
                  const isCritical = item.current_stock <= 5;
                  const emoji = getFruitEmoji(item.nama_buah);
                  return (
                    <View 
                      key={item.id_buah}
                      className={`bg-white dark:bg-[#1E1E1E] rounded-xl p-4 shadow-sm border ${isCritical ? 'border-[#FFDAD6] dark:border-[#93000A]' : 'border-[#FFDBCA] dark:border-[#783200]'} flex-row items-center gap-4 mb-3`}
                    >
                      <View className="w-12 h-12 rounded-lg bg-[#ECEEF0] dark:bg-[#2D3133] items-center justify-center">
                         <Text className="text-[24px]">{emoji}</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-[14px] font-bold text-[#191C1E] dark:text-white">{item.nama_buah}</Text>
                        <View className="flex-row items-center justify-between mt-2">
                          <Text className="text-[18px] font-bold text-[#9D4300] dark:text-[#FFB690]">
                            {item.current_stock.toFixed(1)} <Text className="text-[11px] font-normal text-[#6C7A71] dark:text-[#8B9990]">kg left</Text>
                          </Text>
                          <View className={`px-2.5 py-0.5 rounded-full border ${isCritical ? 'bg-[#FFDAD6]/80 border-[#93000A]/10' : 'bg-[#FFDBCA]/80 border-[#783200]/20'}`}>
                            <Text className={`${isCritical ? 'text-[#93000A] dark:text-[#FFDAD6]' : 'text-[#783200] dark:text-[#FFDBCA]'} text-[9px] font-bold uppercase tracking-widest`}>
                              {isCritical ? 'Kritis' : 'Menipis'}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })
              )}
            </View>

            {/* Top Movers */}
            <View className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 mb-6">
              <Text className="text-[20px] font-bold text-[#191C1E] dark:text-white mb-5">Top Movers (Bulan Ini)</Text>
              
              {topMovers.length === 0 ? (
                <View className="items-center py-4">
                  <Feather name="activity" size={20} color="#6C7A71" />
                  <Text className="text-xs text-gray-400 mt-1">Belum ada pengeluaran stok bulan ini.</Text>
                </View>
              ) : (
                topMovers.map((item, index) => {
                  const emoji = getFruitEmoji(item.name);
                  return (
                    <View key={item.sku} className={`flex-row items-center gap-4 ${index !== topMovers.length - 1 ? 'mb-5' : ''}`}>
                       <View className="w-12 h-12 rounded-lg bg-[#ECEEF0] dark:bg-[#2D3133] items-center justify-center">
                         <Text className="text-[24px]">{emoji}</Text>
                       </View>
                       <View className="flex-1">
                         <Text className="text-[14px] font-bold text-[#191C1E] dark:text-white" numberOfLines={1}>
                           {item.name}
                         </Text>
                         <Text className="text-[12px] font-semibold text-[#6C7A71] dark:text-[#8B9990]">SKU: {item.sku}</Text>
                       </View>
                       <Text className="text-[14px] font-bold text-[#9D4300] dark:text-[#FFB690]">-{item.totalVolume.toFixed(1)} kg</Text>
                    </View>
                  );
                })
              )}
            </View>

          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}