export interface Category {
  id: number;
  utilisateur_id: number;
  nom: string;
  couleur: string;
  type: 'revenu' | 'depense' | 'hybride';
  date_creation: string;
  date_modification: string;
}

export interface NewCategory {
  nom: string;
  couleur: string;
  type: 'revenu' | 'depense' | 'hybride';
}

// Types d'authentification alignés avec l'API
export interface PhotoProfilData {
  url: string;
  public_id?: string;
  type?: 'local' | 'cloudinary';
}

export interface User {
  id: number;
  email: string;
  prenom: string;
  nom: string;
  theme: 'light' | 'dark';
  date_creation: string;
  date_modification: string;
  email_verifie: boolean;
  photo_profil?: string | null;
}

export interface UploadPhotoResponse {
  success: boolean;
  message: string;
  photo_profil: PhotoProfilData;
  photo_url: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  utilisateur: User;
  token: string;
}

export interface RegisterResponse {
  message: string;
  utilisateur: User;
}

export interface EmailVerificationData {
  token: string;
}

export interface ResendVerificationData {
  email: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
}

export interface UpdateThemeData {
  theme: 'light' | 'dark';
}

export interface LoginErrorResponse {
  message: string;
  emailNonVerifie?: boolean;
}

export interface ApiError {
  message: string;
}

// Types pour l'export
export type ExportFormat = 'pdf' | 'csv';
export type ExportPeriod = 'all' | 'current_month' | 'last_month' | 'current_year' | 'custom';

export interface ExportConfig {
  format: ExportFormat;
  period: ExportPeriod;
  startDate?: string;
  endDate?: string;
  includeCategories?: boolean;
  includeCharts?: boolean;
}

// Types pour les transactions
export interface Transaction {
  id: number;
  montant: number;
  description?: string;
  type: 'revenu' | 'depense';
  date_creation: string;
  date_transaction: string;
  utilisateur_id: number;
  categorie_id: number;
}

export interface CreateTransactionData {
  montant: number;
  description?: string;
  type: 'revenu' | 'depense';
  utilisateur_id: number;
  categorie_id: number;
}

export interface UpdateTransactionData {
  montant?: number;
  description?: string;
  type?: 'revenu' | 'depense';
  categorie_id?: number;
}