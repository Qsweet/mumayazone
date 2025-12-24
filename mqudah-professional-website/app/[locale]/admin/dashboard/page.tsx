import { getAdminDashboardStats, getRecentActivity } from "@/lib/data/admin";
import { Users, BookOpen, FileText, Activity, Calendar, DollarSign, TrendingUp, ArrowUpRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
    // Real-time data fetching
    const { userCount, courseCount, workshopCount, revenue } = await getAdminDashboardStats();
    const recentEnrollments = await getRecentActivity();


    const stats = [
        {
            title: "Total Revenue",
            value: `$${(revenue / 100).toLocaleString()}`,
            icon: DollarSign,
            trend: "+12.5%",
            color: "from-green-500/20 to-emerald-500/20",
            iconColor: "text-green-500"
        },
        {
            title: "Active Students",
            value: userCount,
            icon: Users,
            trend: "+5.2%",
            color: "from-blue-500/20 to-indigo-500/20",
            iconColor: "text-blue-500"
        },
        {
            title: "Live Workshops",
            value: workshopCount,
            icon: Calendar,
            trend: "Upcoming",
            color: "from-purple-500/20 to-violet-500/20",
            iconColor: "text-purple-500"
        },
        {
            title: "Published Courses",
            value: courseCount,
            icon: BookOpen,
            trend: "Active",
            color: "from-orange-500/20 to-amber-500/20",
            iconColor: "text-orange-500"
        },
    ];

    return (
        <div className="p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold font-serif text-white">Dashboard Overview</h1>
                    <p className="text-muted-foreground mt-1">Welcome back, Mohammad.</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/admin/workshops/new">
                        <Button className="rounded-full shadow-lg shadow-primary/20 bg-gradient-to-r from-primary to-accent hover:opacity-90">
                            + New Workshop
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.title} className={`relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br ${stat.color} p-6 transition-transform hover:-translate-y-1`}>
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-2 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 ${stat.iconColor}`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                            <span className="flex items-center text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full border border-green-500/20">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {stat.trend}
                            </span>
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid gap-8 lg:grid-cols-3">

                {/* Recent Activity / Content */}
                <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold">Platform Activity</h3>
                        <Link href="/admin/users">
                            <Button variant="ghost" size="sm" className="text-muted-foreground">View All</Button>
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentEnrollments.length > 0 ? (
                            recentEnrollments.map((activity) => (
                                <div key={activity.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                                        <Activity className="w-5 h-5 text-accent" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium text-white">
                                            New student {activity.user.name} registered for "{activity.course.title}"
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {formatDistanceToNow(new Date(activity.enrolledAt || new Date()), { addSuffix: true })}
                                        </div>
                                    </div>
                                    <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                                </div>
                            ))
                        ) : (
                            <div className="p-4 text-center text-muted-foreground text-sm">No recent activity</div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm p-6">
                        <h3 className="text-lg font-bold mb-4">Quick Management</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="/admin/courses" className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-accent/10 hover:border-accent/20 transition-all text-center group">
                                <BookOpen className="w-6 h-6 mb-2 text-primary group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium">Courses</span>
                            </Link>
                            <Link href="/admin/workshops" className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-accent/10 hover:border-accent/20 transition-all text-center group">
                                <Calendar className="w-6 h-6 mb-2 text-accent group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium">Workshops</span>
                            </Link>
                            <Link href="/admin/users" className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-accent/10 hover:border-accent/20 transition-all text-center group">
                                <Users className="w-6 h-6 mb-2 text-green-500 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium">Users</span>
                            </Link>
                            <Link href="/admin/blog" className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-accent/10 hover:border-accent/20 transition-all text-center group">
                                <FileText className="w-6 h-6 mb-2 text-orange-500 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-medium">Blog</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
