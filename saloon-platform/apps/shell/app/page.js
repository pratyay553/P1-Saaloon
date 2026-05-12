import { redirect } from 'next/navigation';

export default function Home() {
  // In a real SaaS, the root might be a marketing landing page.
  // For our application structure, we redirect the root to the authenticated dashboard.
  // Middleware handles ensuring they are logged in.
  redirect('/dashboard');
}
