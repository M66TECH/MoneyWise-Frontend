import { useState, useEffect } from 'react';
import { Mail, AlertCircle, CheckCircle } from 'lucide-react';

interface EmailValidatorProps {
  email: string;
  onValidationChange: (isValid: boolean) => void;
  className?: string;
}

const EmailValidator = ({ email, onValidationChange, className = '' }: EmailValidatorProps) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  // Regex pour valider l'email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (email.trim() === '') {
      setIsValid(null);
      onValidationChange(true); // Permettre la soumission si vide (required gère ça)
      return;
    }

    const valid = emailRegex.test(email);
    setIsValid(valid);
    onValidationChange(valid);
  }, [email, onValidationChange]);



  if (email.trim() === '') {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 mt-1 text-sm ${className}`}>
             {isValid === null ? (
         <div className="flex items-center gap-1 text-text-secondary">
           <Mail size={14} />
           <span>Veuillez saisir votre adresse email</span>
         </div>
       ) : isValid ? (
         <div className="flex items-center gap-1 text-green-600">
           <CheckCircle size={14} />
           <span>Format d'email correct</span>
         </div>
       ) : (
         <div className="flex items-center gap-1 text-red-600">
           <AlertCircle size={14} />
           <span>Format d'email incorrect</span>
         </div>
       )}
    </div>
  );
};

export default EmailValidator;
