
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { Label } from '@/components/ui/label';
import { formatPhoneNumber } from '@/lib/phoneFormatter';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SignUpFormData {
  name: string;
  email: string;
  whatsapp: string;
}

const SignUpForm = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<SignUpFormData>();

  const onSubmit = async (data: SignUpFormData) => {
    setIsSubmitting(true);
    
    try {
      // First check if email is already registered in our users table
      const { data: existingUsers, error: queryError } = await supabase
        .from('users')
        .select('email')
        .eq('email', data.email.toLowerCase().trim())
        .maybeSingle();

      if (queryError) {
        console.error('Error checking existing email:', queryError);
        throw new Error('Erro ao verificar email existente');
      }

      // If user exists in either table, show error
      if (existingUsers) {
        toast.error('🚫 Este e-mail já foi cadastrado. Utilize outro para prosseguir.');
        setIsSubmitting(false);
        return;
      }

      // Use a random password since we don't collect it in the form
      const randomPassword = Math.random().toString(36).slice(-10);
      
      // Proceed with signup
      await signUp(data.email, randomPassword, data.name, data.whatsapp);
      navigate('/quiz');
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.message?.includes('already registered')) {
        toast.error('🚫 Este e-mail já foi cadastrado. Utilize outro para prosseguir.');
      } else {
        toast.error(error.message || 'Erro ao realizar cadastro');
      }
    } finally {
      setIsSubmitting(false);
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
          {...register('name', { required: 'Nome é obrigatório' })}
          placeholder="Seu nome"
          className="bg-white/70 backdrop-blur-sm"
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email*</Label>
        <Input
          id="email"
          type="email"
          {...register('email', { 
            required: 'Email é obrigatório',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email inválido'
            }
          })}
          placeholder="seu@email.com"
          className="bg-white/70 backdrop-blur-sm"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsapp">WhatsApp*</Label>
        <Input
          id="whatsapp"
          {...register('whatsapp', { required: 'WhatsApp é obrigatório' })}
          placeholder="(00) 00000-0000"
          onChange={handleWhatsAppChange}
          value={watch('whatsapp')}
          className="bg-white/70 backdrop-blur-sm"
        />
        {errors.whatsapp && <p className="text-xs text-red-500">{errors.whatsapp.message}</p>}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-persona-orange to-persona-pink hover:opacity-90 transition-opacity" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Cadastrando...' : 'Começar Quiz'}
      </Button>
    </form>
  );
};

export default SignUpForm;
