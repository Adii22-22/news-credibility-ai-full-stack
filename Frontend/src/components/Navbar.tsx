import React from "react";

const Navbar: React.FC<{ setLanguage: (l: "en" | "hi" | "mr") => void }> = ({
  setLanguage,
}) => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-white/5 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-primary flex items-center justify-center text-background-dark shadow-glow">
            <span className="material-symbols-outlined text-2xl">
              verified_user
            </span>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
            Verifi.ai
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a
            href="#"
            className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors"
          >
            Overview
          </a>
          <a
            href="#"
            className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors"
          >
            History
          </a>
          <a
            href="#"
            className="text-sm font-medium text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors"
          >
            Settings
          </a>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative group">
            <div className="size-10 rounded-full bg-slate-200 dark:bg-surface-dark flex items-center justify-center hover:bg-primary/20 transition-colors">
              <span className="material-symbols-outlined text-slate-600 dark:text-slate-300 group-hover:text-primary">
                notifications
              </span>
            </div>
            <span className="absolute top-0 right-0 size-3 rounded-full bg-red-500 border-2 border-background-light dark:border-background-dark"></span>
          </button>
          <select
            onChange={(e) => setLanguage(e.target.value as "en" | "hi" | "mr")}
            className="bg-transparent text-sm border border-gray-300 dark:border-white/10 rounded px-2 py-1 text-slate-600 dark:text-slate-300"
          >
            <option className="bg-green-900" value="en">
              EN
            </option>
            <option className="bg-green-900" value="hi">
              HI
            </option>
            <option className="bg-green-900" value="mr">
              MR
            </option>
          </select>

          <div className="size-10 rounded-full bg-gray-300 dark:bg-surface-dark overflow-hidden border border-gray-200 dark:border-white/10">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZybHUp00lirfnS5XQ9aKFaAqHe9gWgRSwPNU6UPs8vSCKoc84G6VmGf1iKze928qvxpddS7tTz6Ndr4DWxQeKzIdf1Ncr2m8eiHo5KuHju7OMb7KUNwPYx0VLmQ2WRW18wHFPbbLkk8QkXdJmmzYrvCRxjdzFxG_nlHYKwktmjIjVyE48qt2KmNIMN8uOYwaI9GlZ4dVPi7Qs70sd4TPly9WExY5iJUhqeq6On0XbcWNpgGoACWHkVgyOFkmvHSQdwRH7-8a5MXM"
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
