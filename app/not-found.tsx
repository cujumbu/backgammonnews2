import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">Page Not Found</h2>
      <p className="mb-6 text-gray-600">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link 
        href="/" 
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Return Home
      </Link>
    </div>
  );
}
