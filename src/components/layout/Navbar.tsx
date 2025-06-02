import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/lib/altan-auth';
import { Menu, LogOut, User, Settings, Briefcase, Users, DollarSign } from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const getNavItems = () => {
    if (!session?.user) return [];

    const userRole = session.user.user_metadata?.role || 'referrer';

    const baseItems = [
      { href: '/dashboard', label: 'Dashboard', icon: Briefcase },
    ];

    switch (userRole) {
      case 'poster':
        return [
          ...baseItems,
          { href: '/companies', label: 'Companies', icon: Briefcase },
          { href: '/jobs', label: 'Jobs', icon: Briefcase },
        ];
      case 'referrer':
        return [
          ...baseItems,
          { href: '/opportunities', label: 'Job Board', icon: Briefcase },
          { href: '/my-referrals', label: 'My Referrals', icon: Users },
          { href: '/payouts', label: 'Payouts', icon: DollarSign },
        ];
      case 'candidate':
        return [
          ...baseItems,
          { href: '/opportunities', label: 'Opportunities', icon: Briefcase },
          { href: '/my-applications', label: 'My Applications', icon: Users },
        ];
      default:
        return baseItems;
    }
  };

  const navItems = getNavItems();

  const NavLinks = ({ mobile = false, onItemClick = () => {} }) => (
    <>
      {navItems.map((item) => {
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <div className="h-6 w-6 rounded bg-primary" />
            <span className="hidden font-bold sm:inline-block">Refery</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <NavLinks />
          </nav>
        </div>

        {/* Mobile menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link
              to="/"
              className="flex items-center space-x-2"
              onClick={() => setIsOpen(false)}
            >
              <div className="h-6 w-6 rounded bg-primary" />
              <span className="font-bold">Refery</span>
            </Link>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                <NavLinks mobile onItemClick={() => setIsOpen(false)} />
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link to="/" className="flex items-center space-x-2 md:hidden">
              <div className="h-6 w-6 rounded bg-primary" />
              <span className="font-bold">Refery</span>
            </Link>
          </div>
          <nav className="flex items-center">
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.user_metadata?.avatar_url} alt={session.user.user_metadata?.full_name || session.user.email} />
                      <AvatarFallback>
                        {(session.user.user_metadata?.full_name || session.user.email || 'U')
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{session.user.user_metadata?.full_name || 'User'}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {session.user.email}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {session.user.user_metadata?.role || 'referrer'}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
                <Button asChild>
                  <Link to="/auth">Sign Up</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}