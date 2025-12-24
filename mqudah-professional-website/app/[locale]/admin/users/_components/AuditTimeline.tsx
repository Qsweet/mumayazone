'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
    Shield,
    User,
    key,
    LogIn,
    LogOut,
    Ghost,
    Activity,
    AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

const ActionIcons: Record<string, any> = {
    'LOGIN': LogIn,
    'LOGOUT': LogOut,
    'IMPERSONATE': Ghost,
    'UPDATE_USER_PERMISSIONS': Shield,
    'FAILURE': AlertTriangle,
    'default': Activity
};

const ActionColors: Record<string, string> = {
    'LOGIN': 'text-green-400',
    'LOGOUT': 'text-gray-400',
    'IMPERSONATE': 'text-purple-400',
    'UPDATE_USER_PERMISSIONS': 'text-blue-400',
    'FAILURE': 'text-red-500',
};

export function AuditTimeline({ logs }: { logs: any[] }) {
    if (!logs || logs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-gray-500">
                <Activity className="h-8 w-8 mb-2 opacity-50" />
                <p>No activity recorded yet.</p>
            </div>
        );
    }

    return (
        <ScrollArea className="h-[400px] w-full pr-4">
            <div className="relative border-l border-white/10 ml-3 space-y-6 text-sm">
                {logs.map((log) => {
                    const Icon = ActionIcons[log.action] || ActionIcons.default;
                    const colorClass = ActionColors[log.action] || 'text-gray-300';
                    const isFailure = log.status === 'FAILURE';

                    return (
                        <div key={log.id} className="relative pl-6 group">
                            {/* Dot/Icon */}
                            <div className={`absolute -left-3 top-0 h-6 w-6 rounded-full bg-black border border-white/10 flex items-center justify-center ${colorClass} group-hover:scale-110 transition-transform`}>
                                <Icon className="h-3 w-3" />
                            </div>

                            {/* Content */}
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className={`font-medium ${colorClass}`}>
                                        {log.action.replace(/_/g, ' ')}
                                    </span>
                                    {isFailure && (
                                        <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">Failed</Badge>
                                    )}
                                    <span className="text-gray-500 text-xs ml-auto">
                                        {format(new Date(log.createdAt), 'MMM d, HH:mm')}
                                    </span>
                                </div>

                                <p className="text-gray-400 text-xs">
                                    {log.details?.diff ? (
                                        <span>
                                            Changed <span className="text-white">{Object.keys(log.details.diff).join(', ')}</span>
                                        </span>
                                    ) : (
                                        <span>
                                            User ID: {log.userId?.slice(0, 8)}...
                                        </span>
                                    )}
                                </p>

                                {/* Technical Details (Collapsible Concept - Simple for MVP) */}
                                {log.details && (
                                    <div className="mt-1 p-2 bg-white/5 rounded text-[10px] font-mono text-gray-400 overflow-hidden hidden group-hover:block">
                                        {JSON.stringify(log.details, null, 2)}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </ScrollArea>
    );
}
