import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';

export default function ReportDetailScreen({ navigation }) {
  const { colorScheme } = useColorScheme();

  const indonesianMonths = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  const now = new Date();
  const currentMonthYear = `${indonesianMonths[now.getMonth()]} ${now.getFullYear()}`;
  
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthYear = `${indonesianMonths[prevDate.getMonth()]} ${prevDate.getFullYear()}`;

  const [selectedMonth, setSelectedMonth] = useState(currentMonthYear);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Data dummy untuk tabel ringkasan
  const summaryData = [
    { id: 1, name: 'Apel Fuji Premium', in: '+240', out: '-180', stock: '86' },
    { id: 2, name: 'Mangga Harum Manis', in: '+450', out: '-425', stock: '45' },
    { id: 3, name: 'Jeruk Santang', in: '+100', out: '-95', stock: '12' },
  ];

  // Data dummy untuk log transaksi
  const transactionLogs = [
    {
      id: '#TRX-0824-001',
      title: 'Apel Fuji Premium',
      type: 'Stok Masuk',
      date: '12 Aug, 09:30',
      qty: '+50.0 kg',
      icon: 'local-shipping',
      descTitle: 'Supplier',
      descValue: 'CV. Buah Segar Nusantara',
      colorRef: 'primary' // Hijau
    },
    {
      id: '#TRX-0824-002',
      title: 'Mangga Harum Manis',
      type: 'Stok Keluar',
      date: '12 Aug, 10:15',
      qty: '-12.5 kg',
      icon: 'shopping-cart',
      descTitle: 'Keterangan',
      descValue: 'Penjualan Grosir - Toko Jaya',
      colorRef: 'secondary' // Oranye
    },
    {
      id: '#TRX-0824-003',
      title: 'Jeruk Santang',
      type: 'Stok Keluar',
      date: '12 Aug, 14:00',
      qty: '-2.0 kg',
      icon: 'delete-outline',
      descTitle: 'Keterangan',
      descValue: 'Produk Rusak / Busuk',
      colorRef: 'error' // Merah
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#F7F9FB] dark:bg-[#121212]">
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {/* Top Header Navigation */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white dark:bg-[#1E1E1E] border-b border-gray-100 dark:border-gray-800 shadow-sm z-50">
        <View className="flex-row items-center gap-3">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="p-1 -ml-2 rounded-full active:scale-90"
          >
            <MaterialIcons name="arrow-back" size={24} color={colorScheme === 'dark' ? '#4EDEA3' : '#006C49'} />
          </TouchableOpacity>
          <Text className="text-[20px] font-bold text-[#006C49] dark:text-[#4EDEA3]">Laporan Detail Stok</Text>
        </View>
        <TouchableOpacity 
          onPress={() => alert("Search clicked")}
          className="p-1 -mr-2 rounded-full active:scale-90"
        >
          <MaterialIcons name="search" size={24} color="#6C7A71" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }}
        className="flex-1 px-6 pt-5"
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Section */}
        <View className="relative z-50 mb-6">
          <View className="flex-row items-center justify-between gap-4">
            <TouchableOpacity 
              activeOpacity={0.7}
              onPress={() => setShowDropdown(!showDropdown)}
              className="flex-1 bg-[#F2F4F6] dark:bg-[#2D3133] rounded-xl px-4 py-3.5 flex-row items-center gap-3"
            >
              <MaterialIcons name="calendar-today" size={20} color="#006C49" />
              <Text className="flex-1 font-semibold text-[14px] text-[#191C1E] dark:text-white">{selectedMonth}</Text>
              <MaterialIcons name={showDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#6C7A71" />
            </TouchableOpacity>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => Alert.alert("Filter", "Menu filter lanjutan belum diaktifkan.")}
              className="bg-[#10B981] p-3.5 rounded-xl items-center justify-center shadow-sm shadow-[#10B981]/30"
            >
              <MaterialIcons name="tune" size={20} color="#00422B" />
            </TouchableOpacity>
          </View>

          {/* Month Dropdown Menu */}
          {showDropdown && (
            <View className="absolute top-[54px] left-0 right-0 bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-100 dark:border-gray-800 shadow-lg z-50 overflow-hidden">
              <TouchableOpacity 
                onPress={() => {
                  setSelectedMonth(currentMonthYear);
                  setShowDropdown(false);
                }}
                className={`px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex-row justify-between items-center ${selectedMonth === currentMonthYear ? 'bg-[#10B981]/10' : ''}`}
              >
                <Text className={`text-sm font-semibold ${selectedMonth === currentMonthYear ? 'text-[#006C49] dark:text-[#4EDEA3]' : 'text-gray-700 dark:text-gray-300'}`}>
                  {currentMonthYear} (Bulan Ini)
                </Text>
                {selectedMonth === currentMonthYear && <MaterialIcons name="check" size={18} color="#006C49" />}
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => {
                  setSelectedMonth(prevMonthYear);
                  setShowDropdown(false);
                }}
                className={`px-5 py-4 flex-row justify-between items-center ${selectedMonth === prevMonthYear ? 'bg-[#10B981]/10' : ''}`}
              >
                <Text className={`text-sm font-semibold ${selectedMonth === prevMonthYear ? 'text-[#006C49] dark:text-[#4EDEA3]' : 'text-gray-700 dark:text-gray-300'}`}>
                  {prevMonthYear} (Bulan Lalu)
                </Text>
                {selectedMonth === prevMonthYear && <MaterialIcons name="check" size={18} color="#006C49" />}
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Tabel Ringkasan Bulanan */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[18px] font-bold text-[#191C1E] dark:text-white">Ringkasan Bulanan</Text>
            <Text className="text-[#006C49] dark:text-[#4EDEA3] font-semibold text-[12px]">Total 12 Buah</Text>
          </View>
          
          <View className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-[0px_4px_20px_rgba(0,108,73,0.05)] border border-gray-100 dark:border-gray-800 overflow-hidden">
            {/* Table Header */}
            <View className="flex-row items-center bg-[#F2F4F6] dark:bg-[#2D3133] px-4 py-3">
              <Text className="flex-[2] text-[12px] font-semibold text-[#6C7A71]">Nama Buah</Text>
              <Text className="flex-1 text-right text-[12px] font-semibold text-[#6C7A71]">Masuk</Text>
              <Text className="flex-1 text-right text-[12px] font-semibold text-[#6C7A71]">Keluar</Text>
              <Text className="flex-1 text-right text-[12px] font-semibold text-[#6C7A71]">Stok</Text>
            </View>
            
            {/* Table Rows */}
            {summaryData.map((item, index) => (
              <View 
                key={item.id} 
                className={`flex-row items-center px-4 py-3.5 ${index !== summaryData.length - 1 ? 'border-b border-gray-100 dark:border-gray-800' : ''}`}
              >
                <Text className="flex-[2] text-[13px] font-medium text-[#191C1E] dark:text-white pr-2" numberOfLines={2}>
                  {item.name}
                </Text>
                <Text className="flex-1 text-right text-[13px] font-medium text-[#006C49] dark:text-[#4EDEA3]">{item.in}</Text>
                <Text className="flex-1 text-right text-[13px] font-medium text-[#9D4300]">{item.out}</Text>
                <Text className="flex-1 text-right text-[13px] font-bold text-[#191C1E] dark:text-white">{item.stock}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Ringkasan Stok Bulanan (Cards) */}
        <View className="mb-8">
          <Text className="text-[18px] font-bold text-[#191C1E] dark:text-white mb-4">Metrik Total</Text>
          <View className="flex-row gap-3">
            <View className="flex-1 bg-[#F2F4F6] dark:bg-[#2D3133] rounded-xl p-4 border-l-4 border-l-[#006C49]">
              <Text className="text-[10px] font-bold text-[#6C7A71] mb-1 uppercase tracking-widest">Total Stok Masuk</Text>
              <View className="flex-row items-baseline gap-1">
                <Text className="text-[24px] font-bold text-[#006C49] dark:text-[#4EDEA3]">+2,766</Text>
                <Text className="text-[12px] font-medium text-[#6C7A71]">kg</Text>
              </View>
            </View>
            <View className="flex-1 bg-[#F2F4F6] dark:bg-[#2D3133] rounded-xl p-4 border-l-4 border-l-[#9D4300]">
              <Text className="text-[10px] font-bold text-[#6C7A71] mb-1 uppercase tracking-widest">Total Stok Keluar</Text>
              <View className="flex-row items-baseline gap-1">
                <Text className="text-[24px] font-bold text-[#9D4300]">-2,345</Text>
                <Text className="text-[12px] font-medium text-[#6C7A71]">kg</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Log Transaksi List */}
        <View className="mb-6">
          <Text className="text-[18px] font-bold text-[#191C1E] dark:text-white mb-4">Log Transaksi Terakhir</Text>
          
          {transactionLogs.map((log) => {
            const isPrimary = log.colorRef === 'primary';
            const isError = log.colorRef === 'error';
            
            const borderColor = isPrimary ? 'border-l-[#006C49]' : isError ? 'border-l-[#BA1A1A]' : 'border-l-[#9D4300]';
            const badgeBg = isPrimary ? 'bg-[#10B981]/15' : isError ? 'bg-[#FFDAD6]' : 'bg-[#FFDBCA]';
            const badgeText = isPrimary ? 'text-[#006C49]' : isError ? 'text-[#BA1A1A]' : 'text-[#9D4300]';
            const qtyText = isPrimary ? 'text-[#006C49]' : isError ? 'text-[#BA1A1A]' : 'text-[#9D4300]';

            return (
              <View 
                key={log.id} 
                className={`bg-white dark:bg-[#1E1E1E] p-5 rounded-xl shadow-[0px_4px_20px_rgba(0,108,73,0.04)] border border-gray-50 dark:border-gray-800 border-l-4 ${borderColor} mb-4`}
              >
                {/* Card Header */}
                <View className="flex-row justify-between items-start mb-4">
                  <View>
                    <Text className="text-[11px] font-semibold text-[#6C7A71]">{log.id}</Text>
                    <Text className="text-[15px] font-bold text-[#191C1E] dark:text-white mt-0.5">{log.title}</Text>
                  </View>
                  <View className={`px-2.5 py-1 rounded-full ${badgeBg}`}>
                    <Text className={`text-[10px] font-bold ${badgeText}`}>{log.type}</Text>
                  </View>
                </View>

                {/* Card Body Grid */}
                <View className="flex-row flex-wrap">
                  <View className="w-1/2 mb-3">
                    <Text className="text-[10px] font-bold text-[#6C7A71] uppercase tracking-wider mb-0.5">Waktu</Text>
                    <Text className="text-[13px] font-medium text-[#191C1E] dark:text-white">{log.date}</Text>
                  </View>
                  <View className="w-1/2 mb-3">
                    <Text className="text-[10px] font-bold text-[#6C7A71] uppercase tracking-wider mb-0.5">Jumlah</Text>
                    <Text className={`text-[15px] font-bold ${qtyText}`}>{log.qty}</Text>
                  </View>
                  <View className="w-full">
                    <Text className="text-[10px] font-bold text-[#6C7A71] uppercase tracking-wider mb-1">{log.descTitle}</Text>
                    <View className="flex-row items-center gap-1.5">
                      <MaterialIcons name={log.icon} size={16} color="#6C7A71" />
                      <Text className="text-[13px] font-medium text-[#191C1E] dark:text-white">{log.descValue}</Text>
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View 
        style={{ paddingBottom: Platform.OS === 'ios' ? 24 : 16 }}
        className="absolute bottom-0 w-full bg-white/95 dark:bg-[#1E1E1E] px-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex-row gap-4 shadow-[0px_-4px_20px_rgba(0,0,0,0.05)]"
      >
        <TouchableOpacity 
          activeOpacity={0.8}
          className="flex-1 bg-[#006C49] h-14 rounded-full flex-row items-center justify-center gap-2 shadow-lg shadow-[#006C49]/20"
        >
          <MaterialIcons name="file-download" size={20} color="white" />
          <Text className="font-bold text-[14px] text-white">Export to Excel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          activeOpacity={0.8}
          className="w-14 h-14 rounded-full bg-[#10B981] flex items-center justify-center shadow-md shadow-[#10B981]/20"
        >
          <MaterialIcons name="share" size={22} color="#00422B" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
