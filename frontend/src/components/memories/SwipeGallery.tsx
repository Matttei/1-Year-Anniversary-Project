import { useRef, useState } from 'react';

export default function SwipeGallery({ images, alt }: { images: string[]; alt: string }) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState(0);

    const handleScroll = () => {
        const el = trackRef.current;
        if (!el) return;
        setActive(Math.round(el.scrollLeft / el.clientWidth));
    };

    return (
        <div className="swipe-gallery" data-no-tab-swipe>
            <div className="swipe-track" ref={trackRef} onScroll={handleScroll}>
                {images.map((src, i) => (
                    <div className="swipe-slide" key={i}>
                        <img src={src} alt={`${alt} ${i + 1}`} loading="lazy" />
                    </div>
                ))}
            </div>
            <div className="swipe-dots">
                {images.map((_, i) => (
                    <span key={i} className={`swipe-dot ${i === active ? 'active' : ''}`} />
                ))}
            </div>
        </div>
    );
}