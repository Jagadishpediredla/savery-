
'use client';

import { AppShell } from '@/components/AppShell';
import { FirebaseProvider, useFirebase } from '@/context/FirebaseContext';
import { FullscreenMap } from '@/components/maps/FullscreenMap';

function AppLayoutContent({ children }: { children: React.ReactNode }) {
    const { isMapFullscreen } = useFirebase();

    return (
        <>
            {isMapFullscreen && <FullscreenMap />}
            {/* The AppShell is always in the DOM but hidden, to preserve page state */}
            <div className={isMapFullscreen ? 'hidden' : 'contents'}>
              <AppShell>{children}</AppShell>
            </div>
        </>
    );
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseProvider>
        <AppLayoutContent>{children}</AppLayoutContent>
    </FirebaseProvider>
  );
}
