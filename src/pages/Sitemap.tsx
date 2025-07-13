import { useEffect, useState } from 'react';
import { generateSitemapXML, getSitemapStats } from '../utils/sitemapGenerator';

interface SitemapStats {
  totalUrls: number;
  staticPages: number;
  jobListings: number;
  referrerProfiles: number;
  lastGenerated: string;
}

const Sitemap = () => {
  const [sitemapXML, setSitemapXML] = useState<string>('');
  const [stats, setStats] = useState<SitemapStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateSitemap();
  }, []);

  const generateSitemap = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [xml, sitemapStats] = await Promise.all([
        generateSitemapXML(),
        getSitemapStats()
      ]);
      
      setSitemapXML(xml);
      setStats(sitemapStats);
    } catch (err) {
      setError('Failed to generate sitemap. Please try again.');
      console.error('Sitemap generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadSitemap = () => {
    if (!sitemapXML) return;
    
    const blob = new Blob([sitemapXML], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copySitemap = async () => {
    if (!sitemapXML) return;
    
    try {
      await navigator.clipboard.writeText(sitemapXML);
      alert('Sitemap XML copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy sitemap:', err);
      alert('Failed to copy sitemap. Please try downloading instead.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Generating sitemap...</p>
          <p className="text-gray-500 text-sm mt-2">Fetching data from database</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Sitemap Generation Failed</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={generateSitemap}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">XML Sitemap Generator</h1>
              <p className="text-gray-600 mt-2">Production-ready sitemap for Refery.io</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={copySitemap}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Copy XML
              </button>
              <button
                onClick={downloadSitemap}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download XML
              </button>
              <button
                onClick={generateSitemap}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Regenerate
              </button>
            </div>
          </div>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalUrls}</div>
                <div className="text-sm text-blue-800">Total URLs</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{stats.staticPages}</div>
                <div className="text-sm text-green-800">Static Pages</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.jobListings}</div>
                <div className="text-sm text-purple-800">Job Listings</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.referrerProfiles}</div>
                <div className="text-sm text-orange-800">Referrer Profiles</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <div className="text-xs font-medium text-gray-600">Last Generated</div>
                <div className="text-sm text-gray-800">{new Date(stats.lastGenerated).toLocaleString()}</div>
              </div>
            </div>
          )}

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">SEO Configuration</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Priority Settings:</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Homepage: 1.0 (highest)</li>
                  <li>• Job Listings: 0.9 (very high)</li>
                  <li>• Scout Application: 0.8 (high)</li>
                  <li>• Referrer Profiles: 0.6 (medium)</li>
                  <li>• Static Pages: 0.3 (low)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-2">Update Frequency:</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>• Job Listings: Daily</li>
                  <li>• Homepage & Scout App: Weekly</li>
                  <li>• Referrer Profiles: Weekly</li>
                  <li>• Static Pages: Monthly</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 border">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">XML Sitemap Preview</h2>
            <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto max-h-96 overflow-y-auto">
              {sitemapXML}
            </pre>
          </div>
          
          <div className="mt-6 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
            <h2 className="text-lg font-semibold text-yellow-800 mb-3">📋 Implementation Instructions</h2>
            <div className="space-y-3 text-sm text-yellow-700">
              <div>
                <strong>1. Upload to Website Root:</strong>
                <p>Save the XML content as <code className="bg-yellow-100 px-2 py-1 rounded">sitemap.xml</code> in your website's root directory (https://refery.io/sitemap.xml)</p>
              </div>
              <div>
                <strong>2. Submit to Search Engines:</strong>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Google Search Console: Add sitemap URL</li>
                  <li>Bing Webmaster Tools: Submit sitemap</li>
                  <li>Add to robots.txt: <code className="bg-yellow-100 px-2 py-1 rounded">Sitemap: https://refery.io/sitemap.xml</code></li>
                </ul>
              </div>
              <div>
                <strong>3. Update Schedule:</strong>
                <p>Regenerate daily or when significant content changes occur (new jobs, referrer profiles)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;