import { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

export function Globe3D({ markers, config, onMarkerClick, onMarkerHover }) {
  const globeEl = useRef();

  useEffect(() => {
    // Auto-rotate setup
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = config?.autoRotateSpeed || 0.5;
      globeEl.current.controls().enableZoom = false;
      globeEl.current.pointOfView({ altitude: 2 }, 1000);
    }
  }, [config]);

  // Handle marker render
  const renderMarker = (d) => {
    const el = document.createElement('div');
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.borderRadius = '50%';
    el.style.backgroundImage = `url(${d.src})`;
    el.style.backgroundSize = 'cover';
    el.style.cursor = 'pointer';
    el.style.boxShadow = '0px 0px 10px rgba(0,0,0,0.5)';
    el.style.border = '2px solid white';
    
    if (onMarkerClick) el.onclick = () => onMarkerClick(d);
    if (onMarkerHover) {
      el.onmouseenter = () => onMarkerHover(d);
      el.onmouseleave = () => onMarkerHover(null);
    }
    
    return el;
  };

  return (
    <Globe
      ref={globeEl}
      width={typeof window !== 'undefined' ? window.innerWidth : 1200}
      height={typeof window !== 'undefined' ? window.innerHeight : 800}
      backgroundColor="rgba(0,0,0,0)"
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      atmosphereColor={config?.atmosphereColor || "#4da6ff"}
      atmosphereAltitude={0.15 * (config?.atmosphereIntensity ? config.atmosphereIntensity / 20 : 1)}
      htmlElementsData={markers}
      htmlElement={renderMarker}
    />
  );
}
