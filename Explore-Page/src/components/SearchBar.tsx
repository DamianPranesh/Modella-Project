import { Plus } from "lucide-react";

export function SearchBar() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center rounded-full bg-[#DD8560]/20 px-4 py-2">
        <Plus className="w-6 h-6 text-[#DD8560]" />
        <input
          type="search"
          placeholder="Search..."
          className="flex-1 bg-transparent border-none focus:outline-none px-4 py-2 text-gray-800 placeholder-gray-500"
        />
      </div>
    </div>
  );
}
