import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { Star, Send, History } from "lucide-react";
import { z } from "zod";
import { format } from "date-fns";

const feedbackSchema = z.object({
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(200, "Subject too long"),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000, "Message too long"),
  rating: z.number().min(1, "Please select a rating").max(5, "Invalid rating"),
});

interface Feedback {
  id: string;
  subject: string;
  message: string;
  rating: number;
  created_at: string;
}

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [myFeedback, setMyFeedback] = useState<Feedback[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(true);

  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    rating: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (user) {
      loadMyFeedback();
    }
  }, [user, loading, navigate]);

  const loadMyFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMyFeedback(data || []);
    } catch (error) {
      console.error("Error loading feedback:", error);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const validated = feedbackSchema.parse(formData);
      setSubmitting(true);

      const { error } = await supabase.from("feedback").insert({
        user_id: user?.id,
        subject: validated.subject,
        message: validated.message,
        rating: validated.rating,
      });

      if (error) throw error;

      toast.success("Feedback submitted successfully!");
      setFormData({ subject: "", message: "", rating: 0 });
      loadMyFeedback();
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message);
      } else {
        toast.error("Failed to submit feedback");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Submit Feedback</h1>
          <p className="text-muted-foreground">
            Share your thoughts and help us improve our service
          </p>
        </div>

        <Card className="mb-8 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              New Feedback
            </CardTitle>
            <CardDescription>
              Tell us what you think. Your feedback is valuable to us.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Brief description of your feedback"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  required
                  maxLength={200}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Provide detailed feedback here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  maxLength={1000}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {formData.message.length}/1000 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label>Rating</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="transition-transform hover:scale-110 focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= formData.rating
                            ? "fill-primary text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? "Submitting..." : "Submit Feedback"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              My Feedback History
            </CardTitle>
            <CardDescription>
              View all your previously submitted feedback
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingFeedback ? (
              <p className="text-center text-muted-foreground py-8">Loading...</p>
            ) : myFeedback.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No feedback submitted yet. Be the first to share your thoughts!
              </p>
            ) : (
              <div className="space-y-4">
                {myFeedback.map((feedback) => (
                  <div
                    key={feedback.id}
                    className="border rounded-lg p-4 space-y-2 hover:shadow-soft transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold">{feedback.subject}</h3>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= feedback.rating
                                ? "fill-primary text-primary"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{feedback.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(feedback.created_at), "PPpp")}
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
