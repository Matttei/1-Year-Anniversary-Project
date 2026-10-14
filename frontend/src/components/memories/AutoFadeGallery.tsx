import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function AutoFadeGallery({ images, alt, interval = 2000 }: { images: string[]; alt: string; interval?: number }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const id = setInterval(() => setIndex((p) => (p + 1) % images.length), interval);
        return () => clearInterval(id);
    }, [images.length, interval]);

    return (
        <div className="auto-fade-gallery">
            <AnimatePresence mode="wait">
                <motion.img
                    key={index}
                    src={images[index]}
                    alt={`${alt} ${index + 1}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                />
            </AnimatePresence>
        </div>
    );
}