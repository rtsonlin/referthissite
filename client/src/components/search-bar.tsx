import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative search-backdrop rounded-2xl p-2 shadow-2xl">
        <div className="flex items-center">
          <div className="pl-4 text-gray-400">
            <Search className="h-6 w-6" />
          </div>
          <input 
            type="text" 
            placeholder="Search for services, categories, or deals..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-4 py-4 bg-transparent text-gray-800 placeholder-gray-500 focus:outline-none text-lg"
            data-testid="input-search"
          />
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
