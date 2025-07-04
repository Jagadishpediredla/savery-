
'use client';

import { PageWrapper } from "@/components/PageWrapper";
import { ChatInterface } from "@/components/visualizer/ChatInterface";

export default function VisualizerPage() {
    return (
        <PageWrapper>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Visualizer AI</h1>
                    <p className="text-muted-foreground">
                        Your personal financial assistant. Ask anything about your finances.
                    </p>
                </header>
                <ChatInterface />
            </div>
        </PageWrapper>
    );
}
