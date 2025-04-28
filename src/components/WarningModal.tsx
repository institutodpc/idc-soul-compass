
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface WarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white/90 backdrop-blur-lg border border-blue-100 shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-blue-800">Atenção</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            <span className="font-semibold">📢 Você tem direito a realizar apenas <span className="text-pink-600">uma análise gratuita</span>.</span> Responda com atenção!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction 
            onClick={onClose}
            className="bg-gradient-to-r from-persona-orange to-persona-pink hover:opacity-90 transition-opacity text-white font-medium"
          >
            Ok, Entendi
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WarningModal;
