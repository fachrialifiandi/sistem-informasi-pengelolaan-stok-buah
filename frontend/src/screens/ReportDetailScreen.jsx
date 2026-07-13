import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useFocusEffect } from '@react-navigation/native';
import { inventoryService } from '../services/inventory.service';

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
  
  const [summaryData, setSummaryData] = useState([]);
  const [transactionLogs, setTransactionLogs] = useState([]);
  const [statsMetrics, setStatsMetrics] = useState({ total_stock_in: 0, total_stock_out: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Helper to map selected period to service argument
  const getPeriodParam = (monthStr) => {
    if (monthStr === currentMonthYear) return "bulan_ini";
    if (monthStr === prevMonthYear) return "bulan_lalu";
    return null;
  };

  useFocusEffect(
    useCallback(() => {
      let isMounted = true;
      setIsLoading(true);

      const periodParam = getPeriodParam(selectedMonth);

      Promise.all([
        inventoryService.getReportSummary(periodParam),
        inventoryService.getTransactions(periodParam),
        inventoryService.getStats(periodParam)
      ]).then(([summary, txs, stats]) => {
        if (isMounted) {
          setSummaryData(summary);
          
          // Map dynamic transactions to transaction log objects
          const logs = txs.slice(0, 3).map(t => {
            const isIncoming = t.type === "incoming";
            const isSuccess = t.status === "Berhasil";
            let colorRef = "primary"; // primary (green), secondary (orange), error (red)
            let icon = "local-shipping";
            let descTitle = "Supplier";
            let descValue = t.supplier_name;

            if (!isIncoming) {
              colorRef = "secondary";
              icon = "shopping-cart";
              descTitle = "Keterangan";
              descValue = "Pengiriman Stok / Penjualan";
            } else if (!isSuccess) {
              colorRef = "error";
              icon = "warning";
              descTitle = "Status";
              descValue = "Transaksi Tertunda";
            }

            return {
              id: t.id_transaksi,
              title: t.items?.map(i => i.nama_buah).join(", ") || t.supplier_name,
              type: isIncoming ? "Stok Masuk" : "Stok Keluar",
              date: t.time_str,
              qty: `${isIncoming ? '+' : '-'}${t.total_weight} kg`,
              icon: icon,
              descTitle: descTitle,
              descValue: descValue,
              colorRef: colorRef
            };
          });

          setTransactionLogs(logs);
          setStatsMetrics(stats);
          setIsLoading(false);
        }
      }).catch(err => {
        console.error(err);
        if (isMounted) setIsLoading(false);
      });

      return () => {
        isMounted = false;
      };
    }, [selectedMonth])
  );

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
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center bg-[#F7F9FB] dark:bg-[#121212]">
          <ActivityIndicator size="large" color="#006C49" />
        </View>
      ) : (
        <ScrollView 
          contentContainerStyle={{ paddingBottom: 120 }}
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
                <Text className="flex-1 font-semibold text-[14px] text-[#191C1E] dark:text-white capitalize">{selectedMonth}</Text>
                <MaterialIcons name={showDropdown ? "keyboard-arrow-up" : "keyboard-arrow-down"} size={20} color="#6C7A71" />
              </TouchableOpacity>
            </View>

            {/* Month Dropdown Menu */}
            {showDropdown && (
              <View className="absolute top-[54px] left-0 right-0 bg-white dark:bg-[#1E1E1E] rounded-xl border border-gray-100 dark:border-gray-800 shadow-lg z-50 overflow-hidden">
                {/* Bulan Ini */}
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

                {/* Bulan Lalu */}
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
              <Text className="text-[18px] font-bold text-[#191C1E] dark:text-white">Ringkasan Periodik</Text>
              <Text className="text-[#006C49] dark:text-[#4EDEA3] font-semibold text-[12px]">Total {summaryData.length} Buah</Text>
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
                  <Text className="text-[24px] font-bold text-[#006C49] dark:text-[#4EDEA3]">+{statsMetrics.total_stock_in}</Text>
                  <Text className="text-[12px] font-medium text-[#6C7A71]">kg</Text>
                </View>
              </View>
              <View className="flex-1 bg-[#F2F4F6] dark:bg-[#2D3133] rounded-xl p-4 border-l-4 border-l-[#9D4300]">
                <Text className="text-[10px] font-bold text-[#6C7A71] mb-1 uppercase tracking-widest">Total Stok Keluar</Text>
                <View className="flex-row items-baseline gap-1">
                  <Text className="text-[24px] font-bold text-[#9D4300]">-{statsMetrics.total_stock_out}</Text>
                  <Text className="text-[12px] font-medium text-[#6C7A71]">kg</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Log Transaksi List */}
          <View className="mb-6">
            <Text className="text-[18px] font-bold text-[#191C1E] dark:text-white mb-4">Log Transaksi Terakhir</Text>
            
            {transactionLogs.length === 0 ? (
              <View className="py-6 items-center">
                <Text className="text-gray-400 text-sm">Tidak ada transaksi dalam periode ini.</Text>
              </View>
            ) : (
              transactionLogs.map((log) => {
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
                      <View className="flex-1 pr-2">
                        <Text className="text-[11px] font-semibold text-[#6C7A71]">{log.id}</Text>
                        <Text className="text-[15px] font-bold text-[#191C1E] dark:text-white mt-0.5" numberOfLines={1}>{log.title}</Text>
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
                          <Text className="text-[13px] font-medium text-[#191C1E] dark:text-white" numberOfLines={1}>{log.descValue}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      )}

      {/* Fixed Bottom Action Bar */}
      <View 
        style={{ paddingBottom: Platform.OS === 'ios' ? 24 : 16 }}
        className="absolute bottom-0 w-full bg-white/95 dark:bg-[#1E1E1E] px-6 pt-4 border-t border-gray-100 dark:border-gray-800 flex-row gap-4 shadow-[0px_-4px_20px_rgba(0,0,0,0.05)]"
      >
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => Alert.alert("Export Excel", "Laporan berhasil diexport dalam format Excel.")}
          className="flex-1 bg-[#006C49] h-14 rounded-full flex-row items-center justify-center gap-2 shadow-lg shadow-[#006C49]/20"
        >
          <MaterialIcons name="file-download" size={20} color="white" />
          <Text className="font-bold text-[14px] text-white">Export to Excel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => Alert.alert("Share", "Membuka menu share perangkat...")}
          className="w-14 h-14 rounded-full bg-[#10B981] flex items-center justify-center shadow-md shadow-[#10B981]/20"
        >
          <MaterialIcons name="share" size={22} color="#00422B" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
