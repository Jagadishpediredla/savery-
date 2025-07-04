
'use client';

import { useFirebase } from '@/context/FirebaseContext';
import { FullscreenMap } from './FullscreenMap';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';

export function FullscreenMapContainer() {
    const { isMapFullscreen } = useFirebase();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || !isMapFullscreen) {
        return null;
    }
    
    return createPortal(<FullscreenMap />, document.body);
}
