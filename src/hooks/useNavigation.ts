import { useMemo } from 'react';
import { Briefcase, Users, DollarSign, Search, Plus, FileText } from 'lucide-react';
import type { NavItem } from '@/components/layout/navbar/NavLinks';
import type { User } from '@supabase/supabase-js';

export function useNavigation(user: User | null): NavItem[] {
  return useMemo(() => {
    if (!user) return [];

    // Show all navigation items to every authenticated user
    const allItems: NavItem[] = [
      { href: '/dashboard', label: 'Dashboard', icon: Briefcase },
      { href: '/opportunities', label: 'Browse Jobs', icon: Search },
      { href: '/jobs/new', label: 'Post a Job', icon: Plus },
      { href: '/my-referrals', label: 'My Referrals', icon: Users },
      { href: '/my-applications', label: 'My Applications', icon: FileText },
      { href: '/payouts', label: 'Payouts', icon: DollarSign },
    ];

    return allItems;
  }, [user]);
}