import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  onStrengthChange: (isStrong: boolean) => void;
  className?: string;
}

interface PasswordCriteria {
  label: string;
  test: (password: string) => boolean;
  met: boolean;
}

const PasswordStrengthIndicator = ({ 
  password, 
  onStrengthChange, 
  className = '' 
}: PasswordStrengthIndicatorProps) => {
  const [criteria, setCriteria] = useState<PasswordCriteria[]>([
    { label: 'Au moins 8 caractères', test: (pwd) => pwd.length >= 8, met: false },
    { label: 'Au moins une lettre minuscule', test: (pwd) => /[a-z]/.test(pwd), met: false },
    { label: 'Au moins une lettre majuscule', test: (pwd) => /[A-Z]/.test(pwd), met: false },
    { label: 'Au moins un chiffre', test: (pwd) => /\d/.test(pwd), met: false },
    { label: 'Au moins un caractère spécial', test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd), met: false },
  ]);

  useEffect(() => {
    const updatedCriteria = criteria.map(criterion => ({
      ...criterion,
      met: criterion.test(password)
    }));
    
    setCriteria(updatedCriteria);
    
    const metCriteria = updatedCriteria.filter(c => c.met).length;
    const isStrong = metCriteria >= 4; // Au moins 4 critères sur 5
    onStrengthChange(isStrong);
  }, [password, onStrengthChange]);

  const getStrengthLevel = () => {
    const metCount = criteria.filter(c => c.met).length;
    if (metCount <= 1) return { level: 'très faible', color: 'bg-red-500', width: '20%' };
    if (metCount === 2) return { level: 'faible', color: 'bg-orange-500', width: '40%' };
    if (metCount === 3) return { level: 'moyen', color: 'bg-yellow-500', width: '60%' };
    if (metCount === 4) return { level: 'fort', color: 'bg-blue-500', width: '80%' };
    return { level: 'très fort', color: 'bg-green-500', width: '100%' };
  };

  const strength = getStrengthLevel();

  if (password.trim() === '') {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Barre de force */}
      <div className="space-y-2">
                 <div className="flex items-center justify-between text-sm">
           <span className="text-text-secondary">Niveau de sécurité :</span>
          <span className={`font-medium ${
            strength.level === 'très faible' || strength.level === 'faible' ? 'text-red-600' :
            strength.level === 'moyen' ? 'text-yellow-600' :
            strength.level === 'fort' ? 'text-blue-600' : 'text-green-600'
          }`}>
            {strength.level}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
            style={{ width: strength.width }}
          ></div>
        </div>
      </div>

             {/* Critères */}
       <div className="space-y-2">
         <h4 className="text-sm font-medium text-text-primary">Critères de sécurité :</h4>
        <div className="space-y-1">
          {criteria.map((criterion, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              {criterion.met ? (
                <CheckCircle size={14} className="text-green-600 flex-shrink-0" />
              ) : (
                <XCircle size={14} className="text-red-600 flex-shrink-0" />
              )}
              <span className={criterion.met ? 'text-green-600' : 'text-red-600'}>
                {criterion.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
