import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import EmailVerificationPage from '../pages/EmailVerificationPage';
import DashboardPage from '../pages/DashboardPage';
import TransactionsPage from '../pages/TransactionsPage';
import ReportsPage from '../pages/ReportsPage';
import AddTransactionPage from '../pages/AddTransactionPage';
import ProfilePage from '../pages/ProfilePage';
import CategoriesPage from '../pages/CategoriesPage';
import ExportPage from '../pages/ExportPage';
import ProtectedRoute from './ProtectedRoute'; // Importer le composant

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        {/* Routes Publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<EmailVerificationPage />} />

        {/* Routes Privées */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/export" element={<ExportPage />} />
          <Route path="/add-transaction" element={<AddTransactionPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;