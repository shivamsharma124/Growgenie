import { useAuth } from "../../context/AuthContext";

// ─── Button ───────────────────────────────────────────────────────────────────
export function Button({ children, variant = "primary", size = "md", loading, className = "", ...props }) {
  const base = "inline-flex items-center justify-center gap-2 font-syne font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary:   "bg-indigo-600 hover:bg-indigo-500 text-white",
    secondary: "bg-transparent border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-400 dark:hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400",
    danger:    "bg-red-500 hover:bg-red-400 text-white",
    success:   "bg-teal-500 hover:bg-teal-400 text-white",
    ghost:     "bg-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-gray-600 dark:text-gray-400",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={loading} {...props}>
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
export function Input({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>}
      <input
        className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none border transition-all
          bg-gray-50 dark:bg-[#1a1a26]
          border-gray-200 dark:border-[#2a2a3d]
          text-gray-800 dark:text-gray-100
          placeholder-gray-400 dark:placeholder-gray-600
          focus:border-indigo-400 dark:focus:border-indigo-500
          focus:bg-white dark:focus:bg-[#1e1e2e]
          ${error ? "border-red-400 dark:border-red-500" : ""}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
export function Textarea({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>}
      <textarea
        rows={4}
        className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none border transition-all resize-none
          bg-gray-50 dark:bg-[#1a1a26]
          border-gray-200 dark:border-[#2a2a3d]
          text-gray-800 dark:text-gray-100
          placeholder-gray-400 dark:placeholder-gray-600
          focus:border-indigo-400 dark:focus:border-indigo-500
          ${error ? "border-red-400" : ""}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
export function Select({ label, children, className = "", ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>}
      <select
        className={`w-full rounded-xl px-4 py-2.5 text-sm outline-none border transition-all cursor-pointer
          bg-gray-50 dark:bg-[#1a1a26]
          border-gray-200 dark:border-[#2a2a3d]
          text-gray-800 dark:text-gray-100
          focus:border-indigo-400 dark:focus:border-indigo-500 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className = "", ...props }) {
  return (
    <div className={`bg-white dark:bg-[#12121a] border border-gray-100 dark:border-[#2a2a3d] rounded-2xl p-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300",
    success: "bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-400",
    warning: "bg-yellow-50 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400",
    danger:  "bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400",
    info:    "bg-indigo-50 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-400",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────
export function Spinner({ size = "md" }) {
  const sizes = { sm: "w-4 h-4", md: "w-8 h-8", lg: "w-12 h-12" };
  return (
    <div className="flex items-center justify-center p-8">
      <div className={`${sizes[size]} border-4 border-indigo-500 border-t-transparent rounded-full animate-spin`} />
    </div>
  );
}

// ─── PageHeader ───────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, action }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h1 className="font-syne text-2xl font-bold text-gray-800 dark:text-white">{title}</h1>
        {subtitle && <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, change, positive }) {
  return (
    <Card>
      <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{label}</p>
      <p className="font-syne text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
      {change && (
        <p className={`text-xs mt-1 ${positive === true ? "text-teal-500" : positive === false ? "text-red-400" : "text-yellow-500"}`}>
          {change}
        </p>
      )}
    </Card>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
         onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg bg-white dark:bg-[#12121a] border border-gray-100 dark:border-[#2a2a3d] rounded-2xl shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-[#2a2a3d]">
          <h2 className="font-syne text-lg font-bold text-gray-800 dark:text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none transition-colors">✕</button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ─── AIResultBox ──────────────────────────────────────────────────────────────
export function AIResultBox({ result, loading }) {
  if (!loading && !result) return null;
  return (
    <div className="mt-4 rounded-xl border-l-4 border-teal-400 bg-teal-50 dark:bg-teal-500/5 dark:border-teal-500 p-4">
      {loading ? (
        <div className="flex items-center gap-3 text-sm text-teal-600 dark:text-teal-400">
          <span className="w-4 h-4 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          Generating with GPT-4...
        </div>
      ) : (
        <pre className="text-sm text-gray-700 dark:text-gray-200 whitespace-pre-wrap leading-relaxed font-dm">{result}</pre>
      )}
    </div>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-syne font-bold text-gray-700 dark:text-gray-300 mb-1">{title}</h3>
      <p className="text-sm text-gray-400 dark:text-gray-500">{subtitle}</p>
    </div>
  );
}
