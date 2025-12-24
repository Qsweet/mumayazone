
"use client";

import { Button } from "@/components/ui/button";
import { Globe, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/navigation";
import { UserNav } from "@/components/layout/UserNav";

export function Header({ user }: { user?: any }) {
    const [scrolled, setScrolled] = useState(false);
    const locale = useLocale();
    const t = useTranslations('Navigation');
    const tCommon = useTranslations('Common');
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleLanguage = () => {
        const newLocale = locale === "en" ? "ar" : "en";
        router.replace(pathname, { locale: newLocale });
    };

    const handleLogout = () => {
        document.cookie = "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
        router.refresh();
        router.push("/login");
    };


    const navLinks = [
        { href: "/services", label: t('services') },
        { href: "/courses", label: t('courses') },
        { href: "/workshops", label: t('workshops') },
        { href: "/blog", label: t('blog') },
        { href: "/about", label: t('about') },
    ];


    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header
            dir="ltr"
            className={cn(
                "fixed top-0 left-0 right-0 z-50 flex h-20 items-center transition-all duration-300",
                scrolled
                    ? "bg-deep-black/80 backdrop-blur-md border-b border-white/10 shadow-sm shadow-purple-primary/5"
                    : "bg-transparent"
            )}
        >
            <div className="container mx-auto px-6 lg:px-12 flex justify-between items-center relative text-white">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-primary to-purple-secondary transition-transform group-hover:rotate-180 shadow-[0_0_15px_rgba(124,58,237,0.5)]" />
                    <span className="text-xl font-serif font-bold tracking-tight text-white group-hover:text-purple-secondary transition-colors">Qudah.</span>
                </Link>

                {/* Desktop Nav - Absolute Center (Preserved V3 Polish) */}
                <nav className="hidden md:flex items-center gap-8 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium transition-colors !text-white hover:!text-purple-secondary"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden md:flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={toggleLanguage} className="gap-2 !text-white hover:!text-purple-secondary hover:bg-white/5">
                        <Globe className="h-4 w-4" />
                        <span>{tCommon('language')}</span>
                    </Button>

                    {user ? (
                        <div className="ml-2">
                            <UserNav user={user} />
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium hover:!text-purple-secondary !text-white mr-2">
                                {tCommon('login')}
                            </Link>
                            <Link href="/register">
                                <Button className="rounded-full px-6 bg-purple-primary hover:bg-purple-primary/90 text-white border-0 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] transition-all">
                                    {tCommon('register')}
                                </Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Nav Toggle */}
                <div className="md:hidden">
                    <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle mobile menu">
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </Button>
                </div>

                {/* Mobile Nav Overlay */}
                {mobileMenuOpen && (
                    <div className="absolute top-20 left-0 right-0 border-b border-white/10 bg-deep-black/95 backdrop-blur-md p-6 shadow-xl animate-in slide-in-from-top-2 md:hidden">
                        <div className="flex flex-col gap-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="text-lg font-medium p-2 hover:bg-accent/10 rounded-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="h-px bg-border my-2" />
                            <div className="flex items-center justify-between">
                                <Button variant="ghost" onClick={toggleLanguage} className="justify-start gap-2 px-0">
                                    <Globe className="h-4 w-4" />
                                    {tCommon('language')}
                                </Button>
                            </div>

                            {user ? (
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 px-2 py-2 mb-2">
                                        <div className="h-10 w-10 rounded-full bg-purple-primary/20 flex items-center justify-center text-purple-primary font-bold">
                                            {user.name?.charAt(0) || 'U'}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{user.name}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </div>
                                    <Link href={user.role === 'admin' ? "/admin/dashboard" : "/dashboard"} className="w-full">
                                        <Button className="w-full">Dashboard</Button>
                                    </Link>
                                    <Button variant="destructive" onClick={handleLogout} className="w-full">
                                        Log out
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex gap-4">
                                    <Link href="/login" className="flex-1">
                                        <Button variant="outline" className="w-full">{tCommon('login')}</Button>
                                    </Link>
                                    <Link href="/register" className="flex-1">
                                        <Button className="w-full">{tCommon('register')}</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header >
    );
}
