import { useMemo } from 'react';
import { Briefcase, Users, DollarSign } from 'lucide-react';
import type { NavItem } from '@/components/layout/navbar/NavLinks';
import type { User } from '@supabase/supabase-js';

export function useNavigation(user: User | null): NavItem[] {
  return useMemo(() => {
    if (!user) return [];

    const userRole = user.user_metadata?.role || 'referrer';
    const baseItems: NavItem[] = [
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
  }, [user]);
}