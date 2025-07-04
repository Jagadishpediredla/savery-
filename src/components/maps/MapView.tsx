'use client';

import * as React from 'react';
import { useEffect, useRef } from 'react';
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
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface MapViewProps {
    transactions: Transaction[];
    center?: [number, number]; // [lon, lat]
    zoom?: number;
    onViewChange?: () => void;
}

const MapViewComponent: React.FC<MapViewProps> = ({ transactions, center, zoom, onViewChange }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const popupRef = useRef<HTMLDivElement>(null);
    
    const mapInstance = useRef<Map | null>(null);
    const vectorSource = useRef(new VectorSource());
    const tileLayer = useRef(new TileLayer({ source: new OSM() }));
    const popupOverlay = useRef<Overlay | null>(null);
    const { theme } = useTheme();

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        popupOverlay.current = new Overlay({
            element: popupRef.current!,
            autoPan: { animation: { duration: 250 } }
        });
        
        const vectorLayer = new VectorLayer({ source: vectorSource.current });

        const map = new Map({
            target: mapRef.current,
            layers: [tileLayer.current, vectorLayer],
            view: new View({
                center: fromLonLat([78.9629, 20.5937]), // Default to India
                zoom: 5,
            }),
            overlays: [popupOverlay.current]
        });
        
        map.on('click', (event) => {
            popupOverlay.current?.setPosition(undefined);
            const feature = map.forEachFeatureAtPixel(event.pixel, (feature) => feature as Feature<Point>);
            if (feature) {
                const transaction = feature.get('transaction') as Transaction;
                const coordinate = feature.getGeometry()!.getCoordinates();
                
                if (popupRef.current) {
                    popupRef.current.innerHTML = `
                        <div class="p-3 rounded-xl shadow-lg bg-popover/80 backdrop-blur-lg border border-border/20 text-popover-foreground text-sm">
                            <p class="font-bold">${transaction.category}</p>
                            ${transaction.note ? `<p class="text-muted-foreground">${transaction.note}</p>` : ''}
                            <p class="font-semibold mt-1">₹${transaction.amount.toLocaleString()}</p>
                            <p class="text-xs text-muted-foreground/80">${new Date(transaction.date).toLocaleDateString()}</p>
                        </div>
                    `;
                    popupOverlay.current?.setPosition(coordinate);
                }
            }
        });

        // Inform parent about view changes from user interaction
        map.on('moveend', () => {
          onViewChange?.();
        });
        
        mapInstance.current = map;
        
        return () => {
            if (mapInstance.current) {
                mapInstance.current.setTarget(undefined);
                mapInstance.current = null;
            }
        };
    }, [onViewChange]);

    useEffect(() => {
        const transactionsWithLocation = transactions.filter(t => t.location);
        
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

        vectorSource.current.clear();
        vectorSource.current.addFeatures(markers);

    }, [transactions]);
    
    // This effect handles controlled view changes from parent
    useEffect(() => {
        const map = mapInstance.current;
        if (!map) return;
        
        if (center && zoom) {
             map.getView().animate({
                center: fromLonLat(center),
                zoom: zoom,
                duration: 1000,
            });
        } else if (transactions.length > 0 && transactions.some(t => t.location)) {
            const extent = vectorSource.current.getExtent();
            // Check if extent is valid (not Infinity)
            if (isFinite(extent[0])) { 
                map.getView().fit(extent, { padding: [50, 50, 50, 50], maxZoom: 15, duration: 500 });
            }
        } else {
            map.getView().animate({
                center: fromLonLat([78.9629, 20.5937]),
                zoom: 5,
                duration: 500
            });
        }
    }, [transactions, center, zoom]);

    // This effect handles the dark mode tiles
     useEffect(() => {
        if(mapRef.current) {
            mapRef.current.classList.toggle('dark-mode-tiles', theme === 'dark');
        }
    }, [theme]);
    
    return (
        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
            <div 
                ref={mapRef} 
                className="w-full h-full rounded-lg overflow-hidden"
            />
            <div ref={popupRef}></div>
        </div>
    );
};

const MapView = React.memo(MapViewComponent);
export default MapView;
