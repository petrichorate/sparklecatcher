
import { motion } from 'framer-motion';

interface ScoreDisplayProps {
  score: number;
}

export const ScoreDisplay = ({ score }: ScoreDisplayProps) => {
  return (
    <motion.div
      className="fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-full
                 bg-white/10 backdrop-blur-md shadow-lg border border-white/20"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <span className="text-xl font-semibold">Score: {score}</span>
    </motion.div>
  );
};
