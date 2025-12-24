'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { User } from '@/lib/db/schema'; // Ensure this type is exported or defined
import { UserActionsMenu } from './UserActionsMenu';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Shield, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type Metadata = {
    total: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
};

export function UsersTable({ initialUsers, metadata }: { initialUsers: any[], metadata: Metadata }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('search', term);
        } else {
            params.delete('search');
        }
        params.set('page', '1'); // Reset to page 1
        router.push(`${pathname}?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                    placeholder="Search users by name or email..."
                    className="pl-10 bg-black/20 border-white/10"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            {/* Data Grid */}
            <div className="border border-white/10 rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm">
                <table className="w-full text-left text-sm">
                    <thead className="bg-white/5 text-gray-400 uppercase text-xs font-medium">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Created</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {initialUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-medium text-white">{user.name}</div>
                                    <div className="text-gray-500 text-xs">{user.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className={user.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : ''}>
                                        {user.role}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    {user.isVerified ? (
                                        <div className="flex items-center text-green-400 text-xs">
                                            <Shield className="w-3 h-3 mr-1" /> Verified
                                        </div>
                                    ) : (
                                        <span className="text-yellow-500 text-xs">Pending</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-500">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <UserActionsMenu user={user} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-sm text-gray-400">
                <div>
                    Showing {((metadata.currentPage - 1) * 10) + 1} to {Math.min(metadata.currentPage * 10, metadata.total)} of {metadata.total} users
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!metadata.hasPrevPage}
                        onClick={() => handlePageChange(metadata.currentPage - 1)}
                    >
                        <ChevronLeft className="w-4 h-4" /> Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!metadata.hasNextPage}
                        onClick={() => handlePageChange(metadata.currentPage + 1)}
                    >
                        Next <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
