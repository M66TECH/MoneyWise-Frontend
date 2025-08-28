import { User } from 'lucide-react';
import { getProfilePhotoUrl } from '../services/profileService';
import type { User as UserType } from '../types';

interface UserAvatarProps {
  user: UserType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserAvatar = ({ user, size = 'md', className = '' }: UserAvatarProps) => {
  const photoUrl = getProfilePhotoUrl(user.photo_profil || null);
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const baseClasses = `rounded-full flex items-center justify-center font-bold ${sizeClasses[size]} ${className}`;

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={`${user.prenom} ${user.nom}`}
        className={`${baseClasses} object-cover`}
      />
    );
  }

  return (
    <div className={`${baseClasses} bg-primary/20 text-primary`}>
      {user.prenom?.[0]}{user.nom?.[0] || <User size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} />}
    </div>
  );
};

export default UserAvatar;
