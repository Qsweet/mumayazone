import MfaSetup from "./MfaSetup";

export default function SettingsPage() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto p-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground font-serif">Settings</h2>
                <p className="text-muted-foreground">Manage your account settings and security preferences.</p>
            </div>

            <div className="border-t border-border pt-6">
                <MfaSetup />
            </div>
        </div>
    );
}
