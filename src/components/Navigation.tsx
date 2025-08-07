import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/tributes", label: "Tribute Wall" },
    { path: "/comic", label: "The Comic" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b pointer-events-auto">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary hover-glow transition-gentle">
            Gauta-Sunbeam
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-gentle hover:text-primary cursor-pointer",
                  location.pathname === item.path
                    ? "text-primary text-glow"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile menu */}
          <div className="md:hidden">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "text-sm font-medium transition-gentle hover:text-primary cursor-pointer",
                    location.pathname === item.path
                      ? "text-primary text-glow"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;