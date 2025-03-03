import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Database, LineChart, Settings, AlignJustify, X, Home, FileJson, LogOut, Flag, Network, Send, Key, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/assets", label: "Assets", icon: Database },
    { path: "/topology", label: "Topology", icon: Share2 },
    { path: "/banners", label: "Banners", icon: Flag },
    { path: "/capture", label: "Capture", icon: Network },
    { path: "/deploy", label: "Deploy", icon: Send },
    { path: "/data", label: "Data", icon: FileJson },
    { path: "/reports", label: "Reports", icon: LineChart },
    { path: "/auth", label: "Credentials", icon: Key },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex">
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-background border-r transition-transform duration-300 ease-in-out shadow-lg",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h1 className="text-2xl font-bold">THS|SEEKCAP</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-4 py-2 text-sm rounded-md transition-colors",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-secondary"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      <main className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        isSidebarOpen ? "ml-64" : "ml-0"
      )}>
        <div className="sticky top-0 z-40 flex items-center h-16 px-4 border-b bg-background/90 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-2"
          >
            <AlignJustify className="h-5 w-5" />
          </Button>
          <div className="flex-1"></div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
        <div className="container py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
