import { Card } from "@/components/ui/card";

interface TimelineItem {
  id: string;
  title: string;
  date: string;
  description: string;
  image?: string;
}

const Story = () => {
  // Sample timeline data - in a real app, this could come from a database
  const timelineItems: TimelineItem[] = [
    {
      id: '1',
      title: 'The Beginning',
      date: 'Spring 2020',
      description: 'Every great friendship has a beginning, and ours started with laughter and shared dreams. From that very first conversation, it was clear that something special was taking root.',
    },
    {
      id: '2',
      title: 'Adventures Begin',
      date: 'Summer 2020',
      description: 'Our first adventures together - exploring new places, trying new things, and discovering how perfectly our personalities complemented each other. Every moment was a new memory in the making.',
    },
    {
      id: '3',
      title: 'Through Thick and Thin',
      date: 'Fall 2020',
      description: 'True friendship is tested not in the easy times, but in the challenging ones. This season showed us that our bond was stronger than any obstacle life could throw our way.',
    },
    {
      id: '4',
      title: 'Growing Together',
      date: 'Winter 2020',
      description: 'As the seasons changed, so did we - but always together. Supporting each other\'s dreams, celebrating victories, and learning from every experience we shared.',
    },
    {
      id: '5',
      title: 'The Golden Era',
      date: '2021 - Present',
      description: 'These have been the golden years of our friendship. Filled with inside jokes, spontaneous adventures, deep conversations, and an unbreakable bond that grows stronger with each passing day.',
    },
  ];

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Our Story
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A journey through the beautiful moments that shaped our friendship
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/50 transform md:-translate-x-0.5"></div>

          <div className="space-y-12">
            {timelineItems.map((item, index) => (
              <div
                key={item.id}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                } flex-col md:flex-row`}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background transform md:-translate-x-1/2 z-10 shadow-glow"></div>

                {/* Content card */}
                <div className={`w-full md:w-5/12 ml-12 md:ml-0 ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                  <Card className="glass-card p-8 hover-glow transition-gentle">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-primary font-medium text-sm uppercase tracking-wide">
                        {item.date}
                      </p>
                    </div>
                    
                    {item.image && (
                      <div className="mb-6">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full rounded-lg shadow-soft"
                        />
                      </div>
                    )}
                    
                    <p className="text-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </Card>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block w-5/12"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Closing message */}
        <div className="text-center mt-20">
          <Card className="glass-card p-12 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-6">
              To Be Continued...
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our story is far from over. With each day that passes, we write new chapters 
              filled with laughter, love, and unforgettable moments. Here's to many more 
              adventures together, Gauta! 💛
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Story;