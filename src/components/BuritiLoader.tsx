import { motion } from "framer-motion";

export const BuritiLoader = ({ text = "Carregando..." }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative flex items-center justify-center">
        <motion.div
          className="absolute h-12 w-12 rounded-full border-2 border-primary/30"
          animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
        />
        <motion.div
          className="absolute h-12 w-12 rounded-full border-2 border-primary/30"
          animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
        />
        <motion.div
          className="h-8 w-8 rounded-full gradient-brand"
          animate={{ scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <motion.p
        className="text-sm font-medium text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {text}
      </motion.p>
    </div>
  );
};
