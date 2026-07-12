import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Controller } from 'react-hook-form';
import { Feather } from '@expo/vector-icons';

/**
 * Reusable Input Component with native styling, support for leading icons,
 * error state, and password visibility toggling.
 */
export const Input = ({
  control,
  name,
  label,
  placeholder,
  iconName,
  secureTextEntry = false,
  keyboardType = 'default',
  rightElement, // e.g. "Lupa Password?" link or action
  ...rest
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View className="mb-5 w-full">
          <View className="flex-row justify-between items-center mb-1.5">
            {label && (
              <Text className="text-gray-700 font-semibold text-sm">
                {label}
              </Text>
            )}
            {rightElement}
          </View>

          <View
            className={`flex-row items-center border rounded-xl px-3 bg-white h-12 ${
              error ? 'border-red-500 bg-red-50/10' : 'border-gray-200'
            }`}
          >
            {iconName && (
              <Feather
                name={iconName}
                size={18}
                color={error ? '#EF4444' : '#9CA3AF'}
                style={{ marginRight: 10 }}
              />
            )}
            
            <TextInput
              className="flex-1 text-gray-800 text-[15px] h-full"
              placeholder={placeholder}
              placeholderTextColor="#9CA3AF"
              onChangeText={onChange}
              onBlur={onBlur}
              value={value || ''}
              secureTextEntry={secureTextEntry && !isPasswordVisible}
              keyboardType={keyboardType}
              autoCapitalize="none"
              autoCorrect={false}
              {...rest}
            />

            {secureTextEntry && (
              <TouchableOpacity 
                activeOpacity={0.6}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                className="pl-2 h-full justify-center"
              >
                <Feather
                  name={isPasswordVisible ? 'eye' : 'eye-off'}
                  size={18}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            )}
          </View>

          {error && (
            <Text className="text-red-500 text-xs mt-1.5 font-medium ml-1">
              {error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
};
