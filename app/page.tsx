import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">BackgammonNews</h1>
      <Link 
        href="/admin" 
        className="text-blue-600 hover:underline"
      >
        Go to Admin
      </Link>
    </div>
  );
}
