import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function shuffle<T>(arr: T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export default function RandomGallery({ images, alt, max = 67 }: { images: string[]; alt: string; max?: number }) {
    const [queue, setQueue] = useState<string[]>([]);
    const [index, setIndex] = useState(0);
    const [selected, setSelected] = useState<string | null>(null);

    const started = queue.length > 0;
    const current = queue[index];
    const isLast = index === queue.length - 1;

    const start = () => {
        setQueue(shuffle(images).slice(0, max));
        setIndex(0);
    };

    const next = () => {
        if (isLast) {
            setQueue(shuffle(images).slice(0, max));
            setIndex(0);
        } else {
            setIndex((i) => i + 1);
        }
    };

    return (
        <div className="random-gallery">
            {!started && (
                <button className="random-btn" onClick={start}>
                    Arată-mi amintirile
                </button>
            )}

            {started && (
                <>
                    <div className="random-single">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={current}
                                src={current}
                                alt={`${alt} ${index + 1}`}
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.92 }}
                                transition={{ duration: 0.4 }}
                                onClick={() => setSelected(current)}
                            />
                        </AnimatePresence>
                    </div>

                    <div className="random-controls">
                        <span className="random-counter">{index + 1} / {queue.length}</span>
                        <button className="random-btn" onClick={next}>
                            {isLast ? 'Amestecă din nou' : 'Următoarea'}
                        </button>
                    </div>
                </>
            )}

            <AnimatePresence>
                {selected && (
                    <motion.div
                        className="random-modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelected(null)}
                    >
                        <motion.img
                            key={selected}
                            src={selected}
                            alt={alt}
                            className="random-modal-image"
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.85 }}
                            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}