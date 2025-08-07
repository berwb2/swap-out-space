import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Letter {
  id: string;
  title: string;
  content: string;
  author_name: string;
  created_at: string;
}

const Letters = () => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLetters();
  }, []);

  const fetchLetters = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('letters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLetters(data || []);
    } catch (error) {
      console.error('Error fetching letters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getContentSnippet = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Letters to Gauta
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Heartfelt messages and beautiful words from friends who care
          </p>
          
          <Button asChild size="lg" className="gradient-sunset hover-scale">
            <Link to="/write-letter">Write a Letter</Link>
          </Button>
        </div>

        {/* Letters List */}
        {isLoading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="glass-card p-8 animate-pulse">
                <div className="h-8 bg-muted rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded mb-2 w-2/3"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : letters.length > 0 ? (
          <div className="space-y-8">
            {letters.map((letter) => (
              <Card key={letter.id} className="glass-card p-8 hover-glow transition-gentle">
                <Link to={`/letters/${letter.id}`} className="block">
                  <h2 className="text-2xl font-bold text-foreground mb-4 hover:text-primary transition-fast">
                    {letter.title}
                  </h2>
                  
                  <p className="text-foreground leading-relaxed mb-6">
                    {getContentSnippet(letter.content)}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>— {letter.author_name}</span>
                    <span>{new Date(letter.created_at).toLocaleDateString()}</span>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              No Letters Yet
            </h3>
            <p className="text-muted-foreground mb-8">
              Be the first to write a heartfelt letter to Gauta!
            </p>
            <Button asChild size="lg" className="gradient-sunset hover-scale">
              <Link to="/write-letter">Write First Letter</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Letters;