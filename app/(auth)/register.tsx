import React from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Register() {
    const router = useRouter();

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1 bg-white">
            <View className="flex-1 items-center justify-center bg-white relative">
                {/* Blobs de fondo con colores del logo TCU */}
                <View className="absolute -top-20 -left-24 w-72 h-72 bg-tcu-blue rounded-full opacity-95" />
                <View className="absolute -bottom-20 -right-24 w-72 h-72 bg-tcu-orange rounded-full opacity-95" />

                <View className="w-11/12 max-w-md px-6 py-8 bg-white rounded-2xl shadow-lg">
                

                    <View className="bg-white rounded-xl overflow-hidden">
                        <View className="px-2">
                            <View className="flex-row items-center border-b border-gray-200 py-3">
                                <Ionicons name="person-outline" size={20} color="#6b7280" />
                                <TextInput placeholder="Usuario" placeholderTextColor="#9CA3AF" className="ml-3 flex-1 text-gray-800" />
                            </View>

                            <View className="flex-row items-center border-b border-gray-200 py-3">
                                <Ionicons name="mail-outline" size={20} color="#6b7280" />
                                <TextInput placeholder="Correo" placeholderTextColor="#9CA3AF" className="ml-3 flex-1 text-gray-800" keyboardType="email-address" />
                            </View>

                            <View className="flex-row items-center border-b border-gray-200 py-3">
                                <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
                                <TextInput placeholder="Contraseña" secureTextEntry placeholderTextColor="#9CA3AF" className="ml-3 flex-1 text-gray-800" />
                            </View>

                            <View className="flex-row items-center border-b border-gray-200 py-3">
                                <Ionicons name="lock-closed-outline" size={20} color="#6b7280" />
                                <TextInput placeholder="Repetir Contraseña" secureTextEntry placeholderTextColor="#9CA3AF" className="ml-3 flex-1 text-gray-800" />
                            </View>
                        </View>
                    </View>

                    {/* Botones de Registrar y Login lado a lado */}
                    <View className="gap-3 mt-8">
                        <TouchableOpacity onPress={() => router.back()} className="flex-1 bg-tcu-orange py-4 rounded-xl items-center">
                            <Text className="text-white text-base font-semibold">Registrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}