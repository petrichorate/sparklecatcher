
import { motion } from 'framer-motion';

interface WinScreenProps {
  onRestart: () => void;
  winScreenImage: string;
}

export const WinScreen = ({ onRestart, winScreenImage }: WinScreenProps) => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20
                   flex flex-col items-center gap-6 max-w-md mx-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <img 
          src={winScreenImage} 
          alt="You won!"
          className="w-64 h-64 object-contain rounded-lg"
        />
        <h2 className="text-2xl font-bold text-white">Congratulations!</h2>
        <p className="text-white/90 text-center">
          You've caught all the raindrops! Want to play again?
        </p>
        <button
          onClick={onRestart}
          className="px-6 py-3 bg-white/20 hover:bg-white/30 transition-colors
                     rounded-full text-white font-semibold shadow-lg"
        >
          Play Again
        </button>
      </motion.div>
    </motion.div>
  );
};
