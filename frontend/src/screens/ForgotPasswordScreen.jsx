import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ActivityIndicator, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  TextInput
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Feather } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as z from 'zod';
import { SafeAreaView } from 'react-native-safe-area-context';

// Skema validasi menggunakan Zod sesuai field pemulihan pada HTML
const forgotPasswordSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  recoveryKey: z.string().min(1, 'Recovery key wajib diisi'),
  newPassword: z.string().min(8, 'Password baru minimal 8 karakter'),
});

export default function ForgotPasswordScreen({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
      recoveryKey: '',
      newPassword: ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Masukkan logika integrasi API pemulihan di sini
      console.log('Reset Password Data:', data);
    } catch (error) {
      console.error(error);
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
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6 py-6"
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="flex-row items-center mb-6 mt-2"
          >
            <Feather name="arrow-left" size={20} color="#006C49" />
            <Text className="text-[#006C49] font-semibold text-sm ml-2">
              Kembali ke Login
            </Text>
          </TouchableOpacity>

          {/* Header Title Area */}
          <View className="mb-6">
            <Text className="text-[27px] font-bold text-[#006C49] mb-2 font-sans">
              Lupa Password?
            </Text>
            <Text className="text-[#3C4A42] text-sm leading-5 font-sans">
              Jangan khawatir. Masukkan email dan kunci pemulihan untuk mengatur ulang kata sandi Anda.
            </Text>
          </View>

          {/* Form Card Container */}
          <View className="bg-white rounded-2xl p-6 shadow-md shadow-gray-200 border border-gray-100 mb-6">
            
            {/* Email Field */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-[#191C1E] mb-1.5">Email Akun</Text>
              <View className="flex-row items-center bg-[#F2F4F6] rounded-xl px-3 h-12">
                <Feather name="mail" size={18} color="#6C7A71" />
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="flex-1 ml-3 text-base text-[#191C1E] h-full"
                      placeholder="contoh@freshvitality.com"
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

            {/* Recovery Key Field */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-[#191C1E] mb-1.5">Recovery Key</Text>
              <View className="flex-row items-center bg-[#F2F4F6] rounded-xl px-3 h-12">
                <Feather name="key" size={18} color="#6C7A71" />
                <Controller
                  control={control}
                  name="recoveryKey"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="flex-1 ml-3 text-base text-[#191C1E] h-full"
                      placeholder="Masukkan 8 digit kode"
                      placeholderTextColor="#BBCABF"
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
              </View>
              <Text className="text-xs text-[#BBCABF] mt-1.5">Kunci ini diberikan saat Anda pertama kali mendaftar.</Text>
              {errors.recoveryKey && <Text className="text-red-500 text-xs mt-1">{errors.recoveryKey.message}</Text>}
            </View>

            {/* New Password Field */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-[#191C1E] mb-1.5">Password Baru</Text>
              <View className="flex-row items-center bg-[#F2F4F6] rounded-xl px-3 h-12">
                <Feather name="lock" size={18} color="#6C7A71" />
                <Controller
                  control={control}
                  name="newPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className="flex-1 ml-3 text-base text-[#191C1E] h-full"
                      placeholder="Minimal 8 karakter"
                      placeholderTextColor="#BBCABF"
                      secureTextEntry={isPasswordSecure}
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
                <TouchableOpacity onPress={() => setIsPasswordSecure(!isPasswordSecure)}>
                  <Feather name={isPasswordSecure ? "eye-off" : "eye"} size={18} color="#6C7A71" />
                </TouchableOpacity>
              </View>
              {errors.newPassword && <Text className="text-red-500 text-xs mt-1">{errors.newPassword.message}</Text>}
            </View>

            {/* Action Buttons */}
            <View className="gap-3 mt-4">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleSubmit(onSubmit)}
                disabled={isLoading}
                className="w-full bg-[#006C49] h-12 rounded-xl items-center justify-center shadow-md shadow-[#006C49]/20"
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text className="text-white font-bold text-base">Reset Password</Text>
                )}
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}