import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, Users } from "lucide-react";
import { Link } from "@/navigation";

export default function InstructorDashboard() {
    return (
        <div className="container py-8 space-y-8">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Instructor Dashboard</h1>
                    <p className="text-muted-foreground">
                        Manage your courses, students, and content.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/courses/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Course
                    </Link>
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            +0 from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">
                            +0 from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Courses</CardTitle>
                        <CardDescription>
                            You haven't created any courses yet.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="outline" asChild className="w-full h-24 border-dashed">
                            <Link href="/admin/courses/new" className="flex flex-col items-center justify-center gap-2">
                                <PlusCircle className="h-6 w-6" />
                                <span>Create your first course</span>
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
