
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import SignUpForm from '@/components/auth/SignUpForm';
import Logo from '@/components/Logo';

const Auth = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 bg-gradient-to-br from-white to-blue-50">
      <Logo className="mb-8" />
      
      <Card className="w-full max-w-md p-6">
        <Tabs defaultValue="signup" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="signup" className="text-base">Cadastrar</TabsTrigger>
            <TabsTrigger value="login" className="text-base">Entrar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signup">
            <SignUpForm />
          </TabsContent>
          
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
        </Tabs>
      </Card>

      <p className="mt-6 text-sm text-gray-600 text-center max-w-md">
        Cadastre-se para descobrir seu perfil espiritual e receber conteúdos exclusivos.
      </p>
    </div>
  );
};

export default Auth;
