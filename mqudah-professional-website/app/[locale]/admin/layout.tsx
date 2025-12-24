import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    LogOut,
    Calendar,
    BarChart3,
    FileText
} from "lucide-react";
import { Link } from "@/navigation";
import { redirect } from "next/navigation";

import { cookies } from "next/headers";

// Mock auth check - in real app use session
// const isAdmin = true;

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");

    if (!token) {
        redirect("/en/login");
    }

    // RBAC Check
    const { decodeToken } = await import("@/lib/auth");
    const user = decodeToken(token.value);

    // If invalid token or NOT Admin, kick them out
    if (!user || user.role !== 'admin') {
        redirect("/en/login");
    }

    const navigation = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Courses", href: "/admin/courses", icon: BookOpen },
        { name: "Workshops", href: "/admin/workshops", icon: Calendar },
        { name: "Blog Posts", href: "/admin/blog", icon: FileText },
        { name: "Students & Users", href: "/admin/users", icon: Users },
        { name: "Sales & Revenue", href: "/admin/sales", icon: BarChart3 },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground flex">
            {/* Sidebar */}
            <aside className="w-64 fixed inset-y-0 left-0 z-50 bg-background/80 backdrop-blur-xl border-r border-white/10 flex flex-col">
                <div className="h-20 flex items-center px-8 border-b border-white/10">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-accent group-hover:rotate-180 transition-transform" />
                        <span className="text-lg font-serif font-bold text-white">Qudah Admin</span>
                    </Link>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                                "hover:bg-accent/10 hover:text-accent text-muted-foreground"
                            )}
                        >
                            <item.icon className="w-5 h-5 transition-colors group-hover:text-accent" />
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-400/10">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
                {children}
            </main>
        </div>
    );
}
