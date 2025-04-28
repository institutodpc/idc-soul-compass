
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';
import GradientButton from '@/components/GradientButton';
import WarningModal from '@/components/WarningModal';

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Check if the user has seen the warning
    const hasSeenWarning = localStorage.getItem('hasSeenWarning');
    if (!hasSeenWarning) {
      setShowModal(true);
    }
  }, []);

  const handleStartClick = () => {
    if (user) {
      navigate('/quiz');
    } else {
      navigate('/auth');
    }
  };

  const handleModalClose = () => {
    // Mark that the user has seen the warning
    localStorage.setItem('hasSeenWarning', 'true');
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-white to-blue-50">
      <WarningModal isOpen={showModal} onClose={handleModalClose} />
      
      <div className="max-w-md w-full text-center space-y-8">
        <Logo className="mx-auto" />
        
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">Descubra seu perfil espiritual</h1>
          <p className="text-lg text-gray-700">
            Responda 33 perguntas para entender melhor seus dons e talentos espirituais.
          </p>
        </div>
        
        <GradientButton onClick={handleStartClick} className="w-full">
          {user ? 'Começar Quiz' : 'Cadastre-se para Começar'}
        </GradientButton>
        
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          Ao participar, você receberá insights personalizados sobre seu perfil espiritual e dicas práticas para seu crescimento.
        </p>
      </div>
    </div>
  );
};

export default Index;
