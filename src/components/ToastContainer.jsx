// src/components/ToastContainer.jsx
import { useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="text-stock-green" size={24} />,
    error: <XCircle className="text-out-red" size={24} />,
    warning: <AlertCircle className="text-gaming-orange" size={24} />,
  };

  const styles = {
    success: "border-stock-green/50 bg-stock-green/10",
    error: "border-out-red/50 bg-out-red/10",
    warning: "border-gaming-orange/50 bg-gaming-orange/10",
  };

  return (
    <div className={`flex items-center gap-3 min-w-[300px] max-w-md bg-surface-dark border-2 ${styles[type]} rounded-xl p-4 shadow-2xl animate-slideIn`}>
      <div className="flex-shrink-0">{icons[type]}</div>
      <p className="flex-1 text-white font-semibold text-sm">{message}</p>
      <button onClick={onClose} className="flex-shrink-0 text-gray-400 hover:text-white transition">
        <X size={18} />
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-20 right-6 z-[9999] space-y-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

export default ToastContainer;
