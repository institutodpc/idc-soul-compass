
import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GradientButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const GradientButton: React.FC<GradientButtonProps> = ({ 
  children, 
  className,
  ...props 
}) => {
  return (
    <Button 
      className={cn(
        "bg-persona-gradient hover:opacity-90 transition-opacity text-white font-medium",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default GradientButton;
