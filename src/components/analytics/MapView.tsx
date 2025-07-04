'use client';

import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Overlay from 'ol/Overlay';
import type { Transaction } from '@/lib/types';

interface MapViewProps {
    transactions: Transaction[];
}

const MapView: React.FC<MapViewProps> = ({ transactions }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) {
            return;
        }

        const transactionsWithLocation = transactions.filter(t => t.location);
        
        const defaultCenter: [number, number] = [77.2090, 28.6139]; // Default to Delhi, India
        const center = transactionsWithLocation.length > 0
            ? [transactionsWithLocation[0].location!.longitude, transactionsWithLocation[0].location!.latitude]
            : defaultCenter;

        const markers = transactionsWithLocation.map(t => {
            const marker = new Feature({
                geometry: new Point(fromLonLat([t.location!.longitude, t.location!.latitude])),
                transaction: t,
            });
            marker.setStyle(new Style({
                image: new Icon({
                    src: 'https://openlayers.org/en/latest/examples/data/icon.png',
                    anchor: [0.5, 1],
                    scale: 0.8
                })
            }));
            return marker;
        });

        const vectorSource = new VectorSource({ features: markers });
        const vectorLayer = new VectorLayer({ source: vectorSource });

        const popupOverlay = new Overlay({
            element: popupRef.current!,
            autoPan: {
                animation: {
                    duration: 250
                }
            }
        });

        const map = new Map({
            target: mapRef.current,
            layers: [
                new TileLayer({ source: new OSM() }),
                vectorLayer
            ],
            view: new View({
                center: fromLonLat(center),
                zoom: 10
            }),
            overlays: [popupOverlay]
        });

        map.on('click', (event) => {
            const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature as Feature<Point>);
            if (feature) {
                const transaction = feature.get('transaction') as Transaction;
                const coordinate = feature.getGeometry()!.getCoordinates();
                
                if (popupRef.current) {
                    popupRef.current.innerHTML = `
                        <div class="p-2 rounded-md shadow-lg bg-popover text-popover-foreground text-sm">
                            <p class="font-bold">${transaction.category}</p>
                            <p>${transaction.note}</p>
                            <p class="font-semibold">₹${transaction.amount.toLocaleString()}</p>
                            <p class="text-xs text-muted-foreground">${new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                    `;
                    popupOverlay.setPosition(coordinate);
                }
            } else {
                 popupOverlay.setPosition(undefined);
            }
        });

        mapInstance.current = map;
        
        return () => {
            map.setTarget(undefined);
        };

    }, [transactions]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
            <div ref={mapRef} style={{ width: '100%', height: '100%', borderRadius: 'var(--radius)', overflow: 'hidden' }} />
            <div ref={popupRef}></div>
        </div>
    );
};

export default MapView;
