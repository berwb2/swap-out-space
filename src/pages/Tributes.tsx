import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Post {
  id: string;
  content: string;
  image_url: string | null;
  author_name: string | null;
  created_at: string;
}

const Tributes = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({ content: '', author_name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();

    // Set up realtime subscription
    const channel = supabase
      .channel('posts-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'posts' },
        (payload) => {
          setPosts(current => [payload.new as Post, ...current]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      toast({
        title: "Missing Message",
        description: "Please write a message",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('posts')
        .insert({
          content: formData.content.trim(),
          author_name: formData.author_name.trim() || null,
        });

      if (error) throw error;

      toast({
        title: "Tribute Posted!",
        description: "Your message has been added to the tribute wall",
      });

      setFormData({ content: '', author_name: '' });
    } catch (error) {
      console.error('Error posting tribute:', error);
      toast({
        title: "Error",
        description: "Failed to post tribute. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!formData.content.trim()) {
      toast({
        title: "Add a Message",
        description: "Please write a message to go with your photo",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('gauta-media')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('gauta-media')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase
        .from('posts')
        .insert({
          content: formData.content.trim(),
          author_name: formData.author_name.trim() || null,
          image_url: publicUrl,
        });

      if (insertError) throw insertError;

      toast({
        title: "Tribute Created!",
        description: "Your message and photo have been shared",
      });

      setFormData({ content: '', author_name: '' });
      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading:', error);
      toast({
        title: "Error",
        description: "Failed to upload photo",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Tribute Wall
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A collection of love, memories, and moments shared for Gauta
          </p>
        </div>

        {/* Unified Submission Form */}
        <Card className="glass-card p-8 mb-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Share Your Tribute</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="author" className="text-base font-medium">
                Your Name
              </Label>
              <Input
                id="author"
                value={formData.author_name}
                onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                placeholder="Your name (optional)"
                className="mt-2"
                disabled={isSubmitting || uploadingImage}
              />
            </div>
            
            <div>
              <Label htmlFor="content" className="text-base font-medium">
                Your Message
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Share your thoughts, memories, or words of appreciation..."
                rows={4}
                className="mt-2"
                disabled={isSubmitting || uploadingImage}
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                disabled={isSubmitting || uploadingImage}
                className="gradient-sunset hover-scale flex-1"
              >
                {isSubmitting ? 'Posting...' : 'Post Tribute'}
              </Button>
              
              <div className="flex-1">
                <Label htmlFor="image" className="sr-only">Upload Photo</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isSubmitting || uploadingImage}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {uploadingImage && (
                  <p className="text-sm text-muted-foreground mt-1">Uploading photo...</p>
                )}
              </div>
            </div>
          </form>
        </Card>

        {/* Unified Masonry Feed */}
        {isLoading ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="glass-card p-6 animate-pulse break-inside-avoid mb-6">
                <div className="h-4 bg-muted rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="glass-card p-6 hover-glow transition-gentle break-inside-avoid mb-6">
                {post.image_url && (
                  <div className="mb-4 -m-6 mb-6">
                    <img
                      src={post.image_url}
                      alt="Tribute photo"
                      className="w-full h-auto object-cover rounded-t-lg"
                    />
                  </div>
                )}
                
                <div className={post.image_url ? "px-6 pb-6" : ""}>
                  <p className="text-foreground text-base leading-relaxed mb-4">
                    {post.content}
                  </p>
                  
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>{post.author_name ? `— ${post.author_name}` : '— Anonymous'}</span>
                    <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Be the First
            </h3>
            <p className="text-muted-foreground">
              Share the first tribute on this beautiful wall dedicated to Gauta!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tributes;