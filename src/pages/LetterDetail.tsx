import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface Letter {
  id: string;
  title: string;
  content: string;
  author_name: string;
  created_at: string;
}

const LetterDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [letter, setLetter] = useState<Letter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchLetter(id);
    }
  }, [id]);

  const fetchLetter = async (letterId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('letters')
        .select('*')
        .eq('id', letterId)
        .single();

      if (error) throw error;
      setLetter(data);
    } catch (error) {
      console.error('Error fetching letter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-6">
        <div className="container mx-auto max-w-4xl">
          <Card className="glass-card p-8 animate-pulse">
            <div className="h-8 bg-muted rounded mb-6 w-3/4"></div>
            <div className="space-y-3">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!letter) {
    return (
      <div className="min-h-screen py-12 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Letter Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The letter you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild className="gradient-sunset hover-scale">
            <Link to="/letters">Back to Letters</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Button asChild variant="outline" className="hover-scale">
            <Link to="/letters">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Letters
            </Link>
          </Button>
        </div>

        <Card className="glass-card p-8 md:p-12">
          <header className="mb-12 text-center border-b border-border/20 pb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              {letter.title}
            </h1>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-muted-foreground">
              <span className="text-lg">— {letter.author_name}</span>
              <span className="hidden sm:inline">•</span>
              <span>{new Date(letter.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
          </header>

          <article className="prose prose-lg max-w-none">
            <div className="text-foreground leading-relaxed whitespace-pre-wrap text-lg">
              {letter.content}
            </div>
          </article>

          <footer className="mt-12 pt-8 border-t border-border/20 text-center">
            <p className="text-muted-foreground italic">
              Written with love for Gauta
            </p>
          </footer>
        </Card>
      </div>
    </div>
  );
};

export default LetterDetail;