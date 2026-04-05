"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
}

interface CategoryMultiSelectProps {
  categories: Category[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  isLoading?: boolean;
}

const CategoryMultiSelect: React.FC<CategoryMultiSelectProps> = ({
  categories,
  selectedIds,
  onChange,
  isLoading
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCategory = (id: string) => {
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter(i => i !== id)
      : [...selectedIds, id];
    onChange(newIds);
  };

  const selectedCategories = categories.filter(c => selectedIds.includes(c.id));

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div 
        onClick={() => !isLoading && setIsOpen(!isOpen)}
        className={`w-full min-h-[42px] px-3 py-1.5 bg-white border rounded-xl transition-all cursor-pointer flex flex-wrap gap-1 items-center justify-between ${
          isOpen ? 'ring-4 ring-blue-500/10 border-blue-500' : 'border-gray-200 hover:border-gray-300'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex flex-wrap gap-1 flex-1 overflow-hidden">
          {selectedCategories.length > 0 ? (
            selectedCategories.map(c => (
              <span 
                key={c.id} 
                className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg text-xs font-bold flex items-center gap-1 border border-blue-100 animate-in zoom-in-95 duration-200"
              >
                {c.name}
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-blue-800" 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCategory(c.id);
                  }}
                />
              </span>
            ))
          ) : (
            <span className="text-gray-400 text-sm">Select categories...</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[100] mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 py-2 max-h-60 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          {categories.length > 0 ? (
              <div className="px-2 pb-2 mb-2 border-b border-gray-50">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Choose Categories</p>
              </div>
          ) : null}
          {categories.map(c => {
            const isSelected = selectedIds.includes(c.id);
            const parentName = (c as any).parent?.name;
            return (
              <div
                key={c.id}
                onClick={() => toggleCategory(c.id)}
                className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors ${
                  isSelected ? 'bg-blue-50/50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {parentName && (
                    <span className="text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded leading-none shrink-0 border border-gray-200/50">
                      {parentName} →
                    </span>
                  )}
                  <span>{c.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-blue-500" strokeWidth={3} />}
              </div>
            );
          })}
          {categories.length === 0 && (
            <div className="px-4 py-3 text-center text-gray-400 text-xs italic">
                No categories available
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategoryMultiSelect;
