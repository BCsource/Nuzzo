import { useEffect, useState, useCallback } from 'react';
import { AuthContext } from './useAuth';
import { loginUser, registerUser, getCurrentUser } from '../services/authService';
import { saveToken, clearToken, getToken } from '../utils/tokenStorage';
import { USER_TYPES, BADGES } from '../utils/badgeOptions';

// MODO DEV: enquanto o backend não existe, arranca com uma sessão simulada.  REVER DEPOIS DA API FEITA
// Pôr a false assim que a API estiver a responder.
const DEV_MODE = true;

const DEV_USER = {
    id: 'dev-user',
    fName: 'Dev',
    lName: 'Tester',
    email: 'dev@nuzzo.pt',
    dateOfBirth: '1990-01-01',
    bio: '',
    userType: USER_TYPES.MASTER_ADMIN,
    badges: [
        BADGES.AFICIONADO,
        BADGES.HEALTH_PROFESSIONAL,
        BADGES.CARE_PROFESSIONAL,
        BADGES.SUPPLIER,
    ],
};

export function AuthProvider({ children }) {
    // Em modo dev o estado inicial já é o user simulado, para não haver
    // setState síncrono dentro do useEffect.
    const [currentUser, setCurrentUser] = useState(DEV_MODE ? DEV_USER : null);
    const [loading, setLoading] = useState(!DEV_MODE);

    // Ao carregar a app: valida o token guardado junto do backend, porque pode
    // ter expirado ou sido revogado entretanto.
    useEffect(() => {
        if (DEV_MODE) return;

        async function restoreSession() {
            if (!getToken()) {
                setLoading(false);
                return;
            }
            try {
                const user = await getCurrentUser();
                setCurrentUser(user);
            } catch (error) {
                console.error('Could not restore session:', error);
                clearToken();
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        }
        restoreSession();
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

    // Chamar depois de editar o perfil ou de um badge ser aprovado, para
    // refrescar o contexto sem obrigar a novo login.
    const refreshUserData = useCallback(async () => {
        if (!getToken()) return;
        try {
            const user = await getCurrentUser();
            setCurrentUser(user);
        } catch (error) {
            console.error('Could not refresh user profile:', error);
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
