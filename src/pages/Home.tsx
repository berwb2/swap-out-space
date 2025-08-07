import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Post {
  id: string;
  content: string;
  image_url: string | null;
  author_name: string | null;
  created_at: string;
}

const Home = () => {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);

        if (error) throw error;
        setRecentPosts(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section - The Ode to Gauta */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Dynamic Mesh Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/20 to-primary-glow/20 opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-accent/10 via-primary/15 to-primary-glow/10"></div>
        
        <div className="relative z-10 text-center px-6 animate-fade-in max-w-4xl mx-auto">
          {/* Animated Icons */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 animate-float-1 opacity-60">
              <div className="w-8 h-8 text-primary">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
            </div>
            <div className="absolute top-1/3 right-1/4 animate-float-2 opacity-60">
              <div className="w-10 h-10 text-accent">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
              </div>
            </div>
            <div className="absolute bottom-1/4 left-1/3 animate-float-3 opacity-60">
              <div className="w-6 h-6 text-primary-glow">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            <h1 className="text-6xl md:text-8xl font-bold text-primary text-glow mb-4">
              To Gauta.
            </h1>
            
            <h2 className="text-3xl md:text-4xl font-medium text-accent mb-8">
              The Golden Girl.
            </h2>
            
            <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto leading-relaxed font-light">
              For the one who finds joy in the rhythm of a long run, peace in a perfect piece of sushi, 
              and pure delight in the darkest chocolate. This space is a reflection of a spirit that is 
              strong, vibrant, and deeply loved. A collection of moments and memories, built with 
              gratitude for the light you bring into the world.
            </p>
          </div>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gradient-sunset hover-glow">
              <Link to="/tributes">View Tribute Wall</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="hover-scale">
              <Link to="/comic">Read the Comic</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Comic Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              The Comic: Golden Girl
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A visual journey celebrating friendship and adventure
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="glass-card p-8 hover-glow transition-gentle">
              <img 
                src="/comicpages/coverpage.png" 
                alt="Golden Girl Comic Cover" 
                className="w-full rounded-lg shadow-soft"
                onError={(e) => {
                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDQwMCA2MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNjAwIiBmaWxsPSJoc2woNDIgOTUlIDk2JSkiLz4KPHRleHQgeD0iMjAwIiB5PSIzMDAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9ImhzbCgyNSAxNSUgMTUlKSIgZm9udC1mYW1pbHk9IkludGVyIiBmb250LXNpemU9IjE4Ij5Db21pYyBDb3ZlcjwvdGV4dD4KPC9zdmc+';
                }}
              />
            </div>
            
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-foreground">
                A Story Worth Telling
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Follow along as we celebrate the golden moments that make friendship 
                extraordinary. Each page is crafted with love and attention to the 
                details that matter most.
              </p>
              <Button asChild size="lg" className="gradient-glow hover-scale">
                <Link to="/comic">Read the Comic</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Wall Preview */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Community Wall
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Recent messages and memories shared by friends
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="glass-card p-6 animate-pulse">
                  <div className="h-4 bg-muted rounded mb-3"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </Card>
              ))}
            </div>
          ) : recentPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {recentPosts.map((post) => (
                <Card key={post.id} className="glass-card p-6 hover-glow transition-gentle">
                  {post.image_url && (
                    <img 
                      src={post.image_url} 
                      alt="Community post" 
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}
                  <p className="text-foreground leading-relaxed mb-3">
                    {post.content}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    {post.author_name && `— ${post.author_name}`}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-6">
                No messages yet. Be the first to share a memory!
              </p>
            </div>
          )}
          
          <div className="text-center">
            <Button asChild size="lg" className="gradient-sunset hover-scale">
              <Link to="/tributes">View Tribute Wall</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;