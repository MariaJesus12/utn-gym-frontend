import { useState } from 'react';
import { 
    registerStudentService, 
    registerFuncionarioService,
    getUsersService,
    updateUserService,
    deleteUserService,
    Student,
    Funcionario,
    User
} from '../services/userService';

export const useUsers = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');
    const [users, setUsers] = useState<User[]>([]);

    // Registrar estudiante
    const registerStudent = async (studentData: FormData | Student) => {
        setLoading(true);
        setError('');

        try {
            const result = await registerStudentService(studentData);

            if (result.success) {
                return true;
            } else {
                setError(result.error || 'Error al registrar estudiante');
                return false;
            }
        } catch (err) {
            setError('Error inesperado al registrar estudiante');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Registrar funcionario
    const registerFuncionario = async (funcionarioData: FormData | Funcionario) => {
        setLoading(true);
        setError('');

        try {
            const result = await registerFuncionarioService(funcionarioData);

            if (result.success) {
                return true;
            } else {
                setError(result.error || 'Error al registrar funcionario');
                return false;
            }
        } catch (err) {
            setError('Error inesperado al registrar funcionario');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Obtener usuarios
    const fetchUsers = async (tipo?: 'estudiante' | 'administrativo') => {
        setLoading(true);
        setError('');

        try {
            const result = await getUsersService(tipo);

            console.log('🔍 Resultado en hook:', result);
            console.log('📦 Data en hook:', result.data);

            if (result.success && result.data) {
                console.log('✅ Seteando usuarios:', result.data);
                setUsers(result.data);
                return result.data;
            } else {
                console.error('❌ Error o data vacía:', result);
                setError(result.error || 'Error al obtener usuarios');
                setUsers([]);
                return [];
            }
        } catch (err) {
            console.error('💥 Error inesperado:', err);
            setError('Error inesperado al obtener usuarios');
            setUsers([]);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Actualizar usuario
    const updateUser = async (id: number, userData: Partial<Student | Funcionario>) => {
        setLoading(true);
        setError('');

        try {
            const result = await updateUserService(id, userData);

            if (result.success) {
                // Actualizar lista local
                setUsers(prevUsers => 
                    prevUsers.map(user => 
                        user.id === id ? { ...user, ...userData } : user
                    )
                );
                return true;
            } else {
                setError(result.error || 'Error al actualizar usuario');
                return false;
            }
        } catch (err) {
            setError('Error inesperado al actualizar usuario');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Eliminar usuario
    const deleteUser = async (id: number) => {
        setLoading(true);
        setError('');

        try {
            const result = await deleteUserService(id);

            if (result.success) {
                // Actualizar lista local
                setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
                return true;
            } else {
                setError(result.error || 'Error al eliminar usuario');
                return false;
            }
        } catch (err) {
            setError('Error inesperado al eliminar usuario');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        users,
        registerStudent,
        registerFuncionario,
        fetchUsers,
        updateUser,
        deleteUser,
    };
};
