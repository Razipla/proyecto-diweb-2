//messages específicos para las solicitudes htpp
export interface AuthResponse {
    body: {
        user: User;
        accessToken: string;
        refreshToken: string;
    };
}
export interface AuthResponseError {
    body: {   
        error: string;
    };
}

export interface User {
    id: string;
    name: string;
    username: string;
}

export interface AccessTokenResponse {
    statusCode: number;
    body: {
        accessToken: string;
    };
    error?: string;
}