import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'altan-auth';
import { Logo } from './navbar/Logo';
import { NavLinks } from './navbar/NavLinks';
import { MobileMenu } from './navbar/MobileMenu';
import { UserMenu } from './navbar/UserMenu';
import { AuthButtons } from './navbar/AuthButtons';
import { useNavigation } from '@/hooks/useNavigation';

export function Navbar() {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navItems = useNavigation(session?.user || null);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 flex h-14 items-center">
        {/* Desktop Navigation */}
        <div className="mr-4 hidden md:flex">
          <Logo className="mr-6" showText />
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <NavLinks items={navItems} />
          </nav>
        </div>

        {/* Mobile Menu */}
        <MobileMenu 
          isOpen={isOpen} 
          onOpenChange={setIsOpen} 
          navItems={navItems} 
        />

        {/* Right Side Content */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* Mobile Logo */}
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Logo className="md:hidden" showText />
          </div>
          
          {/* User Menu or Auth Buttons */}
          <nav className="flex items-center">
            {session?.user ? (
              <UserMenu user={session.user} onLogout={handleLogout} />
            ) : (
              <AuthButtons />
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}