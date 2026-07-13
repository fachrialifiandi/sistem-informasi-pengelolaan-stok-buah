import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity,  
  ScrollView, 
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getFruitEmoji } from '../utils/fruit';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TransactionDetailScreen({ route, navigation }) {
  const { colorScheme } = useColorScheme();
  const { transaction } = route.params; // Expecting transaction object from TransaksiScreen

  // Helper to determine status badge colors
  const isSuccess = transaction.status === "Berhasil";

  return (
    <SafeAreaView className="flex-1 bg-[#F7F9FB] dark:bg-[#121212]">
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {/* Top App Bar */}
      <View className="flex-row justify-between items-center px-5 pt-3 pb-2 bg-[#F7F9FB] dark:bg-[#121212] shadow-sm z-10 border-b border-gray-100 dark:border-gray-800">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            activeOpacity={0.6}
            className="w-10 h-10 rounded-full items-center justify-center bg-[#ECEEF0] dark:bg-[#2D3133]"
          >
            <MaterialIcons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#4EDEA3' : '#006C49'} />
          </TouchableOpacity>
          <Text className="text-[20px] font-bold text-[#006C49] dark:text-[#4EDEA3]">Detail Transaksi</Text>
        </View>
        
        <TouchableOpacity 
          onPress={() => Alert.alert("Settings", "Fitur pengaturan belum diaktifkan.")} 
          activeOpacity={0.6}
          className="w-10 h-10 rounded-full items-center justify-center bg-[#ECEEF0] dark:bg-[#2D3133]"
        >
          <MaterialIcons name="settings" size={24} color={colorScheme === 'dark' ? '#4EDEA3' : '#006C49'} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} className="flex-1 px-5 pt-5">
        
        {/* Transaction Summary Header */}
        <View className="mb-6">
          <View className="flex-row items-center gap-2 mb-2">
            <View className={`px-2.5 py-0.5 rounded-full ${isSuccess ? 'bg-[#10B981]/10' : 'bg-[#FD761A]/10'}`}>
              <Text className={`text-[10px] font-bold ${isSuccess ? 'text-[#006C49]' : 'text-[#9D4300]'}`}>
                {isSuccess ? 'Restok Berhasil' : 'Transaksi Diproses'}
              </Text>
            </View>
          </View>
          <Text className="text-xl font-bold text-gray-800 dark:text-white">Detail Transaksi Restok</Text>
          <Text className="text-xs text-gray-400 mt-1">ID: {transaction.id_transaksi}</Text>

        </View>

        {/* Meta Information Bento Grid */}
        <View className="flex-row gap-3 mb-3">
          {/* Card 1: Tanggal & Waktu */}
          <View className="flex-1 bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Tanggal & Waktu</Text>
            <Text className="text-sm font-bold text-gray-800 dark:text-white">
              {transaction.date_group === "Hari Ini" ? "Hari Ini" : transaction.date_group === "Kemarin" ? "Kemarin" : "12 Jul 2026"}
            </Text>
            <Text className="text-xs text-gray-400 mt-0.5">{transaction.time_str}</Text>
          </View>

          {/* Card 2: Nama Pemasok */}
          <View className="flex-1 bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-2">Nama Pemasok</Text>
            <Text className="text-sm font-bold text-gray-800 dark:text-white" numberOfLines={1}>
              {transaction.supplier_name}
            </Text>
            <View className="flex-row items-center gap-0.5 mt-1">
              <MaterialIcons name="verified" size={12} color="#006C49" />
              <Text className="text-[9px] font-bold text-[#006C49]">Terverifikasi</Text>
            </View>
          </View>
        </View>

        {/* Card 3: Total Berat (Berada di baris baru di bawahnya) */}
        <View className="w-full bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm mb-6">
          <Text className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Total Berat</Text>
          <Text className="text-lg font-bold text-[#006C49] dark:text-[#4EDEA3]">{transaction.total_weight} kg</Text>
          <Text className="text-xs text-gray-400 mt-0.5">{transaction.items?.length || 0} Jenis Produk</Text>
        </View>

        {/* Inventory List Card */}
        <View className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <View className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 flex-row justify-between items-center bg-gray-50 dark:bg-[#1F2937]/20">
            <Text className="text-sm font-bold text-gray-850 dark:text-white">Daftar Buah Restok</Text>
            <Text className="text-[9px] font-bold text-gray-400 uppercase">Jumlah</Text>
          </View>

          <View className="divide-y divide-gray-100 dark:divide-gray-800">
            {transaction.items?.map((item, idx) => {
              // Stock badge simulation
              let statusText = "High Stock";
              let badgeColor = "bg-[#10B981]/10 text-[#006C49]";
              
              if (item.jumlah < 15) {
                statusText = "Low Stock";
                badgeColor = "bg-[#FD761A]/10 text-[#9D4300]";
              }
              
              return (
                <View key={idx} className="p-4 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-[#2D3133] items-center justify-center">
                      <Text className="text-[24px]">{getFruitEmoji(item.nama_buah)}</Text>
                    </View>
                    <View className="flex-1 pr-2">
                      <Text className="text-sm font-bold text-gray-800 dark:text-white" numberOfLines={1}>
                        {item.nama_buah}
                      </Text>
                      <Text className="text-[10px] text-gray-400 mt-0.5">SKU: {item.sku}</Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-sm font-bold text-gray-800 dark:text-white">{item.jumlah} kg</Text>
                    <View className={`px-2 py-0.5 rounded-full mt-1.5 ${badgeColor}`}>
                      <Text className="text-[9px] font-bold">{statusText}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}