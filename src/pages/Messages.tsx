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

const Messages = () => {
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
        title: "Message Posted!",
        description: "Your message has been added to the community wall",
      });

      setFormData({ content: '', author_name: '' });
      // fetchPosts(); // Not needed with realtime
    } catch (error) {
      console.error('Error posting message:', error);
      toast({
        title: "Error",
        description: "Failed to post message. Please try again.",
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
        description: "Please write a message to go with your image",
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
        title: "Post Created!",
        description: "Your message and image have been shared",
      });

      setFormData({ content: '', author_name: '' });
      // Reset file input
      event.target.value = '';
    } catch (error) {
      console.error('Error uploading:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Community Wall
          </h1>
          <p className="text-xl text-muted-foreground">
            Share your thoughts, memories, and love for Gauta
          </p>
        </div>

        {/* Post Form */}
        <Card className="glass-card p-8 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Share a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="author" className="text-base font-medium">
                Your Name (Optional)
              </Label>
              <Input
                id="author"
                value={formData.author_name}
                onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                placeholder="Your name"
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
                placeholder="Share your thoughts..."
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
                {isSubmitting ? 'Posting...' : 'Post Message'}
              </Button>
              
              <div className="flex-1">
                <Label htmlFor="image" className="sr-only">Upload Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isSubmitting || uploadingImage}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {uploadingImage && (
                  <p className="text-sm text-muted-foreground mt-1">Uploading...</p>
                )}
              </div>
            </div>
          </form>
        </Card>

        {/* Messages List */}
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="glass-card p-6 animate-pulse">
                <div className="h-4 bg-muted rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="glass-card p-6 hover-glow transition-gentle">
                {post.image_url && (
                  <div className="mb-4">
                    <img
                      src={post.image_url}
                      alt="Posted image"
                      className="w-full max-w-md mx-auto rounded-lg shadow-soft"
                    />
                  </div>
                )}
                
                <p className="text-foreground text-lg leading-relaxed mb-4">
                  {post.content}
                </p>
                
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>{post.author_name ? `— ${post.author_name}` : '— Anonymous'}</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              No Messages Yet
            </h3>
            <p className="text-muted-foreground">
              Be the first to share a message on the community wall!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;