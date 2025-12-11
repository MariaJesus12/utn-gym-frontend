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
        <View className="flex-1 bg-blue-50">
            {/* Fondo con gradiente suave */}
            <LinearGradient
                colors={['#e0f2fe', '#bfdbfe', '#dbeafe']}
                className="flex-1"
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    className="flex-1"
                >
                    <View className="flex-1 items-center justify-center px-6 relative">

                        {/* Efectos de fondo con glassmorphism */}
                        <View className="absolute top-10 left-0 w-40 h-40 bg-cyan-400 rounded-full opacity-30 blur-3xl" />
                        <View className="absolute bottom-20 right-0 w-56 h-56 bg-teal-400 rounded-full opacity-30 blur-3xl" />

                        {/* Contenedor principal */}
                        <View className="w-full max-w-md">

                            {/* Header */}
                            <View className="items-center mb-8">
                                <LinearGradient
                                    colors={['#22d3ee', '#14b8a6']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{ width: 80, height: 80, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8 }}
                                >
                                    <Ionicons name="barbell" size={48} color="#FFF" />
                                </LinearGradient>
                                <Text className="text-gray-800 text-4xl font-black tracking-tight">
                                    UTN GYM
                                </Text>
                                <Text className="text-gray-600 text-base mt-2 font-medium">
                                    Sistema de Control de Acceso
                                </Text>
                            </View>

                            {/* Card de Login con Glass Effect */}
                            <View className="bg-white/40 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/60">

                                {/* DNI */}
                                <View className="mb-4">
                                    <Text className="text-gray-700 text-sm font-semibold mb-2 ml-1">
                                        DNI
                                    </Text>
                                    <View className="flex-row items-center bg-white/60 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/80">
                                        <Ionicons name="card-outline" size={22} color="#0891b2" />
                                        <TextInput
                                            placeholder="123456789"
                                            placeholderTextColor="#64748b"
                                            className="ml-3 flex-1 text-gray-800 text-base bg-transparent"
                                            value={dni}
                                            onChangeText={(text: any) => {
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
                                    <Text className="text-gray-700 text-sm font-semibold mb-2 ml-1">
                                        CONTRASEÑA
                                    </Text>
                                    <View className="flex-row items-center bg-white/60 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/80">
                                        <Ionicons name="lock-closed-outline" size={22} color="#0891b2" />
                                        <TextInput
                                            placeholder="••••••••"
                                            placeholderTextColor="#64748b"
                                            secureTextEntry={!showPassword}
                                            className="ml-3 flex-1 text-gray-800 text-base bg-transparent"
                                            value={password}
                                            onChangeText={(text: any) => {
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
                                                color="#0891b2" 
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {/* Error */}
                                {displayError ? (
                                    <View className="bg-rose-100/60 border border-rose-300 rounded-xl px-4 py-3 mb-4 backdrop-blur-sm">
                                        <Text className="text-rose-600 text-center text-sm font-medium">
                                            {displayError}
                                        </Text>
                                    </View>
                                ) : null}

                                {/* Botón Iniciar Sesión */}
                                <TouchableOpacity
                                    onPress={handleLogin}
                                    disabled={loading}
                                    activeOpacity={0.8}
                                    className="rounded-xl shadow-lg overflow-hidden"
                                >
                                    <LinearGradient
                                        colors={['#06b6d4', '#14b8a6']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={{ paddingVertical: 16, alignItems: 'center' }}
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
                                    </LinearGradient>
                                </TouchableOpacity>

                                {/* Divider */}
                                <View className="flex-row items-center my-6">
                                    <View className="flex-1 h-px bg-gray-300" />
                                    <Text className="text-gray-600 px-4 text-xs font-medium">O</Text>
                                    <View className="flex-1 h-px bg-gray-300" />
                                </View>

                                {/* Botón Registro */}
                                <TouchableOpacity
                                    onPress={() => router.push("/register")}
                                    className="bg-white/50 backdrop-blur-sm border-2 border-cyan-400 py-4 rounded-xl items-center active:scale-95 transition-transform"
                                >
                                    <Text className="text-cyan-600 text-lg font-bold">
                                        CREAR CUENTA
                                    </Text>
                                </TouchableOpacity>

                            </View>

                            {/* Footer */}
                            <View className="items-center mt-6">
                                <Text className="text-gray-600 text-xs">
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
