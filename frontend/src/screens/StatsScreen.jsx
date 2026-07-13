import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { inventoryService } from '../services/inventory.service';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

export default function StatsScreen({ navigation }) {
  const { colorScheme } = useColorScheme();
  const [statsData, setStatsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [period, setPeriod] = useState('7 Hari Terakhir');
  const [showDropdown, setShowDropdown] = useState(false);

  const getPeriodParam = (periodStr) => {
    if (periodStr === '7 Hari Terakhir') return "7_hari";
    if (periodStr === '30 Hari Terakhir') return "30_hari";
    return null;
  };

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      setIsLoading(true);

      const periodParam = getPeriodParam(period);
      
      inventoryService.getStats(periodParam).then((data) => {
        if (isMounted) {
          setStatsData(data);
          setIsLoading(false);
        }
      }).catch(err => {
        console.error(err);
        if (isMounted) setIsLoading(false);
      });

      return () => {
        isMounted = false;
      };
    }, [period])
  );

  const handleDownloadPDF = () => {
    Alert.alert("Unduh Laporan", "Proses pembuatan PDF dimulai. Laporan akan diunduh ke folder dokumen Anda.");
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F7F9FB] dark:bg-[#121212]">
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      
      {/* Top App Bar */}
      <View className="flex-row justify-between items-center px-5 pt-3 pb-2 bg-[#F7F9FB] dark:bg-[#121212] shadow-sm z-10 border-b border-gray-100 dark:border-gray-800">
        <View className="flex-row items-center gap-3">
          {/* Logo brand icon from Login page leaf style */}
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

      {isLoading ? (
        <View className="flex-1 justify-center items-center bg-[#F7F9FB] dark:bg-[#121212]">
          <ActivityIndicator size="large" color="#006C49" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 60 }} className="flex-1 px-5 pt-5">
          
          {/* Header Section */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-800 dark:text-white">Laporan Stok</Text>
            <Text className="text-sm text-gray-500 dark:text-[#8B9990] mt-1">
              Analisis pergerakan buah di gudang Anda.
            </Text>
          </View>

          {/* Period Selector Buttons */}
          <View className="relative z-50 flex-row justify-between items-center mb-6 gap-2">
            <View>
              <TouchableOpacity 
                onPress={() => setShowDropdown(!showDropdown)}
                activeOpacity={0.7}
                className="flex-row items-center bg-white dark:bg-[#1E1E1E] px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-800 shadow-sm gap-2"
              >
                <MaterialIcons name="calendar-month" size={16} color="#006C49" />
                <Text className="text-xs font-bold text-gray-700 dark:text-gray-300 capitalize">{period}</Text>
                <MaterialIcons name={showDropdown ? "expand-less" : "expand-more"} size={16} color="#6C7A71" />
              </TouchableOpacity>

              {/* Period Dropdown Menu */}
              {showDropdown && (
                <View className="absolute top-[42px] left-0 w-56 bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-150 dark:border-gray-800 shadow-lg z-50 overflow-hidden">
                  <TouchableOpacity 
                    onPress={() => { setPeriod("7 Hari Terakhir"); setShowDropdown(false); }}
                    className={`px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex-row justify-between items-center ${period === "7 Hari Terakhir" ? 'bg-[#10B981]/10' : ''}`}
                  >
                    <Text className={`text-xs font-semibold ${period === "7 Hari Terakhir" ? 'text-[#006C49] dark:text-[#4EDEA3]' : 'text-gray-700 dark:text-gray-300'}`}>7 Hari Terakhir</Text>
                    {period === "7 Hari Terakhir" && <MaterialIcons name="check" size={14} color="#006C49" />}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => { setPeriod("30 Hari Terakhir"); setShowDropdown(false); }}
                    className={`px-4 py-3 flex-row justify-between items-center ${period === "30 Hari Terakhir" ? 'bg-[#10B981]/10' : ''}`}
                  >
                    <Text className={`text-xs font-semibold ${period === "30 Hari Terakhir" ? 'text-[#006C49] dark:text-[#4EDEA3]' : 'text-gray-700 dark:text-gray-300'}`}>30 Hari Terakhir</Text>
                    {period === "30 Hari Terakhir" && <MaterialIcons name="check" size={14} color="#006C49" />}
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <TouchableOpacity 
              onPress={() => navigation.navigate('ReportDetail')}
              activeOpacity={0.7}
              className="flex-row items-center bg-gray-100 dark:bg-[#2D3133] px-4 py-2.5 rounded-full gap-1.5"
            >
              <Text className="text-xs font-bold text-[#006C49] dark:text-[#4EDEA3]">Laporan Lainnya</Text>
              <MaterialIcons name="chevron-right" size={14} color="#006C49" />
            </TouchableOpacity>
          </View>

          {/* Metric Stats Cards */}
          <View className="flex-row gap-4 mb-6">
            {/* Total Stock In Card */}
            <View className="flex-1 bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
              <View className="flex-row items-center gap-2 mb-3">
                <View className="w-8 h-8 rounded-full bg-[#10B981]/15 items-center justify-center">
                  <MaterialIcons name="arrow-downward" size={16} color="#006C49" />
                </View>
                <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Total Masuk</Text>
              </View>
              <View className="flex-row items-baseline gap-1">
                <Text className="text-[26px] font-bold text-[#006C49] dark:text-[#4EDEA3]">+{statsData?.total_stock_in}</Text>
                <Text className="text-[12px] text-gray-500 font-medium">kg</Text>
              </View>
              <View className="flex-row items-center gap-0.5 mt-2">
                <MaterialIcons name="trending-up" size={12} color="#006C49" />
                <Text className="text-[9px] font-semibold text-[#006C49]">12% dari periode lalu</Text>
              </View>
            </View>

            {/* Total Stock Out Card */}
            <View className="flex-1 bg-white dark:bg-[#1E1E1E] p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden">
              <View className="flex-row items-center gap-2 mb-3">
                <View className="w-8 h-8 rounded-full bg-[#FD761A]/15 items-center justify-center">
                  <MaterialIcons name="arrow-upward" size={16} color="#9D4300" />
                </View>
                <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Total Keluar</Text>
              </View>
              <View className="flex-row items-baseline gap-1">
                <Text className="text-[26px] font-bold text-secondary-container">-{statsData?.total_stock_out}</Text>
                <Text className="text-[12px] text-gray-500 font-medium">kg</Text>
              </View>
              <View className="flex-row items-center gap-0.5 mt-2">
                <MaterialIcons name="trending-down" size={12} color="#9D4300" />
                <Text className="text-[9px] font-semibold text-secondary-container">5% dari periode lalu</Text>
              </View>
            </View>
          </View>

          {/* Movements Details List */}
          <View className="bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden mb-6">
            <View className="px-4 py-3.5 border-b border-gray-100 dark:border-gray-800 flex-row justify-between items-center bg-gray-50 dark:bg-[#1F2937]/20">
              <Text className="text-[14px] font-bold text-gray-800 dark:text-white">Rincian Pergerakan Harian</Text>
              <TouchableOpacity className="flex-row items-center gap-1">
                <MaterialIcons name="filter-list" size={14} color="#006C49" />
                <Text className="text-xs font-bold text-[#006C49] dark:text-[#4EDEA3]">Urutkan</Text>
              </TouchableOpacity>
            </View>

            <View className="divide-y divide-gray-100 dark:divide-gray-800">
              {statsData?.movements.length === 0 ? (
                <View className="p-8 items-center justify-center">
                  <Text className="text-gray-400 text-xs">Tidak ada aktivitas pergerakan di periode ini.</Text>
                </View>
              ) : (
                statsData?.movements.map((move, idx) => (
                  <View key={idx} className="p-4 flex-row items-center gap-4">
                    {/* Left Calendar Mock Column */}
                    <View className="items-center justify-center min-w-[50px]">
                      <Text className="text-[9px] font-bold text-gray-400">{move.day_abbr}</Text>
                      <Text className="text-lg font-bold text-gray-700 dark:text-white">{move.day_num}</Text>
                      <Text className="text-[9px] font-bold text-gray-400">{move.month}</Text>
                    </View>

                    {/* Vertical Divider */}
                    <View className="w-[1px] h-9 bg-gray-200 dark:bg-gray-800" />

                    {/* Middle Description */}
                    <View className="flex-grow flex-shrink pr-2">
                      <Text className="text-[13px] font-bold text-gray-800 dark:text-white" numberOfLines={1}>
                        {move.title}
                      </Text>
                      <Text className="text-[11px] text-gray-400 mt-0.5">{move.desc}</Text>
                    </View>

                    {/* Right Masuk / Keluar values */}
                    <View className="flex-row gap-3">
                      <View className="items-end">
                        <Text className="text-xs font-bold text-[#006C49] dark:text-[#4EDEA3]">+{move.stock_in} kg</Text>
                        <Text className="text-[9px] text-gray-400">Masuk</Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-xs font-bold text-secondary-container">-{move.stock_out} kg</Text>
                        <Text className="text-[9px] text-gray-400">Keluar</Text>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>

            <TouchableOpacity 
              onPress={() => Alert.alert("Selengkapnya", "Membuka rincian harian log lengkap.")}
              className="py-3 bg-gray-50 dark:bg-[#1E1E1E] border-t border-gray-100 dark:border-gray-800 items-center justify-center"
            >
              <Text className="text-xs font-bold text-[#006C49] dark:text-[#4EDEA3]">Lihat Selengkapnya</Text>
            </TouchableOpacity>
          </View>

          {/* Action Download Section */}
          <View className="items-center py-4">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleDownloadPDF}
              className="w-full bg-[#006C49] dark:bg-[#006C49] py-3.5 rounded-full shadow-lg shadow-[#006C49]/20 flex-row items-center justify-center gap-2 mb-3"
            >
              <MaterialIcons name="download" size={20} color="white" />
              <Text className="text-white font-bold text-[15px]">Unduh Laporan (PDF)</Text>
            </TouchableOpacity>
            <Text className="text-[10px] text-gray-400 text-center px-6">
              Laporan akan mencakup semua rincian transaksi harian dan grafik ringkasan.
            </Text>
          </View>

        </ScrollView>
      )}
    </SafeAreaView>
  );
}
