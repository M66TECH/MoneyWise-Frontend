import AppRouter from './router/AppRouter';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './contexts/AuthContext';
import AuthLoader from './components/AuthLoader';

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoader />;
  }

  return (
    <>
      <AppRouter />
      <Toaster position="bottom-right" reverseOrder={false} />
    </>
  )
}

export default App
