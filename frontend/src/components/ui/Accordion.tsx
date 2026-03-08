import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden mb-3">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <span className="font-medium text-slate-900 pr-4">{title}</span>
        <div className="flex-shrink-0">
          {isOpen ? (
            <ChevronDown className="text-slate-600" size={20} />
          ) : (
            <ChevronRight className="text-slate-600" size={20} />
          )}
        </div>
      </button>
      
      {isOpen && (
        <div className="p-4 bg-white border-t border-slate-200 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

interface AccordionProps {
  children: React.ReactNode;
  allowMultiple?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({ children, allowMultiple = false }) => {
  const [openIndexes, setOpenIndexes] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    setOpenIndexes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-0">
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isOpen: openIndexes.has(index),
            onToggle: () => toggleItem(index),
          });
        }
        return child;
      })}
    </div>
  );
};

export { Accordion, AccordionItem };

