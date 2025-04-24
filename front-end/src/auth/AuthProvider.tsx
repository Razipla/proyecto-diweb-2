//hooks de react necesarios para la autentificación
import { useContext, createContext, useState, useEffect } from "react";
import type { AuthResponse, AccessTokenResponse, User } from "../types/types";
import { API_URL } from "./constants";

//Provee un contexto de autenticación y gestiona el estado de autenticación de la aplicación.
interface AuthProviderProps{
    children: React.ReactNode;
}
const AuthContext = createContext ({
    isAuthenticated: false,
    getAccessToken:() => {},
    saveUser: (_userData: AuthResponse) => {},
    getRefreshToken: () => {},
    getUser: () => ({} as User | undefined ),
    signOut: () =>{},
});
export function AuthProvider({children}:AuthProviderProps) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string>("");
    const [user, setUser] = useState<User>();
    const [ isLoading, setIsLoading] = useState(true);

    //const [refreshToken, setRefreshToken] = useState<string>("");
    //Valida la autentificacion de la aplicación \
    useEffect(() => { checkAuth(); }, []);

    async function requestNewAccessToken(refreshToken: string) {
        try {
            const response =  await fetch(`${API_URL}/refresh-token`, { 
                method : "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization : `Bearer ${refreshToken}`,           
            },
        });
            if(response.ok) {
                const json = await response.json() as AccessTokenResponse;
                if(json.error) {
                    throw new Error (json.error);
                }
                return json.body.accessToken;
            } else {
                throw new Error (response.statusText);
        }
    } catch (error) {
        console.log(error);
        return null;
        }
    }
    async function getUserInfo(AccessToken:string) {
        try {
            const response =  await fetch(`${API_URL}/user`, { 
                method : "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization : `Bearer ${AccessToken}`,           
            },
        });
        if(response.ok) {
            const json = await response.json();
            if(json.error) {
                throw new Error (json.error);
            }
            return json.body;
        } else {
            throw new Error (response.statusText);
        }
    } catch (error) {
        console.log(error);
        return null;
        }
    }
        
    
    async function checkAuth() {
        if (accessToken) {
        //el usuario esta autentificado
        const userInfo = await getUserInfo(accessToken);
        if (userInfo) {
            saveSessionInfo(userInfo, accessToken, getRefreshToken()!);
            setIsLoading(false);
            return;
        }
        } else{
        ////el usuario no esta autentificado
        const token = getAccessToken();
            if (token) {
                const newAccessToken = await requestNewAccessToken(token);
                if (newAccessToken) {
                    const userInfo = await getUserInfo(newAccessToken);
                    if (userInfo) {
                        saveSessionInfo(userInfo, newAccessToken, token);
                        setIsLoading(false);
                        return;
                    }
                }
            }
        }
        setIsLoading(false);
    }
    function signOut() {
        setIsAuthenticated(false);
        setAccessToken("");
        setUser(undefined);
        localStorage.removeItem("token");
    }
    function saveSessionInfo(
        userInfo:User, 
        accessToken: string,
         refreshToken:string
        ) {
        setAccessToken(accessToken);
        localStorage.setItem ("token", JSON.stringify(refreshToken));
        setIsAuthenticated(true);
        setUser(userInfo);
    }
    function getAccessToken(){
        return accessToken;
    }
    function getRefreshToken():string|null {
        const tokenData =  localStorage.getItem("token");
        if (tokenData) {
            const { token } = JSON.parse(tokenData);
            return token;
        }
    return null;
    }

    function saveUser(userData: AuthResponse) {
        saveSessionInfo(userData.body.user, userData.body.accessToken, userData.body.refreshToken);
    }
    function getUser(){
        return user;
    }

    return (
    <AuthContext.Provider 
    value={{ 
        isAuthenticated, getAccessToken, saveUser, getRefreshToken, getUser, signOut, 
        }}
        >
            { isLoading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
    );
}
//hook permite usar las funciones de use context autentificación

export const useAuth =() => useContext(AuthContext)