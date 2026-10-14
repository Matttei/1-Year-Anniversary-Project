import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export default function ScrollReveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
    return (
        <motion.div
            style={{ width: '100%' }}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}