import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="font-heading text-6xl md:text-8xl text-maroon font-bold mb-4">404</h1>
      <h2 className="font-heading text-2xl md:text-3xl text-ink font-semibold mb-6">
        Page Not Found
      </h2>
      <p className="font-body text-ink/70 max-w-md mb-8">
        We couldn&apos;t find the page you were looking for. It might have been moved or doesn&apos;t exist.
      </p>
      <Link 
        href="/"
        className="inline-flex items-center justify-center bg-gold text-white font-medium px-6 py-3 rounded-full hover:scale-105 transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon focus-visible:ring-offset-2"
      >
        <Home className="w-5 h-5 mr-2" />
        Back to Home
      </Link>
    </div>
  );
}
