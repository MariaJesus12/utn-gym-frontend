import api from "../api/axiosConfig";

// Tipos actualizados según la API
export interface Student {
    nombre: string;
    apellido1: string;
    apellido2: string;
    dni: string;
    id_carrera: number;
}

export interface Funcionario {
    nombre: string;
    apellido1: string;
    apellido2: string;
    dni: string;
    id_puesto: number;
}

export interface User {
    id: number;
    id_persona: number;
    nombre: string;
    apellido1: string;
    apellido2: string;
    dni: string;
    tipo: 'estudiante' | 'funcionario';
    detalle: string;
    createdAt?: string;
}

// Registrar estudiante
export const registerStudentService = async (studentData: Student) => {
    try {
        console.log('📝 Registrando estudiante:', studentData);
        
        const response = await api.post('/users/student', studentData);
        
        console.log('✅ Estudiante registrado:', response.data);
        return {
            success: true,
            data: response.data,
            message: 'Estudiante registrado exitosamente'
        };
    } catch (error: any) {
        console.error('❌ Error al registrar estudiante:', error.response?.data || error.message);
        
        return {
            success: false,
            error: error.response?.data?.message || 'Error al registrar estudiante'
        };
    }
};

// Registrar funcionario
export const registerFuncionarioService = async (funcionarioData: Funcionario) => {
    try {
        console.log('📝 Registrando funcionario:', funcionarioData);
        
        const response = await api.post('/users/funcionario', funcionarioData);
        
        console.log('✅ Funcionario registrado:', response.data);
        return {
            success: true,
            data: response.data,
            message: 'Funcionario registrado exitosamente'
        };
    } catch (error: any) {
        console.error('❌ Error al registrar funcionario:', error.response?.data || error.message);
        
        return {
            success: false,
            error: error.response?.data?.message || 'Error al registrar funcionario'
        };
    }
};

// Obtener todos los usuarios sin paginación (solo para contar)
export const getAllUsersService = async () => {
    try {
        const response = await api.get('/users');
        
        const users = Array.isArray(response.data) 
            ? response.data 
            : response.data?.data || [];
        
        return {
            success: true,
            data: users,
            total: users.length
        };
    } catch (error: any) {
        console.error('❌ Error al obtener usuarios:', error.response?.data || error.message);
        
        return {
            success: false,
            error: error.response?.data?.message || 'Error al obtener usuarios',
            data: [],
            total: 0
        };
    }
};

// Obtener todos los usuarios paginados
export const getUsersService = async (tipo?: 'estudiante' | 'administrativo', page: number = 1, limit: number = 100) => {
    try {
        console.log('📋 Obteniendo usuarios paginados...');
        
        let url = `/users/paginated?page=${page}&limit=${limit}`;
        if (tipo) {
            url += `&tipo=${tipo}`;
        }
        
        const response = await api.get(url);
        
        console.log('✅ Usuarios obtenidos:', response.data);
        console.log('📦 Data extraída:', response.data.data);
        
        // Extraer el array de usuarios según la estructura de la respuesta
        const users = response.data?.data || response.data?.users || [];
        
        console.log('👥 Array de usuarios final:', users);
        console.log('📊 Es array?', Array.isArray(users));
        
        return {
            success: true,
            data: Array.isArray(users) ? users : [],
            pagination: response.data?.pagination || {
                currentPage: response.data?.currentPage || page,
                limit: response.data?.limit || limit,
                totalCount: response.data?.totalCount || users.length,
                totalPages: response.data?.totalPages || 1
            }
        };
    } catch (error: any) {
        console.error('❌ Error al obtener usuarios:', error.response?.data || error.message);
        
        return {
            success: false,
            error: error.response?.data?.message || 'Error al obtener usuarios',
            data: []
        };
    }
};

// Actualizar usuario
export const updateUserService = async (id: number, userData: Partial<Student | Funcionario>) => {
    try {
        const response = await api.put(`/users/${id}`, userData);
        
        return {
            success: true,
            data: response.data,
            message: 'Usuario actualizado exitosamente'
        };
    } catch (error: any) {
        console.error('❌ Error al actualizar usuario:', error.response?.data || error.message);
        
        return {
            success: false,
            error: error.response?.data?.message || 'Error al actualizar usuario'
        };
    }
};

// Eliminar usuario
export const deleteUserService = async (id: number) => {
    try {
        const response = await api.delete(`/users/${id}`);
        
        return {
            success: true,
            message: 'Usuario eliminado exitosamente'
        };
    } catch (error: any) {
        console.error('❌ Error al eliminar usuario:', error.response?.data || error.message);
        
        return {
            success: false,
            error: error.response?.data?.message || 'Error al eliminar usuario'
        };
    }
};
