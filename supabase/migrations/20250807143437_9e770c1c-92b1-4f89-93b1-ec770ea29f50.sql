-- Create letters table for the letters section
CREATE TABLE public.letters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security for letters
ALTER TABLE public.letters ENABLE ROW LEVEL SECURITY;

-- Create policies for letters (anyone can view and create)
CREATE POLICY "Letters are viewable by everyone" 
ON public.letters 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create letters" 
ON public.letters 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for automatic timestamp updates on letters
CREATE TRIGGER update_letters_updated_at
BEFORE UPDATE ON public.letters
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for letters table
ALTER PUBLICATION supabase_realtime ADD TABLE public.letters;