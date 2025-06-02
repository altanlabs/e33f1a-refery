import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showText?: boolean;
  onClick?: () => void;
}

export function Logo({ className = "", showText = true, onClick }: LogoProps) {
  return (
    <Link 
      to="/" 
      className={`flex items-center space-x-2 ${className}`}
      onClick={onClick}
    >
      <div className="h-6 w-6 rounded bg-primary" />
      {showText && (
        <span className="font-bold">Refery</span>
      )}
    </Link>
  );
}