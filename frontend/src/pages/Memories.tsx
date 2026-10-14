import { motion } from 'framer-motion';
import ScrollReveal from '../components/memories/ScrollReveal';
import SwipeGallery from '../components/memories/SwipeGallery';
import StackedGallery from '../components/memories/StackedGallery';
import AutoFadeGallery from '../components/memories/AutoFadeGallery';
import RandomGallery from '../components/memories/RandomGallery';
import './Memories.css';

type Effect = 'intro' | 'swipe' | 'drop' | 'stack' | 'auto' | 'random' | 'finale';

interface Chapter {
    id: number;
    number: string;
    title: string;
    subtitle?: string;
    images: string[];
    effect: Effect;
}

const chapters: Chapter[] = [
    { id: 1, number: '01', title: 'Ziua noastră & primul sărut', subtitle: '11.09.2025', images: ['https://pub-366bbf55ee1a4c379ccdaf018fa482ed.r2.dev/1.jpeg'], effect: 'intro' },
    { id: 2, number: '02', title: 'Nu pot uita...', subtitle: '❤️', images: ['https://pub-366bbf55ee1a4c379ccdaf018fa482ed.r2.dev/2.jpeg', 'https://pub-366bbf55ee1a4c379ccdaf018fa482ed.r2.dev/3.jpeg', 'https://pub-366bbf55ee1a4c379ccdaf018fa482ed.r2.dev/4.jpeg'], effect: 'swipe' },
    { id: 3, number: '03', title: 'Prima noastră conversație', images: ['https://pub-366bbf55ee1a4c379ccdaf018fa482ed.r2.dev/5.jpeg'], effect: 'drop' },
    { id: 4, number: '04', title: 'Mereu ai grijă de mat', images: ['https://pub-366bbf55ee1a4c379ccdaf018fa482ed.r2.dev/6.jpeg', 'https://pub-366bbf55ee1a4c379ccdaf018fa482ed.r2.dev/7.jpeg', 'https://pub-366bbf55ee1a4c379ccdaf018fa482ed.r2.dev/8.jpeg'], effect: 'stack' },
    { id: 5, number: '05', title: 'Cei mai smecheri suntem', subtitle: '(mai mult eu)', images: ['https://pub-366bbf55ee1a4c379ccdaf018fa482ed.r2.dev/9.jpeg', 'https://pub-366bbf55ee1a4c379ccdaf018fa482ed.r2.dev/10.jpeg', 'https://pub-366bbf55ee1a4c379ccdaf018fa482ed.r2.dev/11.jpeg', 'https://pub-366bbf55ee1a4c379ccdaf018fa482ed.r2.dev/12.jpeg', 'https://pub-366bbf55ee1a4c379ccdaf018fa482ed.r2.dev/13.jpeg'], effect: 'stack' },
    { id: 6, number: '06', title: 'Frumoasa mea', subtitle: '🥺', images: ['https://pub-366bbf55ee1a4c379ccdaf018fa482ed.r2.dev/14.jpeg', 'https://pub-366bbf55ee1a4c379ccdaf018fa482ed.r2.dev/15.jpeg', 'https://pub-366bbf55ee1a4c379ccdaf018fa482ed.r2.dev/16.jpeg'], effect: 'auto' },
    { id: 7, number: '07', title: 'Amintiri random', images: Array.from({ length: 67 }, (_, i) => `https://pub-366bbf55ee1a4c379ccdaf018fa482ed.r2.dev/${i + 18}.jpeg`), effect: 'random' },
    { id: 8, number: '08', title: 'Te iubesc cel mai mult', subtitle: '♾️', images: ['https://pub-366bbf55ee1a4c379ccdaf018fa482ed.r2.dev/17.jpeg'], effect: 'finale' },
];
export const memoryImages = chapters.flatMap((c) => c.images);
export default function Memories() {
    return (
        <div className="memories-page">
            {chapters.map((chapter) => (
                <section className="memory-chapter" key={chapter.id}>
                    <ScrollReveal>
                        <span className="memory-number">{chapter.number}</span>
                        <h2 className="memory-title">{chapter.title}</h2>
                        {chapter.subtitle && <span className="memory-subtitle">{chapter.subtitle}</span>}
                    </ScrollReveal>

                    <ScrollReveal delay={0.15}>
                        {chapter.effect === 'intro' && (
                            <motion.div
                                className="memory-single-photo"
                                initial={{ opacity: 0, scale: 0.85 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            >
                                <img src={chapter.images[0]} alt={chapter.title} />
                            </motion.div>
                        )}
                        {chapter.effect === 'drop' && (
                            <motion.div
                                className="memory-drop-photo"
                                initial={{ opacity: 0, y: -60, rotate: -6 }}
                                whileInView={{ opacity: 1, y: 0, rotate: -3 }}
                                viewport={{ once: true, amount: 0.4 }}
                                transition={{ type: 'spring', stiffness: 180, damping: 12 }}
                            >
                                <img src={chapter.images[0]} alt={chapter.title} />
                            </motion.div>
                        )}
                        {chapter.effect === 'swipe' && <SwipeGallery images={chapter.images} alt={chapter.title} />}
                        {chapter.effect === 'stack' && <StackedGallery images={chapter.images} alt={chapter.title} />}
                        {chapter.effect === 'auto' && <AutoFadeGallery images={chapter.images} alt={chapter.title} interval={2000} />}
                        {chapter.effect === 'random' && <RandomGallery images={chapter.images} alt={chapter.title} max={67} />}
                        {chapter.effect === 'finale' && (
                            <div className="memory-finale">
                                <motion.img
                                    src={chapter.images[0]}
                                    alt={chapter.title}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true, amount: 0.4 }}
                                    transition={{ duration: 1 }}
                                />
                                <motion.span
                                    className="memory-infinity"
                                    animate={{ scale: [1, 1.15, 1] }}
                                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                        
                                </motion.span>
                            </div>
                        )}
                    </ScrollReveal>
                </section>
            ))}
        </div>
    );
}