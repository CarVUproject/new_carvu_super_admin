'use client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const NotFound = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 px-4 text-gray-800">
      <div className="mb-8 w-64 h-64 relative animate-[bounce_3 s_infinite]">
        <Image
          src="/assets/images/404-illustration.png"
          alt="Page not found"
          fill
          className="object-contain"
        />
      </div>

      <h1 className="text-7xl font-extrabold text-red-500 mb-4 animate-pulse">404</h1>
      <h2 className="text-3xl font-semibold mb-2">Oops! Page not found</h2>
      <p className="text-center max-w-md mb-6 text-gray-600">
        The page you are looking for might have been removed, had its name changed, or is
        temporarily unavailable.
      </p>

      <button
        onClick={() => router.push('/dashboard/role-management')}
        className="px-8 py-3 bg-[#088F01] text-white font-medium rounded-lg shadow-lg hover:bg-[#066f01] hover:scale-105 transition-all cursor-pointer"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NotFound;
