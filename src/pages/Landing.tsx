import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Star, Shield, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-accent">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
          <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-medium">
            <MessageSquare className="h-8 w-8 text-white" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            FeedbackHub
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl">
            Collect, manage, and analyze user feedback with ease. 
            A simple, secure platform to help you understand your users better.
          </p>
          
          <div className="flex gap-4 pt-4">
            <Button 
              size="lg" 
              onClick={() => navigate(user ? "/dashboard" : "/auth")}
              className="text-lg px-8"
            >
              {user ? "Go to Dashboard" : "Get Started"}
            </Button>
            {!user && (
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/auth")}
                className="text-lg px-8"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose FeedbackHub?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to collect and manage feedback effectively
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Easy Ratings</CardTitle>
              <CardDescription>
                Simple 5-star rating system to quickly gauge user satisfaction
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Secure & Private</CardTitle>
              <CardDescription>
                Your data is protected with enterprise-grade security and encryption
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="shadow-soft hover:shadow-medium transition-shadow">
            <CardHeader>
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Admin Dashboard</CardTitle>
              <CardDescription>
                Powerful admin tools to view, filter, and manage all feedback
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto bg-gradient-primary text-white shadow-medium">
          <CardContent className="p-12 text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to get started?</h2>
            <p className="text-lg opacity-90">
              Join FeedbackHub today and start collecting valuable user feedback in minutes
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/auth")}
              className="text-lg px-8"
            >
              Create Free Account
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
