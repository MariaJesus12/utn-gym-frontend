import api from "../api/axiosConfig";

export interface Career {
    id: number;
    titulo: string;
}

// Obtener todas las carreras
export const getCareersService = async () => {
    try {
        console.log('📚 Obteniendo carreras...');
        
        const response = await api.get('/careers');
        
        console.log('✅ Carreras obtenidas:', response.data);
        
        // Extraer el array de carreras según la estructura de la respuesta
        const careers = Array.isArray(response.data) 
            ? response.data 
            : response.data.data || response.data.careers || [];
        
        return {
            success: true,
            data: careers
        };
    } catch (error: any) {
        console.error('❌ Error al obtener carreras:', error.response?.data || error.message);
        
        return {
            success: false,
            error: error.response?.data?.message || 'Error al obtener carreras',
            data: []
        };
    }
};

// Obtener carrera por ID
export const getCareerByIdService = async (id: number) => {
    try {
        console.log(`📚 Obteniendo carrera ${id}...`);
        
        const response = await api.get(`/careers/${id}`);
        
        console.log('✅ Carrera obtenida:', response.data);
        return {
            success: true,
            data: response.data
        };
    } catch (error: any) {
        console.error('❌ Error al obtener carrera:', error.response?.data || error.message);
        
        return {
            success: false,
            error: error.response?.data?.message || 'Error al obtener carrera'
        };
    }
};
