import { Link } from "@/navigation";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Settings,
    FileText,
    PlusCircle,
    GraduationCap,
    BarChart
} from "lucide-react";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    // 1. Get User Role safely
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    let role = "STUDENT";

    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET || "MqudahAccessSecret2025!");
            const { payload } = await jwtVerify(token, secret);
            role = (payload.role as string)?.toUpperCase() || "STUDENT";
        } catch (e) {
            // Ignore token errors, middleware handles auth redirects
        }
    }

    // 2. Define Menu Items with Role Gates
    const menuItems = [
        {
            label: "Overview",
            href: "/dashboard",
            icon: LayoutDashboard,
            roles: ["STUDENT", "INSTRUCTOR", "ADMIN", "USER"]
        },
        {
            label: "My Learning",
            href: "/dashboard",
            icon: GraduationCap,
            roles: ["STUDENT", "USER"]
        },
        // Instructor Items
        {
            label: "My Courses",
            href: "/instructor/dashboard",
            icon: BookOpen,
            roles: ["INSTRUCTOR", "ADMIN"]
        },
        {
            label: "Create Course",
            href: "/admin/courses/new",
            icon: PlusCircle,
            roles: ["INSTRUCTOR", "ADMIN"]
        },
        // Admin Items
        {
            label: "Admin Overview",
            href: "/admin/dashboard",
            icon: BarChart,
            roles: ["ADMIN"]
        },
        {
            label: "All Users",
            href: "/admin/users",
            icon: Users,
            roles: ["ADMIN"]
        },
        {
            label: "All Courses",
            href: "/admin/courses",
            icon: BookOpen,
            roles: ["ADMIN"]
        },
        {
            label: "Blog Management",
            href: "/admin/blog",
            icon: FileText,
            roles: ["ADMIN"]
        },
        {
            label: "Settings",
            href: "/dashboard/settings",
            icon: Settings,
            roles: ["STUDENT", "INSTRUCTOR", "ADMIN", "USER"]
        },
    ];

    const filteredMenu = menuItems.filter(item => item.roles.includes(role));

    return (
        <div className="flex min-h-screen bg-black text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/10 hidden md:flex flex-col">
                <div className="p-6">
                    <h2 className="text-xl font-bold tracking-tight text-white/90">
                        Mqudah<span className="text-secondary">.</span>
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1 px-1 py-0.5 bg-white/5 rounded w-fit">
                        {role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()} Portal
                    </p>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    {filteredMenu.map((item) => (
                        <Link
                            key={item.href + item.label}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-white/10">
                    {/* User info or logout could go here */}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
