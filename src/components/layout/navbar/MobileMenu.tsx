import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { Logo } from './Logo';
import { NavLinks, NavItem } from './NavLinks';

interface MobileMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  navItems: NavItem[];
}

export function MobileMenu({ isOpen, onOpenChange, navItems }: MobileMenuProps) {
  const handleClose = () => onOpenChange(false);

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
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
        <Logo onClick={handleClose} />
        <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            <NavLinks 
              items={navItems} 
              mobile 
              onItemClick={handleClose} 
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}