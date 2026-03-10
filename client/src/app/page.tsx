import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
          Manage your tasks with <span className="text-blue-600">Kanban App</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          A simple, fast, and effective way to organize your work. 
          Drag tasks, set priorities, and achieve your goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition shadow-lg"
          >
            Start now for free
          </Link>
          <Link
            href="/login"
            className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-full font-bold hover:bg-gray-50 transition"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
