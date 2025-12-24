
export interface DecodedToken {
    sub: string;
    email: string;
    role: 'admin' | 'instructor' | 'user';
    exp: number;
}

export function decodeToken(token: string): DecodedToken | null {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
}

export function hasRole(token: string, requiredRole: string): boolean {
    const decoded = decodeToken(token);
    return decoded?.role === requiredRole;
}
