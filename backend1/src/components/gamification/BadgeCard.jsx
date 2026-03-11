import { motion } from "framer-motion";

const BadgeCard = ({ badge, earned = false, progress = 0 }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`relative p-4 rounded-xl ${
        earned
          ? "bg-gradient-to-br from-yellow-400 to-yellow-600 text-white"
          : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
      }`}
    >
      <div className="text-4xl mb-2">{badge.icon}</div>
      <h3 className="font-bold text-sm">{badge.name}</h3>
      <p className="text-xs mt-1 opacity-80">{badge.description}</p>

      {!earned && progress > 0 && (
        <div className="mt-3">
          <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-blue-500 h-1.5 rounded-full"
            />
          </div>
        </div>
      )}

      {earned && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1"
        >
          <svg
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BadgeCard;
