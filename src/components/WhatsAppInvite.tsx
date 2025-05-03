
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

const WhatsAppInvite: React.FC = () => {
  return (
    <Card className="border-0 shadow-lg overflow-hidden relative bg-gradient-to-r from-green-50 to-green-100">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-green-200/40 to-transparent rounded-br-full" />
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-green-300/30 to-transparent rounded-tl-full" />
      
      <CardHeader>
        <h3 className="text-xl font-semibold flex items-center gap-2 justify-center relative z-10">
          <div className="p-2 rounded-full bg-green-600/10">
            <MessageCircle className="text-green-600" />
          </div>
          <span>Entre em nosso grupo do WhatsApp!</span>
        </h3>
      </CardHeader>
      <CardContent className="text-center relative z-10">
        <p className="mb-6 text-gray-700">Junte-se ao nosso grupo para receber dicas e conteúdos exclusivos sobre seu perfil.</p>
        <Button 
          className="bg-green-600 hover:bg-green-700 py-6 px-8 text-base font-medium shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
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
