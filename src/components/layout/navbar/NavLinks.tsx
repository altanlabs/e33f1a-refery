import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavLinksProps {
  items: NavItem[];
  mobile?: boolean;
  onItemClick?: () => void;
}

export function NavLinks({ items, mobile = false, onItemClick = () => {} }: NavLinksProps) {
  return (
    <>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              mobile ? 'py-2' : ''
            }`}
            onClick={onItemClick}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}