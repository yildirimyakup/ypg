import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    rol: string | null;
    ad: string | null;
    id: string | null;
    login: (token: string, rol: string, ad: string,id:string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [rol, setRol] = useState<string | null>(null);
    const [ad, setAd] = useState<string | null>(null);
    const [id, setId] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const rol = localStorage.getItem('rol');
        const ad = localStorage.getItem('ad');
        const id = localStorage.getItem('id');
        if (token && rol) {
            setIsAuthenticated(true);
            setRol(rol);
            setAd(ad);
            setId(id);
        }
    }, []);

    const login = (token: string, rol: string, ad: string,id:string) => {
        localStorage.setItem('token', token);
        localStorage.setItem('rol', rol);
        localStorage.setItem('ad', ad);
        localStorage.setItem('id',id);
        setIsAuthenticated(true);
        setRol(rol);
        setAd(ad);
        setId(id);
    };

    const logout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
        setRol(null);
        setAd(null);

    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, rol, ad, login, logout,id }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth, AuthProvider ile kullanılmalıdır.');
    return context;
};
