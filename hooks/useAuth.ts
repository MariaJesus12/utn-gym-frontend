// hooks/useAuth.ts
import { useState } from "react";
import { loginService, logoutService } from "../services/authService";

export function useAuth() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (dni: string, password: string) => {
        try {
            setLoading(true);
            setError(null);

            await loginService(dni, password);
            console.log("[useAuth] Login exitoso ✓");
            return true;

        } catch (err: any) {
            const errorMsg = err?.response?.data?.message || err?.message || "Error al iniciar sesión";
            setError(errorMsg);
            console.error("[useAuth] Login falló:", errorMsg);
            return false;

        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await logoutService();
    };

    return {
        login,
        logout,
        loading,
        error,
    };
}
