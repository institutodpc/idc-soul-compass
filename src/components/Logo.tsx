
import React from "react";

interface LogoProps {
  className?: string;
  size?: "small" | "medium" | "large";
}

const Logo: React.FC<LogoProps> = ({ className = "", size = "medium" }) => {
  const sizeClasses = {
    small: "h-8",
    medium: "h-16",
    large: "h-24",
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <img 
        src="/lovable-uploads/e85aeb94-7dce-43c6-9d59-5950e7ef228e.png" 
        alt="IDC Persona.io Logo" 
        className="h-full w-auto"
      />
    </div>
  );
};

export default Logo;
