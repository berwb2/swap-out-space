import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
    // In a real implementation, you would scan the public/comicpages directory
    // For now, we'll create a list of expected pages
    const expectedPages = [
      'coverpage.png',
      'chapter1.png',
      'chapter2.png',
      'chapter3.png'
    ];

    const pages: ComicPage[] = expectedPages.map((filename, index) => ({
      filename,
      url: `/comicpages/${filename}`,
      index
    }));

    setComicPages(pages);
    setIsLoading(false);
  }, []);

  const nextPage = () => {
    if (currentPage < comicPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (viewMode === 'reader') {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'Escape') setViewMode('grid');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [viewMode, currentPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              The Comic: Golden Girl
            </h1>
            <p className="text-xl text-muted-foreground">Loading pages...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            The Comic: Golden Girl
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A visual celebration of friendship, adventure, and golden moments
          </p>
          
          <div className="flex justify-center gap-4">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
              className="gradient-sunset hover-scale"
            >
              <Grid className="w-4 h-4 mr-2" />
              Grid View
            </Button>
            <Button
              variant={viewMode === 'reader' ? 'default' : 'outline'}
              onClick={() => setViewMode('reader')}
              className="gradient-glow hover-scale"
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
                className="glass-card overflow-hidden hover-glow transition-gentle cursor-pointer group"
                onClick={() => {
                  setCurrentPage(index);
                  setViewMode('reader');
                }}
              >
                <div className="aspect-[3/4] relative">
                  <img
                    src={page.url}
                    alt={`Comic page ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-gentle"
                    onError={(e) => {
                      e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                        <svg width="300" height="400" viewBox="0 0 300 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="300" height="400" fill="hsl(42 95% 96%)"/>
                          <text x="150" y="200" text-anchor="middle" fill="hsl(25 15% 15%)" font-family="Inter" font-size="16">
                            ${page.filename}
                          </text>
                          <text x="150" y="220" text-anchor="middle" fill="hsl(25 8% 45%)" font-family="Inter" font-size="14">
                            Page ${index + 1}
                          </text>
                        </svg>
                      `)}`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-gentle flex items-end justify-center pb-4">
                    <span className="text-white font-medium">Page {index + 1}</span>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-medium text-foreground">
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
                className="hover-scale"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <span className="text-muted-foreground">
                Page {currentPage + 1} of {comicPages.length}
              </span>
              
              <Button
                variant="outline"
                onClick={nextPage}
                disabled={currentPage === comicPages.length - 1}
                className="hover-scale"
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
                  className="w-full h-auto rounded-lg shadow-soft"
                  onError={(e) => {
                    e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                      <svg width="800" height="1000" viewBox="0 0 800 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="800" height="1000" fill="hsl(42 95% 96%)"/>
                        <text x="400" y="500" text-anchor="middle" fill="hsl(25 15% 15%)" font-family="Inter" font-size="24">
                          ${comicPages[currentPage].filename}
                        </text>
                        <text x="400" y="540" text-anchor="middle" fill="hsl(25 8% 45%)" font-family="Inter" font-size="18">
                          Page ${currentPage + 1}
                        </text>
                      </svg>
                    `)}`;
                  }}
                />
              </div>
            </div>

            {/* Page Navigation Dots */}
            <div className="flex justify-center gap-2">
              {comicPages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentPage
                      ? 'bg-primary scale-125'
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {comicPages.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Comic Pages Coming Soon
            </h3>
            <p className="text-muted-foreground">
              The beautiful story of Golden Girl is being crafted with love.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Comic;