const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="mb-8">
          <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
            <div className="w-8 h-8 bg-primary-foreground rounded-sm"></div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Placeholder Page
          </h1>
          <p className="text-muted-foreground">
            Ready for your new project files
          </p>
        </div>
        
        <div className="space-y-3">
          <div className="h-2 bg-muted rounded w-full"></div>
          <div className="h-2 bg-muted rounded w-3/4 mx-auto"></div>
          <div className="h-2 bg-muted rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
