
function App() {

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-6 py-24 text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700">
          Tailwind ready
        </span>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Pupuseria Ordering System
        </h1>
        <p className="text-base text-slate-600 sm:text-lg">
          Start building your ordering flow with Tailwind utility classes.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
            Place order
          </button>
          <button className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:bg-white hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
            View menu
          </button>
        </div>
      </div>
    </main>
  );
}

export default App
