import { supabase } from '../lib/supabase';

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

export const generateSitemapXML = async (): Promise<string> => {
  const baseUrl = 'https://refery.io';
  const currentDate = new Date().toISOString();
  const entries: SitemapEntry[] = [];

  // Static pages with priorities according to SEO best practices
  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'weekly' as const }, // Homepage - highest priority
    { path: '/apply', priority: '0.8', changefreq: 'weekly' as const }, // Scout application - high priority
    { path: '/privacy', priority: '0.3', changefreq: 'monthly' as const }, // Legal pages - low priority
    { path: '/terms', priority: '0.3', changefreq: 'monthly' as const },
    { path: '/contact', priority: '0.3', changefreq: 'monthly' as const },
  ];

  // Add static pages to sitemap
  staticPages.forEach(page => {
    entries.push({
      loc: `${baseUrl}${page.path}`,
      lastmod: currentDate,
      changefreq: page.changefreq,
      priority: page.priority
    });
  });

  try {
    // Fetch all open jobs from database with updated timestamps
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('id, updated_at, title, created_at')
      .eq('status', 'Open')
      .order('updated_at', { ascending: false });

    if (!jobsError && jobs) {
      jobs.forEach(job => {
        const lastModified = job.updated_at || job.created_at || currentDate;
        entries.push({
          loc: `${baseUrl}/jobs/${job.id}`,
          lastmod: lastModified,
          changefreq: 'daily', // Job listings change frequently
          priority: '0.9' // High priority for job listings
        });
      });
    }

    // Fetch active referrer profiles for public referral pages
    const { data: referrerProfiles, error: profilesError } = await supabase
      .from('referrer_profiles')
      .select('username, updated_at, created_at')
      .not('username', 'is', null)
      .order('updated_at', { ascending: false });

    if (!profilesError && referrerProfiles) {
      referrerProfiles.forEach(profile => {
        if (profile.username && profile.username.trim()) {
          const lastModified = profile.updated_at || profile.created_at || currentDate;
          entries.push({
            loc: `${baseUrl}/r/${profile.username}`,
            lastmod: lastModified,
            changefreq: 'weekly', // Referrer profiles change less frequently
            priority: '0.6' // Medium priority for referrer profiles
          });
        }
      });
    }

  } catch (error) {
    console.error('Error fetching sitemap data:', error);
    // Continue with static pages even if database queries fail
  }

  // Sort entries by priority (highest first) then by lastmod (newest first)
  entries.sort((a, b) => {
    const priorityDiff = parseFloat(b.priority) - parseFloat(a.priority);
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.lastmod).getTime() - new Date(a.lastmod).getTime();
  });

  // Generate XML sitemap conforming to Google and Bing standards
  return generateXMLSitemap(entries);
};

const generateXMLSitemap = (entries: SitemapEntry[]): string => {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';

  const urls = entries.map(entry => `
  <url>
    <loc>${escapeXML(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('');

  return `${xmlHeader}
${urlsetOpen}${urls}
${urlsetClose}`;
};

// Escape XML special characters
const escapeXML = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// Generate sitemap statistics for monitoring
export const getSitemapStats = async () => {
  try {
    const [jobsResult, profilesResult] = await Promise.all([
      supabase.from('jobs').select('id', { count: 'exact' }).eq('status', 'Open'),
      supabase.from('referrer_profiles').select('username', { count: 'exact' }).not('username', 'is', null)
    ]);

    return {
      totalUrls: 5 + (jobsResult.count || 0) + (profilesResult.count || 0), // 5 static pages + dynamic pages
      staticPages: 5,
      jobListings: jobsResult.count || 0,
      referrerProfiles: profilesResult.count || 0,
      lastGenerated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting sitemap stats:', error);
    return {
      totalUrls: 5,
      staticPages: 5,
      jobListings: 0,
      referrerProfiles: 0,
      lastGenerated: new Date().toISOString()
    };
  }
};