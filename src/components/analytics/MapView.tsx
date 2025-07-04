
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Transaction } from '@/lib/types';
import { useMemo, memo } from 'react';

// Fix for default icon issue with webpack which can occur in some setups
// These imports are needed to correctly point to the image assets
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Deleting and re-merging the default icon options is the standard
// way to fix broken icon paths in React with Leaflet.
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetinaUrl.src,
  iconUrl: iconUrl.src,
  shadowUrl: shadowUrl.src,
});

interface MapViewProps {
    transactions: Transaction[];
}

function MapViewComponent({ transactions }: MapViewProps) {
    const transactionsWithLocation = useMemo(() => transactions.filter(t => t.location), [transactions]);

    // Set a default center if no transactions have location, e.g., New Delhi
    const defaultCenter: [number, number] = [28.6139, 77.2090];
    const center = transactionsWithLocation.length > 0
        ? [transactionsWithLocation[0].location!.latitude, transactionsWithLocation[0].location!.longitude] as [number, number]
        : defaultCenter;

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

export default memo(MapViewComponent);
