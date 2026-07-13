import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  TextInput,
  Alert
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as z from 'zod';
import { authService } from '../services/auth.service';

const registerSchema = z.object({
  fullName: z.string().min(1, 'Nama lengkap wajib diisi'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  confirmPassword: z.string().min(8, 'Konfirmasi password harus diisi'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Konfirmasi password tidak cocok",
  path: ["confirmPassword"],
});

export default function RegisterScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await authService.register(data.fullName, data.email, data.password);
      Alert.alert(
        "Registrasi Berhasil",
        `Simpan Kunci Pemulihan ini untuk memulihkan akun:\n\n${res.recoveryKey}\n\nJangan membagikan kunci ini kepada siapa pun!`,
        [
          {
            text: "Salin & Lanjutkan",
            onPress: () => {
              navigation.navigate('Login');
            }
          }
        ],
        { cancelable: false }
      );
    } catch (error) {
      Alert.alert("Registrasi Gagal", error.detail || "Terjadi kesalahan saat mendaftar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F9F6]">
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          className="px-6 py-8"
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Branding */}
        <View className="items-center mb-8">
        <View className="w-16 h-16 bg-[#006C49] rounded-full items-center justify-center mb-4 shadow-sm shadow-[#006C49]/20">
            <MaterialIcons name="eco" size={36} color="white" />
        </View>
        <Text className="text-[25px] font-bold text-[#191C1E] mb-1">
            Daftar Sekarang
        </Text>
        <Text className="text-gray-500 text-[14px] text-center">
            Mulai kelola inventaris segar Anda.
        </Text>
        </View>

          {/* Form Card Container */}
          <View className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200 border border-gray-100">
            
            {/* Nama Lengkap Field */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-[#3C4A42] mb-1.5">Nama Lengkap</Text>
              <View className="flex-row items-center bg-[#F2F4F6] rounded-xl px-3 h-12 border border-transparent">
                <Feather name="user" size={18} color="#6C7A71" />
                <Controller
                  control={control}
                  name="fullName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="flex-1 ml-3 text-base text-[#191C1E] h-full"
                      placeholder="Masukkan nama Anda"
                      placeholderTextColor="#BBCABF"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
              </View>
              {errors.fullName && <Text className="text-red-500 text-xs mt-1">{errors.fullName.message}</Text>}
            </View>

            {/* Email Field */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-[#3C4A42] mb-1.5">Email</Text>
              <View className="flex-row items-center bg-[#F2F4F6] rounded-xl px-3 h-12">
                <Feather name="mail" size={18} color="#6C7A71" />
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="flex-1 ml-3 text-base text-[#191C1E] h-full"
                      placeholder="contoh@email.com"
                      placeholderTextColor="#BBCABF"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
              </View>
              {errors.email && <Text className="text-red-500 text-xs mt-1">{errors.email.message}</Text>}
            </View>

            {/* Password Field */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-[#3C4A42] mb-1.5">Password</Text>
              <View className="flex-row items-center bg-[#F2F4F6] rounded-xl px-3 h-12">
                <Feather name="lock" size={18} color="#6C7A71" />
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="flex-1 ml-3 text-base text-[#191C1E] h-full"
                      placeholder="Minimal 8 karakter"
                      placeholderTextColor="#BBCABF"
                      secureTextEntry
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
              </View>
              {errors.password && <Text className="text-red-500 text-xs mt-1">{errors.password.message}</Text>}
            </View>

            {/* Konfirmasi Password Field */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-[#3C4A42] mb-1.5">Konfirmasi Password</Text>
              <View className="flex-row items-center bg-[#F2F4F6] rounded-xl px-3 h-12">
                <Feather name="refresh-cw" size={16} color="#6C7A71" />
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="flex-1 ml-3 text-base text-[#191C1E] h-full"
                      placeholder="Ulangi password"
                      placeholderTextColor="#BBCABF"
                      secureTextEntry
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
              </View>
              {errors.confirmPassword && <Text className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</Text>}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="bg-[#006C49] flex-row items-center justify-center h-12 rounded-3xl shadow-sm shadow-[#006C49]/20"
            >
              {isLoading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <View className="flex-row items-center justify-center">
                  <Text className="text-white font-bold text-base mr-2">Daftar</Text>
                  <Feather name="arrow-right" size={18} color="white" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer Navigation */}
          <View className="flex-row justify-center items-center mt-8">
            <Text className="text-gray-500 text-sm">Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-[#006C49] font-bold text-sm">
                Masuk di sini
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}