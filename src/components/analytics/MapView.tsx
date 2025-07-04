
'use client';

import * as React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Transaction } from '@/lib/types';
import { useMemo } from 'react';
import { Skeleton } from '../ui/skeleton';


// Fix for default icon issue with webpack
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl.src,
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src,
});

interface MapViewProps {
    transactions: Transaction[];
}

export default function MapView({ transactions }: MapViewProps) {
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const transactionsWithLocation = useMemo(() => transactions.filter(t => t.location), [transactions]);

    const defaultCenter: [number, number] = [28.6139, 77.2090];
    const center = transactionsWithLocation.length > 0
        ? [transactionsWithLocation[0].location!.latitude, transactionsWithLocation[0].location!.longitude] as [number, number]
        : defaultCenter;

    if (!isClient) {
        return <Skeleton className="h-[400px] w-full rounded-lg" />;
    }

    return (
        <MapContainer center={center} zoom={10} scrollWheelZoom={true} style={{ height: '400px', width: '100%', borderRadius: 'var(--radius)' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {transactionsWithLocation.map((transaction) => (
                transaction.location && (
                    <Marker
                        key={transaction.id}
                        position={[transaction.location.latitude, transaction.location.longitude]}
                    >
                        <Popup>
                            <div>
                                <p className="font-bold">{transaction.category}</p>
                                <p>{transaction.note}</p>
                                <p className="font-semibold">₹{transaction.amount.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
                                {transaction.location.label && <p className="text-xs italic">{transaction.location.label}</p>}
                            </div>
                        </Popup>
                    </Marker>
                )
            ))}
        </MapContainer>
    );
};
