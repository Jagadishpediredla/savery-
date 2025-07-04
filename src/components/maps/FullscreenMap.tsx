
'use client';

import { useFirebase } from "@/context/FirebaseContext";
import MapView from "./MapView";

export function FullscreenMap() {
    const { transactions, setIsMapFullscreen } = useFirebase();
    
    return (
        <div className="fixed inset-0 z-[200] bg-background">
             <MapView 
                transactions={transactions}
                isFullscreen={true}
                onToggleFullscreen={() => setIsMapFullscreen(false)}
             />
        </div>
    )
}
