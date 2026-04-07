import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-playfair text-7xl font-semibold text-ocean mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page not found</p>
        <Link to="/" className="px-6 py-3 bg-sunset text-white rounded-xl font-semibold">
          Go Home
        </Link>
      </div>
    </div>
  );
}
