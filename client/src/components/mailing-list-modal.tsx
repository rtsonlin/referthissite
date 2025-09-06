import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Gift, Mail, X } from "lucide-react";

interface MailingListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MailingListModal({ open, onOpenChange }: MailingListModalProps) {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await apiRequest("POST", "/api/mailing-list", { email });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Successfully subscribed!",
        description: "Welcome to our community! Check your email for a confirmation.",
      });
      setEmail("");
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    subscribeMutation.mutate(email);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bounce-in">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="sr-only">Join Our Mailing List</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6"
              data-testid="button-close-modal"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Gift className="text-white text-2xl h-8 w-8" />
          </div>
          
          <h3 className="text-2xl font-bold text-card-foreground mb-4" data-testid="text-modal-title">
            Join Our Community!
          </h3>
          <p className="text-muted-foreground mb-6" data-testid="text-modal-description">
            Get exclusive deals, weekly raffles, and early access to the hottest coupons!
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              type="email" 
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary bg-input text-foreground"
              disabled={subscribeMutation.isPending}
              data-testid="input-email"
            />
            <Button 
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              disabled={subscribeMutation.isPending}
              data-testid="button-subscribe"
            >
              {subscribeMutation.isPending ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Subscribing...
                </div>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Subscribe Now
                </>
              )}
            </Button>
          </form>
          
          <button 
            onClick={() => onOpenChange(false)}
            className="mt-4 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-maybe-later"
          >
            Maybe later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
