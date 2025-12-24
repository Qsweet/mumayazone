"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function MfaSetup() {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [secret, setSecret] = useState("");
    const [qrCode, setQrCode] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) return;

            const res = await fetch("/api/auth/me", {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setIsEnabled(data.isMfaEnabled);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSetup = async () => {
        setError("");
        setSuccess("");
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch("/api/auth/mfa/setup", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setSecret(data.secret);
                setQrCode(data.qrCodeUrl);
            } else {
                setError(data.message || "Setup failed");
            }
        } catch (err) {
            setError("Something went wrong");
        }
    };

    const handleEnable = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch("/api/auth/mfa/enable", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ secret, code })
            });

            if (res.ok) {
                setSuccess("MFA Enabled Successfully!");
                setIsEnabled(true);
                setSecret("");
                setQrCode("");
                setCode("");
            } else {
                const data = await res.json();
                setError(data.message || "Verification failed");
            }
        } catch (err) {
            setError("Something went wrong");
        }
    };

    const handleDisable = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch("/api/auth/mfa/disable", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ code })
            });

            if (res.ok) {
                setSuccess("MFA Disabled Successfully!");
                setIsEnabled(false);
                setCode("");
            } else {
                const data = await res.json();
                setError(data.message || "Disable failed");
            }
        } catch (err) {
            setError("Something went wrong");
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium leading-6 text-foreground">Multi-Factor Authentication</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Protect your account with an extra layer of security.
                    </p>
                </div>
                <div>
                    {isEnabled ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-0.5 text-sm font-medium text-green-800">
                            Enabled
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-gray-800">
                            Disabled
                        </span>
                    )}
                </div>
            </div>

            {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">{error}</div>}
            {success && <div className="p-3 text-sm text-green-500 bg-green-50 rounded-md">{success}</div>}

            {!isEnabled && !qrCode && (
                <button
                    onClick={handleSetup}
                    className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
                >
                    Setup MFA
                </button>
            )}

            {!isEnabled && qrCode && (
                <div className="mt-4 p-4 border rounded-md bg-card">
                    <h4 className="font-medium text-foreground mb-4">Scan this QR Code</h4>
                    <div className="flex justify-center mb-6">
                        <img src={qrCode} alt="MFA QR Code" width={200} height={200} />
                    </div>
                    <form onSubmit={handleEnable} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground">Verification Code</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="mt-1 block w-full rounded-md border-border bg-input py-2 px-3 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                placeholder="000000"
                                required
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="flex-1 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90"
                            >
                                Enable MFA
                            </button>
                            <button
                                type="button"
                                onClick={() => { setQrCode(""); setSecret(""); }}
                                className="flex-1 rounded-md bg-secondary px-3 py-2 text-sm font-semibold text-secondary-foreground shadow-sm hover:bg-secondary/80"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {isEnabled && (
                <div className="mt-4 p-4 border border-red-200 rounded-md bg-red-50/10">
                    <h4 className="font-medium text-foreground mb-4">Disable MFA</h4>
                    <p className="text-sm text-muted-foreground mb-4">Enter a code from your authentication app to confirm disabling MFA.</p>
                    <form onSubmit={handleDisable} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground">Verification Code</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="mt-1 block w-full rounded-md border-border bg-input py-2 px-3 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                placeholder="000000"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                        >
                            Disable MFA
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
