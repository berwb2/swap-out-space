import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const WriteLetter = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author_name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim() || !formData.author_name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('letters')
        .insert({
          title: formData.title.trim(),
          content: formData.content.trim(),
          author_name: formData.author_name.trim(),
        });

      if (error) throw error;

      toast({
        title: "Letter Sent!",
        description: "Your heartfelt letter has been shared with love",
      });

      navigate('/letters');
    } catch (error) {
      console.error('Error submitting letter:', error);
      toast({
        title: "Error",
        description: "Failed to send letter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Write a Letter
          </h1>
          <p className="text-lg text-muted-foreground">
            Share your thoughts, memories, and appreciation for Gauta
          </p>
        </div>

        <Card className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="author" className="text-lg font-medium">
                Your Name
              </Label>
              <Input
                id="author"
                value={formData.author_name}
                onChange={(e) => setFormData(prev => ({ ...prev, author_name: e.target.value }))}
                placeholder="Enter your name"
                className="mt-2"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <Label htmlFor="title" className="text-lg font-medium">
                Letter Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Give your letter a meaningful title"
                className="mt-2"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <Label htmlFor="content" className="text-lg font-medium">
                Your Message
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your heartfelt message here..."
                rows={12}
                className="mt-2 resize-none"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/letters')}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 gradient-sunset hover-scale"
              >
                {isSubmitting ? 'Sending...' : 'Send Letter'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default WriteLetter;