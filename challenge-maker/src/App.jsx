import Load from "./Load";

export default function App() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Algorithm Arena Weekly Challenge
      </h1>
      <div className="w-full max-w-3xl">
        <Load />
      </div>
    </div>
  );
}
