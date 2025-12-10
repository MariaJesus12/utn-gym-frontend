import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
    const router = useRouter();
    const { login, loading, error: authError } = useAuth();
    
    const [dni, setDni] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [validationError, setValidationError] = useState("");

    const handleLogin = async () => {
        // Validación local
        if (!dni || !password) {
            setValidationError('Por favor completa todos los campos');
            return;
        }

        setValidationError('');

        // Usar el servicio de autenticación
        const success = await login(dni, password);

        if (success) {
            router.replace("/(drawer)/home");
        }
    };

    // Mostrar error de validación o del servicio
    const displayError = validationError || authError;

    return (
        <View className="flex-1 bg-gray-900">
            {/* Fondo con gradiente oscuro */}
            <LinearGradient
                colors={['#0f172a', '#1e293b', '#334155']}
                className="flex-1"
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    className="flex-1"
                >
                    <View className="flex-1 items-center justify-center px-6 relative">

                        {/* Efectos de fondo estilo gym */}
                        <View className="absolute top-10 left-0 w-40 h-40 bg-red-600 rounded-full opacity-20 blur-3xl" />
                        <View className="absolute bottom-20 right-0 w-56 h-56 bg-yellow-500 rounded-full opacity-20 blur-3xl" />

                        {/* Contenedor principal */}
                        <View className="w-full max-w-md">

                            {/* Header */}
                            <View className="items-center mb-8">
                                <View className="mb-4 bg-red-600 w-20 h-20 rounded-2xl items-center justify-center shadow-xl">
                                    <Ionicons name="barbell" size={48} color="#FFF" />
                                </View>
                                <Text className="text-white text-4xl font-black tracking-tight">
                                    UTN GYM
                                </Text>
                                <Text className="text-gray-400 text-base mt-2 font-medium">
                                    Sistema de Control de Acceso
                                </Text>
                            </View>

                            {/* Card de Login */}
                            <View className="bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-gray-700">

                                {/* DNI */}
                                <View className="mb-4">
                                    <Text className="text-gray-300 text-sm font-semibold mb-2 ml-1">
                                        DNI
                                    </Text>
                                    <View className="flex-row items-center bg-gray-900/50 rounded-xl px-4 py-4">
                                        <Ionicons name="card-outline" size={22} color="#9CA3AF" />
                                        <TextInput
                                            placeholder="123456789"
                                            placeholderTextColor="#6B7280"
                                            className="ml-3 flex-1 text-white text-base bg-transparent"
                                            value={dni}
                                            onChangeText={(text) => {
                                                setDni(text);
                                                setValidationError('');
                                            }}
                                            autoCapitalize="none"
                                            keyboardType="numeric"
                                            autoComplete="off"
                                            textContentType="none"
                                        />
                                    </View>
                                </View>

                                {/* Contraseña */}
                                <View className="mb-6">
                                    <Text className="text-gray-300 text-sm font-semibold mb-2 ml-1">
                                        CONTRASEÑA
                                    </Text>
                                    <View className="flex-row items-center bg-gray-900/50 rounded-xl px-4 py-4">
                                        <Ionicons name="lock-closed-outline" size={22} color="#9CA3AF" />
                                        <TextInput
                                            placeholder="••••••••"
                                            placeholderTextColor="#6B7280"
                                            secureTextEntry={!showPassword}
                                            className="ml-3 flex-1 text-white text-base bg-transparent"
                                            value={password}
                                            onChangeText={(text) => {
                                                setPassword(text);
                                                setValidationError('');
                                            }}
                                            autoComplete="off"
                                            textContentType="none"
                                        />
                                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                            <Ionicons 
                                                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                                                size={22} 
                                                color="#9CA3AF" 
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Error */}
                                {displayError ? (
                                    <View className="bg-red-500/20 border border-red-500 rounded-xl px-4 py-3 mb-4">
                                        <Text className="text-red-400 text-center text-sm font-medium">
                                            {displayError}
                                        </Text>
                                    </View>
                                ) : null}

                                {/* Botón Iniciar Sesión */}
                                <TouchableOpacity
                                    onPress={handleLogin}
                                    disabled={loading}
                                    className="bg-red-600 py-4 rounded-xl items-center shadow-lg active:scale-95 transition-transform"
                                >
                                    {loading ? (
                                        <ActivityIndicator color="#FFF" size="small" />
                                    ) : (
                                        <View className="flex-row items-center">
                                            <Text className="text-white text-lg font-bold mr-2">
                                                INICIAR SESIÓN
                                            </Text>
                                            <Ionicons name="arrow-forward" size={20} color="#FFF" />
                                        </View>
                                    )}
                                </TouchableOpacity>

                                {/* Divider */}
                                <View className="flex-row items-center my-6">
                                    <View className="flex-1 h-px bg-gray-600" />
                                    <Text className="text-gray-500 px-4 text-xs font-medium">O</Text>
                                    <View className="flex-1 h-px bg-gray-600" />
                                </View>

                                {/* Botón Registro */}
                                <TouchableOpacity
                                    onPress={() => router.push("/register")}
                                    className="bg-transparent border-2 border-yellow-500 py-4 rounded-xl items-center active:scale-95 transition-transform"
                                >
                                    <Text className="text-yellow-500 text-lg font-bold">
                                        CREAR CUENTA
                                    </Text>
                                </TouchableOpacity>

                            </View>

                            {/* Footer */}
                            <View className="items-center mt-6">
                                <Text className="text-gray-500 text-xs">
                                    © 2024 UTN GYM - Todos los derechos reservados
                                </Text>
                            </View>

                        </View>
                    </View>
                </KeyboardAvoidingView>
            </LinearGradient>
        </View>
    );
}
