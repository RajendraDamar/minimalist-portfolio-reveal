
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  projects: { id: string; title: string; thumbnail?: string }[];
  expanded?: boolean;
  className?: string;
  closeSearch?: () => void;
  initialIsActive?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  projects, 
  expanded = false, 
  className = '',
  closeSearch,
  initialIsActive = false
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ id: string; title: string; thumbnail?: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(initialIsActive);
  const [showAdminButton, setShowAdminButton] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
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

  // Navigate to project when selected
  const navigateToProject = (projectId: string) => {
    navigate(`/project/${projectId}`);
    setIsOpen(false);
    setQuery('');
    if (closeSearch) closeSearch();
  };
  
  // Activate input when expanded
  const activateInput = () => {
    setIsActive(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 10);
  };
  
  // Focus input when expanded and active
  useEffect(() => {
    if ((expanded || isActive) && inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded, isActive]);
  
  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Only deactivate if we're supposed to close on outside click
        if (closeSearch) {
          setIsActive(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeSearch]);
  
  // Generate secure admin URL with timestamp and hash
  const generateAdminUrl = () => {
    const timestamp = Date.now();
    const hash = btoa(`admin-${timestamp}`).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    return `/admin/${hash}`;
  };
  
  return (
    <div className={`relative w-full ${className} search-input`} ref={searchRef}>
      <div className="relative flex items-center w-full">
        {!isActive ? (
          <div 
            onClick={activateInput}
            className="search-toggle flex items-center justify-center cursor-pointer w-full h-full"
          >
            <Search className="h-4 w-4 text-portfolio-white" />
            {!expanded && <span className="ml-2 text-portfolio-white/70 text-sm">Search projects...</span>}
          </div>
        ) : (
          <>
            <Search className="absolute left-3 h-4 w-4 text-portfolio-gray" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setIsOpen(true)}
              placeholder="Search projects..."
              className="pl-10 pr-4 py-2 w-full bg-transparent rounded-full text-sm text-portfolio-white focus:outline-none transition-all"
              autoFocus
            />
          </>
        )}
        {isActive && query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setShowAdminButton(false);
              if (closeSearch) {
                setIsActive(false);
                closeSearch();
              }
            }}
            className="absolute right-3"
          >
            <X className="h-4 w-4 text-portfolio-gray" />
          </button>
        )}
      </div>
      
      {isOpen && (query || showAdminButton) && (
        <div className="absolute mt-2 w-full bg-portfolio-lightGray/90 backdrop-blur-md rounded-md shadow-lg py-2 z-50 animate-fade-in">
          {showAdminButton ? (
            <div className="px-4 py-3">
              <Link 
                to={generateAdminUrl()}
                className="block w-full bg-portfolio-gray/30 hover:bg-portfolio-gray/50 text-portfolio-white py-2 px-4 rounded-md text-center font-medium transition-all"
              >
                Login as Admin
              </Link>
            </div>
          ) : results.length > 0 ? (
            results.map(project => (
              <div
                key={project.id}
                onClick={() => navigateToProject(project.id)}
                className="block px-4 py-2 hover:bg-portfolio-gray/20 text-portfolio-white cursor-pointer"
              >
                <div className="flex items-center">
                  {project.thumbnail && (
                    <div className="w-12 h-12 mr-3">
                      <img 
                        src={project.thumbnail} 
                        alt={project.title} 
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  )}
                  <span>{project.title}</span>
                </div>
              </div>
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
