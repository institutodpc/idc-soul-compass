
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

const WhatsAppInvite: React.FC = () => {
  return (
    <Card className="mt-6 border-2 border-green-100 bg-gradient-to-r from-green-50 to-white">
      <CardHeader>
        <h3 className="text-xl font-semibold flex items-center gap-2 justify-center">
          <MessageCircle className="text-green-600" />
          Entre em nosso grupo do WhatsApp!
        </h3>
      </CardHeader>
      <CardContent className="text-center">
        <p className="mb-4">Junte-se ao nosso grupo para receber dicas e conteúdos exclusivos sobre seu perfil.</p>
        <Button 
          className="bg-green-600 hover:bg-green-700 py-6 px-6 text-base font-medium"
          onClick={() => window.open("https://whatsapp.com/channel/0029VbAfmlsDp2Q5WBtB4A3t", "_blank")}
        >
          <MessageCircle className="mr-2 h-5 w-5" />
          Entrar no Grupo do WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
};

export default WhatsAppInvite;
