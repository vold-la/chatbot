import { AuthForm } from '../components/AuthForm';

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <AuthForm />
      </div>
    </div>
  );
}
