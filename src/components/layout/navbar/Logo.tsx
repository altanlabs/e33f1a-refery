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
      <img 
        src="https://api.altan.ai/platform/media/3720f1bb-7284-479a-9de3-ea5e804bba23?account_id=e0396fa1-7f80-4550-83a1-9899afc21378" 
        alt="Refery.io Logo" 
        className="h-6 w-6 object-contain"
      />
      {showText && (
        <span className="font-bold">Refery</span>
      )}
    </Link>
  );
}