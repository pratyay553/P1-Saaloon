import { LoginForm } from '@/features/user/components/LoginForm';

export default function SigninPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=3474&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
      <div className="absolute inset-0 bg-slate-50/90 backdrop-blur-sm" />
      <div className="z-10 w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
