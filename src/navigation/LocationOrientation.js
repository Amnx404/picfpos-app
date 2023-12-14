import React, { useState, useEffect } from 'react';

const LocationAndOrientation = ({ onAlphaChange }) => {
    const [alpha, setAlpha] = useState(null);

    useEffect(() => {
        const handleOrientation = (event) => {
            const { alpha: alphaValue } = event;
            setAlpha(alphaValue);
            onAlphaChange(alphaValue);
        };

        window.addEventListener('deviceorientation', handleOrientation, true);
        return () => window.removeEventListener('deviceorientation', handleOrientation, true);
    }, [onAlphaChange]);

    return (
        <div>
            {alpha !== null ? (
                <p>Alpha (Orientation): {alpha.toFixed(2)} degrees</p>
            ) : (
                <p>Device orientation not supported or permission denied.</p>
            )}
        </div>
    );
};

export default LocationAndOrientation;
