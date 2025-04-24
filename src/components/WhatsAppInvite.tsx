
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const WhatsAppInvite: React.FC = () => {
  return (
    <Card className="mt-6 text-center">
      <CardHeader>
        <h3 className="text-xl font-semibold">Entre em nosso grupo do WhatsApp!</h3>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Junte-se ao nosso grupo para receber dicas e conteúdos exclusivos.</p>
        <Button 
          className="bg-green-600 hover:bg-green-700"
          onClick={() => window.open("https://whatsapp.com/channel/0029VbAfmlsDp2Q5WBtB4A3t", "_blank")}
        >
          Entrar no Grupo do WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
};

export default WhatsAppInvite;
