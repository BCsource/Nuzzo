import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { loginUser, registerUser, getCurrentUser } from '../services/authService';
import { saveToken, clearToken, getToken } from '../utils/tokenStorage';
import { USER_TYPES } from '../utils/badgeOptions';


// Faz a autenticação dos users (roles e badges) para todas as págs


const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // ===== MODO DEV: sem backend, simula sessão já iniciada =====
        setCurrentUser({
            id: 'dev-user',
            fName: 'Dev',
            lName: 'Tester',
            email: 'dev@nuzzo.pt',
            dateOfBirth: '1990-01-01',
            bio: '',
            userType: 'masterAdmin', // vê tudo, incluindo páginas de Admin
            badges: ['aficionado', 'profissionalSaude', 'profissionalCuidados', 'fornecedor'],
        });
        setLoading(false);
        return;

        /* ===== código real (descomentar quando o backend existir) =====

        async function restoreSession() {
            const token = getToken();
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);
            } catch (err) {
                console.error('Could not restore session:', err);
                clearToken();
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        }
        restoreSession();
        */
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
        } catch (err) {
            console.error('Could not refresh user profile:', err);
        }
    }, []);

    const isAdmin = currentUser?.userType === USER_TYPES.ADMIN
        || currentUser?.userType === USER_TYPES.MASTER_ADMIN;
    const isMasterAdmin = currentUser?.userType === USER_TYPES.MASTER_ADMIN;

    function hasBadge(badge) {
        return Array.isArray(currentUser?.badges) && currentUser.badges.includes(badge);
    }

    const value = {
        currentUser,
        loading,
        isAdmin,
        isMasterAdmin,
        hasBadge,
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
