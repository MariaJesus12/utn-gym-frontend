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
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useUsers } from '../../hooks/useUsers';
import { useRouter } from 'expo-router';
import { getPuestosService, Puesto } from '../../services/puestoService';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

export default function RegisterAdmin() {
    const router = useRouter();
    const { registerFuncionario, loading, error } = useUsers();

    const [puestos, setPuestos] = useState<Puesto[]>([]);
    const [loadingPuestos, setLoadingPuestos] = useState(true);
    const [photoUri, setPhotoUri] = useState<string>('');
    const [photoBase64, setPhotoBase64] = useState<string>('');

    const [formData, setFormData] = useState({
        nombre: '',
        apellido1: '',
        apellido2: '',
        dni: '',
        id_puesto: 0,
    });

    const [validationError, setValidationError] = useState('');

    // Cargar puestos al montar el componente
    useEffect(() => {
        const loadPuestos = async () => {
            console.log('🔄 Iniciando carga de puestos...');
            const result = await getPuestosService();
            console.log('📦 Resultado de puestos:', result);
            if (result.success && result.data) {
                console.log('✅ Puestos cargados:', result.data);
                setPuestos(result.data);
            } else {
                console.error('❌ No se pudieron cargar los puestos:', result.error);
            }
            setLoadingPuestos(false);
        };

        loadPuestos();
    }, []);

    const handleChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setValidationError('');
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permisos requeridos', 'Se necesita acceso a la galería para seleccionar una foto');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
            base64: true,
        });

        if (!result.canceled && result.assets[0]) {
            const uri = result.assets[0].uri;
            const base64 = result.assets[0].base64;
            
            console.log('📸 URI de la imagen:', uri);
            console.log('📦 Base64 obtenido:', base64 ? 'Sí (longitud: ' + base64.length + ')' : 'No');
            
            setPhotoUri(uri);
            
            if (base64) {
                // Limpiar el base64 por si tiene prefijos
                const cleanBase64 = base64.replace(/^data:image\/[a-z]+;base64,/, '');
                setPhotoBase64(cleanBase64);
                console.log('✅ Base64 limpio guardado:', cleanBase64.substring(0, 50) + '...');
            } else {
                console.error('❌ No se obtuvo base64');
                Alert.alert('Error', 'No se pudo obtener la imagen en formato base64');
            }
        }
    };

    const handleSubmit = async () => {
        // Validación
        if (!formData.nombre || !formData.apellido1 || !formData.dni || !formData.id_puesto) {
            setValidationError('Por favor completa todos los campos obligatorios');
            return;
        }

        // Crear FormData para enviar con foto
        const formDataToSend = new FormData();
        formDataToSend.append('nombre', formData.nombre);
        formDataToSend.append('apellido1', formData.apellido1);
        if (formData.apellido2) formDataToSend.append('apellido2', formData.apellido2);
        formDataToSend.append('dni', formData.dni);
        formDataToSend.append('id_puesto', formData.id_puesto.toString());
        
        // Si hay foto, agregarla como archivo
        if (photoUri && photoBase64) {
            const response = await fetch(`data:image/jpeg;base64,${photoBase64}`);
            const blob = await response.blob();
            formDataToSend.append('photo', blob, 'photo.jpg');
            console.log('📸 Foto agregada al FormData');
        }

        console.log('📤 Enviando datos del funcionario con FormData');

        const success = await registerFuncionario(formDataToSend);

        if (success) {
            Alert.alert(
                '✅ Éxito',
                'Funcionario registrado exitosamente',
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
                                id_puesto: 0,
                            });
                            setPhotoUri('');
                            setPhotoBase64('');
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
                                        Registrar Funcionario
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
                                        placeholder="María"
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
                                        placeholder="González"
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
                                    Segundo Apellido
                                </Text>
                                <View className="flex-row items-center bg-white/60 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/80">
                                    <Ionicons name="person-outline" size={20} color="#0891b2" />
                                    <TextInput
                                        placeholder="López"
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
                                        placeholder="11223344"
                                        placeholderTextColor="#64748b"
                                        className="ml-3 flex-1 text-gray-800 text-base bg-transparent"
                                        value={formData.dni}
                                        onChangeText={(text) => handleChange('dni', text)}
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>

                            {/* Foto */}
                            <View className="mb-4">
                                <Text className="text-gray-700 text-sm font-semibold mb-2 ml-1">
                                    Foto
                                </Text>
                                <TouchableOpacity 
                                    onPress={pickImage}
                                    className="bg-white/60 backdrop-blur-sm rounded-xl border border-white/80 overflow-hidden"
                                >
                                    {photoUri ? (
                                        <View className="relative">
                                            <Image 
                                                source={{ uri: photoUri }} 
                                                className="w-full h-48"
                                                style={{ resizeMode: 'cover' }}
                                            />
                                            <View className="absolute top-2 right-2 bg-emerald-500 rounded-full p-2">
                                                <Ionicons name="create" size={20} color="#FFF" />
                                            </View>
                                        </View>
                                    ) : (
                                        <View className="py-8 items-center">
                                            <Ionicons name="camera-outline" size={48} color="#10b981" />
                                            <Text className="text-gray-600 mt-3 text-sm">
                                                Toca para seleccionar una foto
                                            </Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>

                            {/* Puesto */}
                            <View className="mb-6">
                                <Text className="text-gray-700 text-sm font-semibold mb-2 ml-1">
                                    Puesto * {puestos.length > 0 && `(${puestos.length} disponibles)`}
                                </Text>
                                <View className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/80 overflow-hidden">
                                    {loadingPuestos ? (
                                        <View className="py-4 px-4 flex-row items-center">
                                            <ActivityIndicator color="#0891b2" size="small" />
                                            <Text className="ml-2 text-gray-600">Cargando puestos...</Text>
                                        </View>
                                    ) : puestos.length === 0 ? (
                                        <View className="py-4 px-4">
                                            <Text className="text-rose-600 text-sm">
                                                No hay puestos disponibles. Verifica la conexión con el servidor.
                                            </Text>
                                        </View>
                                    ) : (
                                        <Picker
                                            selectedValue={formData.id_puesto}
                                            onValueChange={(value) => {
                                                console.log('Puesto seleccionado:', value);
                                                handleChange('id_puesto', value);
                                            }}
                                            style={{ 
                                                color: '#1f2937',
                                                backgroundColor: 'transparent',
                                            }}
                                            dropdownIconColor="#0891b2"
                                        >
                                            <Picker.Item label="Selecciona un puesto" value={0} color="#64748b" />
                                            {puestos.map((puesto) => (
                                                <Picker.Item 
                                                    key={puesto.id} 
                                                    label={puesto.nombre_puesto} 
                                                    value={puesto.id}
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
                                    colors={['#14b8a6', '#10b981']}
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
                                                GUARDAR FUNCIONARIO
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
