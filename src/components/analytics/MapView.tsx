'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Transaction } from '@/lib/types';
import { useMemo } from 'react';

// Fix for default icon issue with webpack which can occur in some setups
const defaultIcon = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapViewProps {
    transactions: Transaction[];
}

export function MapView({ transactions }: MapViewProps) {
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
                        icon={defaultIcon}
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
