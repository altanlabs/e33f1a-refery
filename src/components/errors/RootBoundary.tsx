import * as React from 'react';
import { memo } from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { AlertCircle, RefreshCw, Copy, Check } from 'lucide-react';

const RootBoundary = () => {
  const error = useRouteError();
  const [copied, setCopied] = React.useState(false);
  
  let errorMessage = "An unexpected error occurred";
  
  if (isRouteErrorResponse(error)) {
    errorMessage = error.statusText || error.data?.message;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const copyError = async () => {
    const errorText = error instanceof Error 
      ? `Error: ${error.message}\n\nStack Trace:\n${error.stack}`
      : errorMessage;
    
    await navigator.clipboard.writeText(errorText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="max-w-[32rem] p-6 border rounded-lg shadow-md bg-white">
        <div className="flex flex-col gap-4 items-center">
          <div className="flex gap-2 items-center">
            <AlertCircle />
            <h2 className="text-xl font-semibold">Error Detected</h2>
          </div>
          
          <p className="text-gray-600 text-sm">
            Try to copy and send it to the AI to fix it. 
          </p>

          <p className="text-gray-600 text-xs">
            {errorMessage}
          </p>

          {error instanceof Error && (
            <div className="w-full relative border rounded p-4">
              <button
                className="absolute right-2 top-2 p-1 hover:bg-gray-100 rounded"
                onClick={copyError}
              >
                {copied ? (
                  <Check width="16" height="16" />
                ) : (
                  <Copy width="16" height="16" />
                )}
              </button>
              <pre className="text-xs text-gray-600 max-h-[50vh] overflow-auto whitespace-pre-wrap break-words">
                {error.stack}
              </pre>
            </div>
          )}

          <button 
            className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-100"
            onClick={() => window.location.reload()}
          >
            <RefreshCw width="16" height="16" />
            Reload
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(RootBoundary);
