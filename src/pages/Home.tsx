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
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 gradient-sunset opacity-10"></div>
        
        <div className="relative z-10 text-center px-6 animate-fade-in">
          {/* Golden G Logo */}
          <div className="mb-8 animate-scale-in">
            <img 
              src="/lovable-uploads/4aa5fc39-aef3-4bd7-9fba-2d00939ec79e.png" 
              alt="Golden G Logo" 
              className="w-32 h-32 mx-auto hover-scale filter drop-shadow-lg"
            />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold text-primary text-glow mb-6">
            For Gauta
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            A space built from love, gratitude, and joy
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="gradient-sunset hover-glow">
              <Link to="/story">Explore Our Story</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="hover-scale">
              <Link to="/gallery">View Gallery</Link>
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
                src="/public/comicpages/coverpage.png" 
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
              <Link to="/messages">View All Messages</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;