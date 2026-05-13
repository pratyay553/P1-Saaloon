import React from 'react';
import { cn } from '@saloon/lib/utils'; // Corrected to use the package name

interface FormGroupProps {
  label?: string;
  error?: string;
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
}

const FormGroup: React.FC<FormGroupProps> = ({ label, error, children, htmlFor, className = "" }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      {children}
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
};

export default FormGroup;
