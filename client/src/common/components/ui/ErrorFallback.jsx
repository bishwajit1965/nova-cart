const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div
      role="alert"
      className="p-4 border border-red-500 rounded bg-red-100 text-red-700 max-w-md mx-auto mt-8"
    >
      <h2 className="text-lg font-bold mb-2">🌟 Something went wrong:</h2>
      <pre className="whitespace-pre-wrap mb-4">
        {error?.message || "Unknown error occurred."}
      </pre>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorFallback;
