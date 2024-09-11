// src/app/not-found.js
export default function NotFound() {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold">404 - Sidan finns inte</h1>
          <p className="mt-4">Den här sidan kunde inte hittas.</p>
          <a href="/" className="mt-6 inline-block bg-gray-700  hover:bg-gray-800 text-white font-bold px-4 py-2 rounded">
            Gå tillbaka till startsidan
          </a>
        </div>
      </div>
    );
  }
  