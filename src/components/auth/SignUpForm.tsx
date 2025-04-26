
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { Label } from '@/components/ui/label';
import { formatPhoneNumber } from '@/lib/phoneFormatter';
import { useNavigate } from 'react-router-dom';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  whatsapp: string;
}

const SignUpForm = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting }, setValue, watch } = useForm<SignUpFormData>();

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signUp(data.email, data.password, data.name, data.whatsapp);
      navigate('/quiz');
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue('whatsapp', formatted);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo*</Label>
        <Input
          id="name"
          {...register('name', { required: true })}
          placeholder="Seu nome"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email*</Label>
        <Input
          id="email"
          type="email"
          {...register('email', { required: true })}
          placeholder="seu@email.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha*</Label>
        <Input
          id="password"
          type="password"
          {...register('password', { required: true, minLength: 6 })}
          placeholder="••••••••"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsapp">WhatsApp*</Label>
        <Input
          id="whatsapp"
          {...register('whatsapp', { required: true })}
          placeholder="(00) 00000-0000"
          onChange={handleWhatsAppChange}
          value={watch('whatsapp')}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Cadastrando...' : 'Criar Conta'}
      </Button>
    </form>
  );
};

export default SignUpForm;
