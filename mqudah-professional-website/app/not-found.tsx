
"use client";

import Link from 'next/link';

export default function NotFound() {
    return (
        <html lang="en">
            <body>
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                    <p className="mb-6">The page you are looking for does not exist.</p>
                    <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded">
                        Return Home
                    </Link>
                </div>
            </body>
        </html>
    );
}
