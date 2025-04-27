
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Profile } from "@/types/quiz";
import { motion } from "framer-motion";

interface ResultCardProps {
  profile: Profile;
  isPrimary?: boolean;
  onReset?: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ profile, isPrimary = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`w-full max-w-lg shadow-lg border-0 transition-all duration-300 hover:shadow-xl
        ${isPrimary ? "bg-gradient-to-r from-persona-orange/10 to-persona-pink/10" : ""}`}>
        <CardHeader className="text-center p-8">
          <motion.h3 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`text-3xl font-bold ${isPrimary ? "text-transparent bg-clip-text bg-persona-gradient" : ""}`}
          >
            {isPrimary ? `Seu perfil principal é: ${profile.name}` : profile.name}
          </motion.h3>
        </CardHeader>
        
        <CardContent className="space-y-8 p-8">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl italic text-center text-gray-700"
          >
            {profile.description}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="space-y-6 pt-4"
          >
            <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-2xl">📖</span>
              <div>
                <p className="font-semibold text-lg mb-2">Versículo</p>
                <p className="text-gray-700">{profile.verse}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold text-lg mb-2">Dica Prática</p>
                <p className="text-gray-700">{profile.tip}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-semibold text-lg mb-2">Prática Espiritual</p>
                <p className="text-gray-700">{profile.practice}</p>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResultCard;
