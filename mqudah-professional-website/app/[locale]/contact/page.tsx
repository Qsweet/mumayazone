"use client";

import { useTranslations, useLocale } from "next-intl";
import { Mail, MapPin, Phone, Send } from "lucide-react";

import { useState } from "react";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
    const t = useTranslations();
    const tContact = useTranslations('contact');
    const locale = useLocale();
    const dir = locale === 'ar' ? 'rtl' : 'ltr';

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            toast.success(dir === "rtl" ? "تم استلام رسالتك بنجاح! سنتواصل معك قريباً." : "Message received! We will contact you soon.");
            setFormData({ name: "", email: "", subject: "", message: "" });
            setIsSubmitting(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background text-foreground" dir={dir}>
            <Header />
            <section className="relative py-32 overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 space-y-4">
                        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-accent to-primary">
                            {tContact('title')}
                        </h1>
                        <p className="text-xl text-muted-foreground">
                            {tContact('description')}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Contact Info */}
                        <div className="space-y-8">
                            <div className="bg-card border border-border p-8 rounded-2xl hover:border-accent/30 transition-all">
                                <h3 className="text-2xl font-bold mb-6">{tContact('info_title')}</h3>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-muted/20 rounded-xl">
                                            <Phone className="w-6 h-6 text-accent" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">{tContact('phone')}</p>
                                            <p className="text-lg font-mono" dir="ltr">+962 7 9999 9999</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-muted/20 rounded-xl">
                                            <Mail className="w-6 h-6 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">{tContact('email')}</p>
                                            <p className="text-lg font-mono">support@mumayazone.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-muted/20 rounded-xl">
                                            <MapPin className="w-6 h-6 text-accent" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">{tContact('address')}</p>
                                            <p className="text-lg">{tContact('address_value')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-card border border-border p-8 rounded-2xl text-center">
                                <p className="text-muted-foreground mb-2">{tContact('working_hours')}</p>
                                <p className="text-xl font-bold">{tContact('working_hours_value')}</p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-card border border-border p-8 rounded-2xl shadow-xl relative overflow-hidden">
                            <h3 className="text-2xl font-bold mb-8">{tContact('form_title')}</h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm text-muted-foreground">{tContact('name')}</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                                            placeholder={tContact('name_ph')}
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-muted-foreground">{tContact('email')}</label>
                                        <input
                                            type="email"
                                            required
                                            className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                                            placeholder="name@example.com"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">{tContact('subject')}</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                                        placeholder={tContact('subject_ph')}
                                        value={formData.subject}
                                        onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-muted-foreground">{tContact('message')}</label>
                                    <textarea
                                        required
                                        rows={5}
                                        className="w-full bg-background border border-border rounded-xl px-4 py-3 focus:outline-none focus:border-accent transition-colors resize-none"
                                        placeholder={tContact('message_ph')}
                                        value={formData.message}
                                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-6 text-lg"
                                >
                                    {isSubmitting ? tContact('sending') : (
                                        <span className="flex items-center gap-2">
                                            {tContact('submit')}
                                            <Send className="w-5 h-5" />
                                        </span>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

