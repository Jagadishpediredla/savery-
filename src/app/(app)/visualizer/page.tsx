import { PageWrapper } from "@/components/PageWrapper";
import { Visualizer } from "@/components/visualizer/Visualizer";

export default function VisualizerPage() {
    return (
        <PageWrapper>
             <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">Visualizer AI</h1>
                    <p className="text-muted-foreground">
                        Your personal finance assistant. Ask anything about your data.
                    </p>
                </header>
                <div className="h-[65vh]">
                    <Visualizer />
                </div>
            </div>
        </PageWrapper>
    );
}
