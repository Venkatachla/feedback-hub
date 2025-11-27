import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { MessageSquare, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Navigation() {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold text-xl">
          <MessageSquare className="h-6 w-6 text-primary" />
          <span>FeedbackHub</span>
        </Link>
        
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button
                variant="ghost"
                onClick={() => navigate("/dashboard")}
                className="gap-2"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              {isAdmin && (
                <Button
                  variant="ghost"
                  onClick={() => navigate("/admin")}
                  className="gap-2"
                >
                  Admin
                </Button>
              )}
              <Button
                variant="outline"
                onClick={signOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate("/auth")}>
              Get Started
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
