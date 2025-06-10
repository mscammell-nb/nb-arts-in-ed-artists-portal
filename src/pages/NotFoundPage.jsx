import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-6">
      <div className="w-full max-w-lg text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-extrabold text-tertiary">404</h1>
          <div className="mx-auto my-6 h-1 w-24 bg-indigo-500"></div>
          <h2 className="mb-2 text-3xl font-bold text-tertiary">
            Page Not Found
          </h2>
          <p className="mb-8 text-tertiary">
            We couldn't find the page you're looking for.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            className="rounded-lg bg-indigo-600 px-6 py-3 text-white shadow-md transition duration-300 hover:bg-indigo-700"
            onClick={() => (window.location.href = "/")}
          >
            Return Home
          </Link>

          <div className="mt-8 text-tertiary">
            <p>If you think this is a mistake, please contact support.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
