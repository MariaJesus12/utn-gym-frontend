import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUsers } from '../../hooks/useUsers';
import { useRouter } from 'expo-router';
import { getCareersService, Career } from '../../services/careerService';
import { Picker } from '@react-native-picker/picker';

export default function RegisterStudent() {
    const router = useRouter();
    const { registerStudent, loading, error } = useUsers();

    const [careers, setCareers] = useState<Career[]>([]);
    const [loadingCareers, setLoadingCareers] = useState(true);

    const [formData, setFormData] = useState({
        nombre: '',
        apellido1: '',
        apellido2: '',
        dni: '',
        id_carrera: 0,
    });

    const [validationError, setValidationError] = useState('');

    // Cargar carreras al montar el componente
    useEffect(() => {
        const loadCareers = async () => {
            console.log('🔄 Iniciando carga de carreras...');
            const result = await getCareersService();
            console.log('📦 Resultado de carreras:', result);
            if (result.success && result.data) {
                console.log('✅ Carreras cargadas:', result.data);
                setCareers(result.data);
            } else {
                console.error('❌ No se pudieron cargar las carreras:', result.error);
            }
            setLoadingCareers(false);
        };

        loadCareers();
    }, []);

    const handleChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setValidationError('');
    };

    const handleSubmit = async () => {
        // Validación
        if (!formData.nombre || !formData.apellido1 || !formData.apellido2 || !formData.dni || !formData.id_carrera) {
            setValidationError('Por favor completa todos los campos obligatorios');
            return;
        }

        const success = await registerStudent(formData);

        if (success) {
            Alert.alert(
                '✅ Éxito',
                'Estudiante registrado exitosamente',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Limpiar formulario
                            setFormData({
                                nombre: '',
                                apellido1: '',
                                apellido2: '',
                                dni: '',
                                id_carrera: 0,
                            });
                            router.back();
                        },
                    },
                ]
            );
        }
    };

    const displayError = validationError || error;

    return (
        <LinearGradient
            colors={['#e0f2fe', '#bfdbfe', '#dbeafe']}
            className="flex-1"
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
            >
                <ScrollView className="flex-1">
                    <View className="p-6">
                        {/* Header */}
                        <View className="mb-6">
                            <View className="flex-row items-center mb-4">
                                <TouchableOpacity onPress={() => router.back()} className="mr-3">
                                    <Ionicons name="arrow-back" size={28} color="#1f2937" />
                                </TouchableOpacity>
                                <View>
                                    <Text className="text-gray-800 text-2xl font-bold">
                                        Registrar Estudiante
                                    </Text>
                                    <Text className="text-gray-600 text-sm">
                                        Completa todos los datos requeridos
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Form Card con Glass Effect */}
                        <View className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-white/80">
                            
                            {/* Nombre */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm font-semibold mb-2 ml-1">
                                    Nombre *
                                </Text>
                                <View className="flex-row items-center bg-white/60 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/80">
                                    <Ionicons name="person-outline" size={20} color="#0891b2" />
                                    <TextInput
                                        placeholder="Juan"
                                        placeholderTextColor="#64748b"
                                        className="ml-3 flex-1 text-gray-800 text-base bg-transparent"
                                        value={formData.nombre}
                                        onChangeText={(text) => handleChange('nombre', text)}
                                    />
                                </View>
                            </View>

                            {/* Primer Apellido */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm font-semibold mb-2 ml-1">
                                    Primer Apellido *
                                </Text>
                                <View className="flex-row items-center bg-white/60 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/80">
                                    <Ionicons name="person-outline" size={20} color="#0891b2" />
                                    <TextInput
                                        placeholder="Pérez"
                                        placeholderTextColor="#64748b"
                                        className="ml-3 flex-1 text-gray-800 text-base bg-transparent"
                                        value={formData.apellido1}
                                        onChangeText={(text) => handleChange('apellido1', text)}
                                    />
                                </View>
                            </View>

                            {/* Segundo Apellido */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm font-semibold mb-2 ml-1">
                                    Segundo Apellido *
                                </Text>
                                <View className="flex-row items-center bg-white/60 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/80">
                                    <Ionicons name="person-outline" size={20} color="#0891b2" />
                                    <TextInput
                                        placeholder="García"
                                        placeholderTextColor="#64748b"
                                        className="ml-3 flex-1 text-gray-800 text-base bg-transparent"
                                        value={formData.apellido2}
                                        onChangeText={(text) => handleChange('apellido2', text)}
                                    />
                                </View>
                            </View>

                            {/* DNI */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm font-semibold mb-2 ml-1">
                                    DNI *
                                </Text>
                                <View className="flex-row items-center bg-white/60 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/80">
                                    <Ionicons name="card-outline" size={20} color="#0891b2" />
                                    <TextInput
                                        placeholder="12345678"
                                        placeholderTextColor="#64748b"
                                        className="ml-3 flex-1 text-gray-800 text-base bg-transparent"
                                        value={formData.dni}
                                        onChangeText={(text) => handleChange('dni', text)}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            {/* Carrera */}
                            <View className="mb-6">
                                <Text className="text-gray-700 text-sm font-semibold mb-2 ml-1">
                                    Carrera * {careers.length > 0 && `(${careers.length} disponibles)`}
                                </Text>
                                <View className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/80 overflow-hidden">
                                    {loadingCareers ? (
                                        <View className="py-4 px-4 flex-row items-center">
                                            <ActivityIndicator color="#0891b2" size="small" />
                                            <Text className="ml-2 text-gray-600">Cargando carreras...</Text>
                                        </View>
                                    ) : careers.length === 0 ? (
                                        <View className="py-4 px-4">
                                            <Text className="text-rose-600 text-sm">
                                                No hay carreras disponibles. Verifica la conexión con el servidor.
                                            </Text>
                                        </View>
                                    ) : (
                                        <Picker
                                            selectedValue={formData.id_carrera}
                                            onValueChange={(value) => {
                                                console.log('Carrera seleccionada:', value);
                                                handleChange('id_carrera', value);
                                            }}
                                            style={{ 
                                                color: '#1f2937',
                                                backgroundColor: 'transparent',
                                            }}
                                            dropdownIconColor="#0891b2"
                                        >
                                            <Picker.Item label="Selecciona una carrera" value={0} color="#64748b" />
                                            {careers.map((career) => (
                                                <Picker.Item 
                                                    key={career.id} 
                                                    label={career.titulo} 
                                                    value={career.id}
                                                    color="#1f2937"
                                                />
                                            ))}
                                        </Picker>
                                    )}
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

                            {/* Botón Guardar */}
                            <TouchableOpacity
                                onPress={handleSubmit}
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
                                            <Ionicons name="save" size={20} color="#FFF" />
                                            <Text className="text-white text-lg font-bold ml-2">
                                                GUARDAR ESTUDIANTE
                                            </Text>
                                        </View>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}
