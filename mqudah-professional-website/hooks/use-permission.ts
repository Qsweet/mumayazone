"use client";

import { useEffect, useState } from 'react';
import { decodeToken, DecodedToken } from '@/lib/auth';

type Action = 'manage' | 'read' | 'create' | 'update' | 'delete';
type Subject = 'all' | 'Course' | 'User' | 'Workshop' | 'BlogPost' | 'Sales';

export function usePermission() {
    const [user, setUser] = useState<DecodedToken | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            setUser(decodeToken(token));
        }
    }, []);

    const can = (action: Action, subject: Subject): boolean => {
        if (!user) return false;

        if (user.role === 'admin') return true;

        if (user.role === 'instructor') {
            if (subject === 'Course' || subject === 'Workshop' || subject === 'BlogPost') {
                return true; // Expand logic if they can only edit *own* courses
            }
        }

        return false;
    };

    const is = (role: string) => user?.role === role;

    return { user, can, is };
}
