
import { AppShell } from '@/components/AppShell';
import { FirebaseProvider } from '@/context/FirebaseContext';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <FirebaseProvider>
      <AppShell>{children}</AppShell>
    </FirebaseProvider>
  );
}
