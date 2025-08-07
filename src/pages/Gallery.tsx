import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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

const Gallery = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ content: '', author_name: '' });
  const [uploadingImage, setUploadingImage] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, [sortBy]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: sortBy === 'oldest' });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load gallery images",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
          content: formData.content,
          author_name: formData.author_name,
          image_url: publicUrl,
        });

      if (insertError) throw insertError;

      toast({
        title: "Success!",
        description: "Your memory has been added to the gallery",
      });

      setFormData({ content: '', author_name: '' });
      setShowAddForm(false);
      fetchPosts();
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

  const postsWithImages = posts.filter(post => post.image_url);

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Gallery
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            A collection of beautiful moments and cherished memories
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
              <DialogTrigger asChild>
                <Button size="lg" className="gradient-sunset hover-scale">
                  Add Your Memory
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card">
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-foreground">Share a Memory</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="author">Your Name</Label>
                      <Input
                        id="author"
                        value={formData.author_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                        placeholder="Your name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="content">Memory Description</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                        placeholder="Describe this memory..."
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="image">Upload Image</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </div>
                  </div>
                  
                  {uploadingImage && (
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className="px-4 py-2 border border-border rounded-lg bg-card text-foreground"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Gallery Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="glass-card aspect-square animate-pulse">
                <div className="w-full h-full bg-muted rounded-lg"></div>
              </Card>
            ))}
          </div>
        ) : postsWithImages.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postsWithImages.map((post) => (
              <Dialog key={post.id}>
                <DialogTrigger asChild>
                  <Card className="glass-card overflow-hidden hover-glow transition-gentle cursor-pointer group">
                    <div className="aspect-square relative">
                      <img
                        src={post.image_url!}
                        alt={post.content || 'Gallery image'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-gentle"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-gentle"></div>
                    </div>
                    {post.content && (
                      <div className="p-4">
                        <p className="text-sm text-foreground line-clamp-2">
                          {post.content}
                        </p>
                        {post.author_name && (
                          <p className="text-xs text-muted-foreground mt-2">
                            — {post.author_name}
                          </p>
                        )}
                      </div>
                    )}
                  </Card>
                </DialogTrigger>
                
                <DialogContent className="max-w-4xl glass-card">
                  <div className="space-y-4">
                    <img
                      src={post.image_url!}
                      alt={post.content || 'Gallery image'}
                      className="w-full max-h-[70vh] object-contain rounded-lg"
                    />
                    {post.content && (
                      <div className="text-center">
                        <p className="text-foreground text-lg leading-relaxed mb-2">
                          {post.content}
                        </p>
                        {post.author_name && (
                          <p className="text-muted-foreground">
                            — {post.author_name}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">
                          {new Date(post.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              No Images Yet
            </h3>
            <p className="text-muted-foreground mb-8">
              Be the first to share a beautiful memory!
            </p>
            <Button 
              onClick={() => setShowAddForm(true)}
              size="lg" 
              className="gradient-sunset hover-scale"
            >
              Add First Memory
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;