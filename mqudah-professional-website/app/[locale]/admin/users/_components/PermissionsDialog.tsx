'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { togglePermissionAction } from '@/lib/actions/user-management';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AVAILABLE_PERMISSIONS = [
    { key: '*', label: 'Super Admin (All Access)', description: 'Full control over the entire system.' },
    { key: 'can_manage_courses', label: 'Manage Courses', description: 'Create, edit, and delete courses.' },
    { key: 'can_manage_users', label: 'Manage Users', description: 'View and edit user details.' },
    { key: 'can_view_finance', label: 'View Finance', description: 'Access revenue and payment reports.' },
];

export function PermissionsDialog({ open, onOpenChange, user }: { open: boolean, onOpenChange: (open: boolean) => void, user: any }) {
    const [loadingKey, setLoadingKey] = useState<string | null>(null);

    // Parse permissions safely
    const userPerms = Array.isArray(user.permissions) ? user.permissions : [];

    const handleToggle = async (key: string, checked: boolean) => {
        setLoadingKey(key);
        try {
            const result = await togglePermissionAction(user.id, key, checked);
            if (result.success) {
                toast.success(`Permission ${checked ? 'granted' : 'revoked'}`);
            } else {
                toast.error(result.error || "Failed to update permission");
            }
        } catch (e) {
            toast.error("An error occurred");
        } finally {
            setLoadingKey(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-black/90 border-white/10 text-white sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Permissions</DialogTitle>
                    <DialogDescription>
                        Manage capabilities for <span className="text-white font-medium">{user.name}</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {AVAILABLE_PERMISSIONS.map((perm) => {
                        const isEnabled = userPerms.includes(perm.key);
                        return (
                            <div key={perm.key} className="flex items-center justify-between space-x-2">
                                <div className="space-y-0.5">
                                    <Label className="text-base text-gray-200">{perm.label}</Label>
                                    <p className="text-xs text-gray-500">
                                        {perm.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {loadingKey === perm.key && <Loader2 className="h-4 w-4 animate-spin text-gray-400" />}
                                    <Switch
                                        checked={isEnabled}
                                        onCheckedChange={(checked) => handleToggle(perm.key, checked)}
                                        disabled={loadingKey !== null}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </DialogContent>
        </Dialog>
    );
}
