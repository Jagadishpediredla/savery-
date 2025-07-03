import { PageWrapper } from "@/components/PageWrapper";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default function SettingsPage() {
    return (
        <PageWrapper>
            <div className="space-y-8">
                 <header>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">
                        Customize your financial plan and preferences.
                    </p>
                </header>
                <SettingsForm />
            </div>
        </PageWrapper>
    );
}
