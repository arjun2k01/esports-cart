import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-5 right-5 z-[100] w-full max-w-sm space-y-3">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center justify-between p-4 rounded-lg shadow-lg animate-fadeIn text-white ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          <div className="flex items-center">
            {toast.type === 'success' ? <CheckCircle className="h-5 w-5 mr-3" /> : <AlertCircle className="h-5 w-5 mr-3" />}
            <span className="font-medium">{toast.message}</span>
          </div>
          <button onClick={() => removeToast(toast.id)} className="ml-2">
            <X className="h-5 w-5" />
          </button>
        </div>
      ))}
    </div>
  );
};