import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Star } from "lucide-react";
import { Review } from "@shared/schema";

export default function ReviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();

  const { data: review, isLoading, error } = useQuery<Review>({
    queryKey: ["/api/reviews", slug],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !review) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <div className="text-destructive mb-4">
              <i className="fas fa-exclamation-circle text-4xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-card-foreground mb-4">Review Not Found</h1>
            <p className="text-muted-foreground mb-6">
              Sorry, we couldn't find the review you're looking for.
            </p>
            <Button onClick={() => setLocation("/")} data-testid="button-back-home">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-bg py-8">
        <div className="container mx-auto px-4">
          <Button 
            variant="secondary"
            onClick={() => setLocation("/")}
            className="mb-4"
            data-testid="button-back-home"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4" data-testid="text-review-title">
              {review.title}
            </h1>
            <div className="flex items-center space-x-4 text-gray-200">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span>Review</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {review.coverImage && (
            <div className="mb-8">
              <img 
                src={review.coverImage}
                alt={review.title}
                className="w-full h-64 object-cover rounded-2xl shadow-lg"
                data-testid="img-cover"
              />
            </div>
          )}

          <Card className="card-gradient border-0 shadow-xl">
            <CardContent className="p-8">
              <div 
                className="prose prose-lg max-w-none text-card-foreground"
                dangerouslySetInnerHTML={{ __html: formatMarkdownContent(review.content) }}
                data-testid="text-review-content"
              />
            </CardContent>
          </Card>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <Card className="gradient-bg border-0 text-white">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Ready to Get This Deal?</h3>
                <p className="text-gray-200 mb-6">
                  Join thousands of savvy shoppers who never miss out on the best offers!
                </p>
                <Button 
                  variant="secondary"
                  size="lg"
                  onClick={() => setLocation("/")}
                  data-testid="button-get-deal"
                >
                  <i className="fas fa-shopping-bag mr-2"></i>
                  Get This Deal
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple markdown to HTML converter for basic formatting
function formatMarkdownContent(content: string): string {
  return content
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-3 mt-6">$1</h2>')
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mb-2 mt-4">$1</h3>')
    .replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold">$1</strong>')
    .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
    .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
    .replace(/\n\n/gim, '</p><p class="mb-4">')
    .replace(/^(.*)$/gim, '<p class="mb-4">$1</p>')
    .replace(/<p class="mb-4"><li/gim, '<ul class="list-disc ml-6 mb-4"><li')
    .replace(/<\/li><\/p>/gim, '</li></ul>');
}
