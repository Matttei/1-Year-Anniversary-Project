import { motion } from 'framer-motion';

const HEART_PATH =
    "M50 88C50 88 10 62 10 34C10 18 22 8 36 8C44 8 50 14 50 14C50 14 56 8 64 8C78 8 90 18 90 34C90 62 50 88 50 88Z";

export default function HeartLoader({ size = 64 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className="heart-loader"
        >
            <motion.path
                d={HEART_PATH}
                fill="none"
                stroke="var(--accent)"
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 1 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1, ease: 'easeInOut' }}
            />
            <motion.path
                d={HEART_PATH}
                fill="var(--accent)"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: [0, 1, 1], scale: [0.85, 1.08, 1] }}
                transition={{
                    duration: 1.6,
                    times: [0, 0.7, 1],
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'reverse',
                    repeatDelay: 0.3,
                }}
                style={{ transformOrigin: '50% 50%' }}
            />
        </svg>
    );
}