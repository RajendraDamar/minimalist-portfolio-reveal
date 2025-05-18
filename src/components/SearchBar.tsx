
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SearchBarProps {
  projects: { id: string; title: string }[];
}

const SearchBar: React.FC<SearchBarProps> = ({ projects }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ id: string; title: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showAdminButton, setShowAdminButton] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Search function that matches from the beginning of words
  const handleSearch = (searchTerm: string) => {
    setQuery(searchTerm);
    
    // Check for admin password
    if (searchTerm.toLowerCase() === 'gudang70') {
      setShowAdminButton(true);
      setResults([]);
      return;
    } else {
      setShowAdminButton(false);
    }
    
    if (searchTerm.trim() === '') {
      setResults([]);
      return;
    }
    
    // Filter projects that start with the search term
    const filtered = projects.filter(project => 
      project.title.toLowerCase().split(' ').some(word => 
        word.toLowerCase().startsWith(searchTerm.toLowerCase())
      )
    );
    
    setResults(filtered);
  };
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Generate secure admin URL with timestamp and hash
  const generateAdminUrl = () => {
    const timestamp = Date.now();
    const hash = btoa(`admin-${timestamp}`).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    return `/admin/${hash}`;
  };
  
  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-portfolio-gray" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search projects..."
          className="pl-10 pr-4 py-2 w-full bg-portfolio-lightGray rounded-full text-sm text-portfolio-white focus:outline-none focus:ring-1 focus:ring-portfolio-gray transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowAdminButton(false);
            }}
            className="absolute right-3"
          >
            <X className="h-4 w-4 text-portfolio-gray" />
          </button>
        )}
      </div>
      
      {isOpen && (query || showAdminButton) && (
        <div className="absolute mt-2 w-full bg-portfolio-lightGray rounded-md shadow-lg py-2 z-50 animate-fade-in">
          {showAdminButton ? (
            <div className="px-4 py-3">
              <Link to={generateAdminUrl()}>
                <Button className="w-full bg-dark-orchid hover:bg-dark-orchid/80 text-portfolio-white">
                  Login as Admin
                </Button>
              </Link>
            </div>
          ) : results.length > 0 ? (
            results.map(project => (
              <Link
                key={project.id}
                to={`/project/${project.id}`}
                className="block px-4 py-2 hover:bg-portfolio-gray/20 text-portfolio-white"
                onClick={() => setIsOpen(false)}
              >
                {project.title}
              </Link>
            ))
          ) : query ? (
            <div className="px-4 py-2 text-sm text-portfolio-darkGray">No projects found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
