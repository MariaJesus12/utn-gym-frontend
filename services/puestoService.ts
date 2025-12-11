import api from "../api/axiosConfig";

export interface Puesto {
    id: number;
    nombre_puesto: string;
}

// Obtener todos los puestos
export const getPuestosService = async () => {
    try {
        console.log('💼 Obteniendo puestos...');
        
        const response = await api.get('/puestos');
        
        console.log('✅ Puestos obtenidos:', response.data);
        
        // Extraer el array de puestos según la estructura de la respuesta
        const puestos = Array.isArray(response.data) 
            ? response.data 
            : response.data.data || response.data.puestos || [];
        
        return {
            success: true,
            data: puestos
        };
    } catch (error: any) {
        console.error('❌ Error al obtener puestos:', error.response?.data || error.message);
        
        return {
            success: false,
            error: error.response?.data?.message || 'Error al obtener puestos',
            data: []
        };
    }
};

// Obtener puesto por ID
export const getPuestoByIdService = async (id: number) => {
    try {
        console.log(`💼 Obteniendo puesto ${id}...`);
        
        const response = await api.get(`/puestos/${id}`);
        
        console.log('✅ Puesto obtenido:', response.data);
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error('❌ Error al obtener puesto:', error.response?.data || error.message);
        
        return {
            success: false,
            error: error.response?.data?.message || 'Error al obtener puesto'
        };
    }
};
