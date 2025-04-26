
import React from 'react';
import { Card } from '@/components/ui/card';
import SignUpForm from '@/components/auth/SignUpForm';
import Logo from '@/components/Logo';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';

const Auth = () => {
  const { user } = useAuth();
  
  // Redirect to quiz if already logged in
  if (user) {
    return <Navigate to="/quiz" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 bg-gradient-to-br from-white to-blue-50">
      <Logo className="mb-8" />
      
      <Card className="w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Cadastre-se</h2>
        <SignUpForm />
      </Card>

      <p className="mt-6 text-sm text-gray-600 text-center max-w-md">
        Cadastre-se para descobrir seu perfil espiritual e receber conteúdos exclusivos.
      </p>
    </div>
  );
};

export default Auth;
