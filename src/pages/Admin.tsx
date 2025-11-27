import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Star, Filter, Trash2, User } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface FeedbackWithProfile {
  id: string;
  subject: string;
  message: string;
  rating: number;
  created_at: string;
  profiles: {
    name: string;
    email: string;
  };
}

export default function Admin() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<FeedbackWithProfile[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/");
      toast.error("Access denied. Admin privileges required.");
    } else if (user && isAdmin) {
      loadAllFeedback();
    }
  }, [user, isAdmin, loading, navigate]);

  const loadAllFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select(`
          *,
          profiles (
            name,
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFeedback(data || []);
    } catch (error) {
      console.error("Error loading feedback:", error);
      toast.error("Failed to load feedback");
    } finally {
      setLoadingFeedback(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this feedback?")) return;

    try {
      const { error } = await supabase.from("feedback").delete().eq("id", id);

      if (error) throw error;

      toast.success("Feedback deleted successfully");
      loadAllFeedback();
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete feedback");
    }
  };

  const filteredFeedback = ratingFilter === "all" 
    ? feedback 
    : feedback.filter(f => f.rating === parseInt(ratingFilter));

  if (loading || !user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage and review all user feedback submissions
          </p>
        </div>

        <Card className="mb-6 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-primary" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center">
              <Label className="text-sm font-medium">Rating:</Label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>All Feedback ({filteredFeedback.length})</CardTitle>
            <CardDescription>
              Review and manage user submissions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingFeedback ? (
              <p className="text-center text-muted-foreground py-8">Loading...</p>
            ) : filteredFeedback.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No feedback found matching the selected filters
              </p>
            ) : (
              <div className="space-y-4">
                {filteredFeedback.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-lg p-4 space-y-3 hover:shadow-soft transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <h3 className="font-semibold text-lg">{item.subject}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{item.profiles.name}</span>
                          <span>•</span>
                          <span>{item.profiles.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= item.rating
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm">{item.message}</p>
                    <p className="text-xs text-muted-foreground">
                      Submitted on {format(new Date(item.created_at), "PPpp")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
