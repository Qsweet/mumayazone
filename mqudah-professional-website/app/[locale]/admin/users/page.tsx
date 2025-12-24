
import { getUsersPaginated } from "@/lib/db/access/users";
import { UsersTable } from "./_components/UsersTable";
import { getTranslations } from 'next-intl/server'; // If using intl

export default async function UsersPage({
    searchParams,
}: {
    searchParams: { page?: string; search?: string }
}) {
    // Await searchParams as required in Next.js 15+ (if using explicit async params)
    const params = await searchParams; // Wait for it just in case

    const page = Number(params?.page) || 1;
    const search = params?.search || '';

    const { data: users, metadata } = await getUsersPaginated(page, 10, search);

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                        Security Command Center
                    </h1>
                    <p className="text-gray-400 mt-1">
                        Manage users, roles, and system capabilities.
                    </p>
                </div>
                {/* Add User Button could go here */}
            </div>

            <UsersTable
                initialUsers={users}
                metadata={metadata}
            />
        </div>
    );
}
