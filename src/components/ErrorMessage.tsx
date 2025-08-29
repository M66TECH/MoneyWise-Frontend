import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  onClose?: () => void;
  className?: string;
}

const ErrorMessage = ({ 
  message, 
  type = 'error', 
  onClose, 
  className = '' 
}: ErrorMessageProps) => {
  const getStyles = () => {
    switch (type) {
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
          icon: 'text-yellow-600',
          closeButton: 'text-yellow-600 hover:bg-yellow-100'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-200 text-blue-800',
          icon: 'text-blue-600',
          closeButton: 'text-blue-600 hover:bg-blue-100'
        };
      default: // error
        return {
          container: 'bg-red-50 border-red-200 text-red-800',
          icon: 'text-red-600',
          closeButton: 'text-red-600 hover:bg-red-100'
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`flex items-start gap-3 p-4 border rounded-lg ${styles.container} ${className}`}>
      <AlertCircle size={20} className={`flex-shrink-0 mt-0.5 ${styles.icon}`} />
      <div className="flex-1">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`p-1 rounded-md transition-colors ${styles.closeButton}`}
          aria-label="Fermer le message"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
