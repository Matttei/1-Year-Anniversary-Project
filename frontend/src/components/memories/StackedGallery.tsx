import { useState } from 'react';
import { motion } from 'framer-motion';

export default function StackedGallery({ images, alt }: { images: string[]; alt: string }) {
    const [order, setOrder] = useState(images);
    const cycle = () => setOrder((prev) => [...prev.slice(1), prev[0]]);

    return (
        <div className="stack-gallery" data-no-tab-swipe>
            {order.map((src, i) => {
                if (i > 2) return null;
                const isTop = i === 0;
                return (
                    <motion.div
                        key={src}
                        className="stack-card"
                        style={{ zIndex: 10 - i }}
                        animate={{ scale: 1 - i * 0.05, y: i * 14, rotate: isTop ? 0 : i % 2 === 0 ? -5 : 5 }}
                        drag={isTop ? 'x' : false}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.6}
                        onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 90) cycle(); }}
                        whileDrag={{ rotate: 10 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    >
                        <img src={src} alt={alt} draggable={false} />
                    </motion.div>
                );
            })}
            <p className="stack-hint">trage poza ↔</p>
        </div>
    );
}