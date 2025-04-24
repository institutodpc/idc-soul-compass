
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface QuizCardProps {
  children: React.ReactNode;
  className?: string;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
}

const QuizCard: React.FC<QuizCardProps> = ({
  children,
  className,
  headerContent,
  footerContent,
}) => {
  return (
    <Card className={cn("w-full max-w-lg shadow-lg rounded-xl border-0", className)}>
      {headerContent && <CardHeader>{headerContent}</CardHeader>}
      <CardContent className="p-6">{children}</CardContent>
      {footerContent && <CardFooter className="px-6 pb-6 pt-0">{footerContent}</CardFooter>}
    </Card>
  );
};

export default QuizCard;
