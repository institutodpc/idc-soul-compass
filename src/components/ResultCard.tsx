
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
      className="w-full max-w-3xl mx-auto"
    >
      <Card className={`w-full shadow-xl border-0 backdrop-blur-md 
        ${isPrimary 
          ? "bg-gradient-to-r from-persona-orange/10 via-persona-pink/5 to-persona-pink/10 hover:shadow-persona-pink/20" 
          : "bg-white/30 hover:shadow-lg"} 
        transition-all duration-300`}>
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
            <div className="flex items-start space-x-4 p-6 rounded-xl backdrop-blur-sm bg-white/20 hover:bg-white/30 transition-colors">
              <span className="text-2xl">📖</span>
              <div>
                <p className="font-semibold text-lg mb-2">Versículo</p>
                <p className="text-gray-700">{profile.verse}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6 rounded-xl backdrop-blur-sm bg-white/20 hover:bg-white/30 transition-colors">
              <span className="text-2xl">✅</span>
              <div>
                <p className="font-semibold text-lg mb-2">Dica Prática</p>
                <p className="text-gray-700">{profile.tip}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 p-6 rounded-xl backdrop-blur-sm bg-white/20 hover:bg-white/30 transition-colors">
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
