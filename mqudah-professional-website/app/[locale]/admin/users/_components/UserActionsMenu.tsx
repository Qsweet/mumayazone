'use client';

import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Ghost, ShieldAlert, Ban, Edit, History } from 'lucide-react';
import { impersonateUserAction, getUserAuditLogsAction } from '@/lib/actions/user-management';
import { toast } from 'sonner';

// Placeholder for permissions dialog
import { PermissionsDialog } from './PermissionsDialog';
import { AuditTimeline } from './AuditTimeline';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

export function UserActionsMenu({ user }: { user: any }) {
    const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);

    const handleViewHistory = async () => {
        setIsHistoryOpen(true);
        // Fetch logs
        const result = await getUserAuditLogsAction(user.id);
        if (result.success) {
            setAuditLogs(result.data || []);
        } else {
            toast.error("Failed to load history");
        }
    };

    const handleImpersonate = async () => {
        setIsLoading(true);
        try {
            const result = await impersonateUserAction(user.id);
            if (result.success && result.redirectUrl) {
                toast.success(`Entering Ghost Mode as ${user.name}...`);
                window.location.href = result.redirectUrl; // Hard navigation to reset state
            } else {
                toast.error(result.error || "Failed to impersonate");
            }
        } catch (e) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px] bg-black/90 border-white/10 text-white">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => setIsPermissionsOpen(true)}
                        className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
                    >
                        <Edit className="mr-2 h-4 w-4" /> Edit Permissions
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={handleViewHistory}
                        className="cursor-pointer hover:bg-white/10 focus:bg-white/10"
                    >
                        <History className="mr-2 h-4 w-4" /> View History
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={handleImpersonate}
                        disabled={isLoading}
                        className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-purple-400 focus:text-purple-400"
                    >
                        <Ghost className="mr-2 h-4 w-4" />
                        {isLoading ? 'Connecting...' : 'Impersonate'}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-white/10" />

                    <DropdownMenuItem className="cursor-pointer hover:bg-red-900/50 focus:bg-red-900/50 text-red-500 focus:text-red-500">
                        <Ban className="mr-2 h-4 w-4" /> Ban User
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <PermissionsDialog
                open={isPermissionsOpen}
                onOpenChange={setIsPermissionsOpen}
                user={user}
            />

            <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <SheetContent className="bg-black/95 border-l border-white/10 text-white w-[400px] sm:w-[540px]">
                    <SheetHeader className="mb-6">
                        <SheetTitle>Audit History</SheetTitle>
                        <SheetDescription>
                            Recent activity for <span className="text-white font-medium">{user.name}</span>.
                        </SheetDescription>
                    </SheetHeader>
                    <AuditTimeline logs={auditLogs} />
                </SheetContent>
            </Sheet>
        </>
    );
}
