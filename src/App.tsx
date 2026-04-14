function App() {
  return (
    <main className="min-h-screen bg-base-200 flex items-center justify-center p-8">
      <section className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-3xl">Wraeclast Cards</h1>
          <p className="text-base-content/80">
            Tailwind CSS and daisyUI are configured correctly.
          </p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">It works</button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
