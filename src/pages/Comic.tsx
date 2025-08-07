import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Grid, Book } from "lucide-react";

interface ComicPage {
  filename: string;
  url: string;
  index: number;
}

const Comic = () => {
  const [comicPages, setComicPages] = useState<ComicPage[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'reader'>('grid');
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadComicPages = async () => {
      try {
        // Fixed: Remove /public from the path
        const imageModules = import.meta.glob('/comicpages/*.{png,jpg,jpeg}', { 
          as: 'url',
          eager: true 
        });
        
        // Extract filenames and create page objects
        const pages: ComicPage[] = Object.keys(imageModules)
          .map(path => {
            const filename = path.split('/').pop() || '';
            return {
              filename,
              url: imageModules[path],
              index: 0
            };
          })
          .sort((a, b) => {
            return a.filename.localeCompare(b.filename, undefined, {
              numeric: true,
              sensitivity: 'base'
            });
          })
          .map((page, index) => ({ ...page, index }));
        
        setComicPages(pages);
      } catch (error) {
        console.error('Error loading comic pages:', error);
        // Fallback pages
        const fallbackPages = [
          'coverpage.png',
          'chapter1.png', 
          'chapter2.png',
          'finalchapter.png'
        ];
        
        const pages: ComicPage[] = fallbackPages.map((filename, index) => ({
          filename,
          url: `/comicpages/${filename}`,
          index
        }));
        
        setComicPages(pages);
      } finally {
        setIsLoading(false);
      }
    };

    loadComicPages();
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => prev < comicPages.length - 1 ? prev + 1 : prev);
  }, [comicPages.length]);

  const prevPage = useCallback(() => {
    setCurrentPage(prev => prev > 0 ? prev - 1 : prev);
  }, []);

  // Fixed: Better event listener handling
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (viewMode === 'reader') {
        if (e.key === 'ArrowRight') nextPage();
        if (e.key === 'ArrowLeft') prevPage();
        if (e.key === 'Escape') setViewMode('grid');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [viewMode, nextPage, prevPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-6 bg-gradient-to-br from-orange-50 to-yellow-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              The Comic: Golden Girl
            </h1>
            <p className="text-xl text-gray-600">Loading pages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 bg-gradient-to-br from-orange-50 to-yellow-50">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            The Comic: Golden Girl
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            A visual celebration of friendship, adventure, and golden moments
          </p>
          
          <div className="flex justify-center gap-4">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
              className="transform hover:scale-105 transition-transform duration-200"
            >
              <Grid className="w-4 h-4 mr-2" />
              Grid View
            </Button>
            <Button
              variant={viewMode === 'reader' ? 'default' : 'outline'}
              onClick={() => setViewMode('reader')}
              className="transform hover:scale-105 transition-transform duration-200"
            >
              <Book className="w-4 h-4 mr-2" />
              Reader View
            </Button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {comicPages.map((page, index) => (
              <Card
                key={page.filename}
                className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group bg-white/80 backdrop-blur-sm border-orange-200"
                onClick={() => {
                  setCurrentPage(index);
                  setViewMode('reader');
                }}
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={page.url}
                    alt={`Comic page ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                        <svg width="300" height="400" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="300" height="400" fill="#fef3c7"/>
                          <rect x="50" y="150" width="200" height="100" rx="10" fill="#f59e0b" opacity="0.5"/>
                          <text x="150" y="200" text-anchor="middle" fill="#92400e" font-family="Arial" font-size="16" font-weight="bold">
                            ${page.filename}
                          </text>
                          <text x="150" y="220" text-anchor="middle" fill="#b45309" font-family="Arial" font-size="14">
                            Page ${index + 1}
                          </text>
                        </svg>
                      `)}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <span className="text-white font-medium">Page {index + 1}</span>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-medium text-gray-900">
                    {page.filename.replace('.png', '').replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Reader View */}
        {viewMode === 'reader' && comicPages.length > 0 && (
          <div className="space-y-8">
            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={prevPage}
                disabled={currentPage === 0}
                className="transform hover:scale-105 transition-transform duration-200"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <span className="text-gray-600 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
                Page {currentPage + 1} of {comicPages.length}
              </span>
              
              <Button
                variant="outline"
                onClick={nextPage}
                disabled={currentPage === comicPages.length - 1}
                className="transform hover:scale-105 transition-transform duration-200"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Current Page */}
            <div className="flex justify-center">
              <div className="max-w-4xl w-full">
                <img
                  src={comicPages[currentPage].url}
                  alt={`Comic page ${currentPage + 1}`}
                  className="w-full h-auto rounded-lg shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                      <svg width="800" height="1000" viewBox="0 0 800 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="800" height="1000" fill="#fef3c7"/>
                        <rect x="200" y="400" width="400" height="200" rx="20" fill="#f59e0b" opacity="0.5"/>
                        <text x="400" y="500" text-anchor="middle" fill="#92400e" font-family="Arial" font-size="24" font-weight="bold">
                          ${comicPages[currentPage].filename}
                        </text>
                        <text x="400" y="540" text-anchor="middle" fill="#b45309" font-family="Arial" font-size="18">
                          Page ${currentPage + 1}
                        </text>
                      </svg>
                    `)}`;
                  }}
                />
              </div>
            </div>

            {/* Page Navigation Dots */}
            <div className="flex justify-center gap-2 flex-wrap">
              {comicPages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentPage
                      ? 'bg-orange-500 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {comicPages.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Comic Pages Coming Soon
            </h3>
            <p className="text-gray-600">
              The beautiful story of Golden Girl is being crafted with love.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comic;
