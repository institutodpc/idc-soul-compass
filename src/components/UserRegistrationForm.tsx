
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GradientButton from "@/components/GradientButton";
import { User } from "@/types/quiz";
import { toast } from "@/components/ui/sonner";

interface UserRegistrationFormProps {
  onSubmit: (userData: User) => void;
}

const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({ onSubmit }) => {
  const [userData, setUserData] = useState<User>({
    name: "",
    email: "",
    whatsapp: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!userData.name || !userData.email) {
      toast.error("Por favor, preencha seu nome e email.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      toast.error("Por favor, insira um email válido.");
      return;
    }

    onSubmit(userData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          value={userData.name}
          onChange={handleChange}
          placeholder="Seu nome"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={userData.email}
          onChange={handleChange}
          placeholder="seu@email.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
        <Input
          id="whatsapp"
          name="whatsapp"
          value={userData.whatsapp}
          onChange={handleChange}
          placeholder="(00) 00000-0000"
        />
      </div>

      <div className="pt-4">
        <GradientButton type="submit" className="w-full">
          Ver Meu Resultado
        </GradientButton>
      </div>
    </form>
  );
};

export default UserRegistrationForm;
