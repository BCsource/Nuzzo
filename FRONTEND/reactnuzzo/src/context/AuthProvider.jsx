import { useEffect, useState, useCallback } from 'react';
import { AuthContext } from './useAuth';
import { loginUser, registerUser, getCurrentUser } from '../services/authService';
import { saveToken, clearToken, getToken } from '../utils/tokenStorage';

// o be manda as permissões ja calculadas em currentUser.permissions

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(() => Boolean(getToken()));

    useEffect(() => {
        if (!getToken()) return;
        getCurrentUser()
            .then((user) => setCurrentUser(user))
            .catch(() => {
                clearToken();
                setCurrentUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    async function login(email, password) {
        const { token, user } = await loginUser(email, password);
        saveToken(token);
        setCurrentUser(user);
        return user;
    }

    async function register(payload) {
        const { token, user } = await registerUser(payload);
        saveToken(token);
        setCurrentUser(user);
        return user;
    }

    function logout() {
        clearToken();
        setCurrentUser(null);
    }

    const refreshUserData = useCallback(async () => {
        if (!getToken()) return;
        try {
            const user = await getCurrentUser();
            setCurrentUser(user);
        } catch (error) {
            console.error('Could not refresh user profile:', error);
        }
    }, []);

    const value = {
        currentUser,
        permissions: currentUser?.permissions || {},
        loading,
        login,
        register,
        logout,
        refreshUserData,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
