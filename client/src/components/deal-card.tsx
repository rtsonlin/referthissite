import { useState } from "react";
import { useLocation } from "wouter";
import { Card as CardType } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/tracking";
import { Copy, ExternalLink, Star } from "lucide-react";

interface DealCardProps {
  card: CardType;
  onInteraction?: () => void;
}

export default function DealCard({ card, onInteraction }: DealCardProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = async () => {
    if (card.type === "link") {
      // Track affiliate link click
      await trackEvent("affiliate_click", {
        serviceName: card.serviceName,
        category: card.category,
        value: card.value,
      });

      toast({
        title: "Redirecting to offer...",
        description: "Opening deal in a new tab",
      });

      // Redirect to affiliate link
      window.open(card.value, "_blank");
    } else if (card.type === "code") {
      // Copy coupon code to clipboard
      try {
        await navigator.clipboard.writeText(card.value);
        
        await trackEvent("code_copy", {
          serviceName: card.serviceName,
          category: card.category,
          code: card.value,
        });

        toast({
          title: "Code copied!",
          description: `Coupon code "${card.value}" copied to clipboard`,
        });
      } catch (error) {
        toast({
          title: "Failed to copy",
          description: "Please copy the code manually",
          variant: "destructive",
        });
      }
    }

    onInteraction?.();
  };

  const handleReviewClick = () => {
    setLocation(`/reviews/${card.slug}`);
  };

  const getGradientClass = () => {
    const gradients = [
      "from-blue-600 to-purple-600",
      "from-pink-600 to-red-600", 
      "from-green-600 to-teal-600",
      "from-orange-500 to-yellow-600",
      "from-indigo-500 to-blue-600",
      "from-red-500 to-pink-600",
    ];
    return gradients[Math.abs(card.serviceName.charCodeAt(0) % gradients.length)];
  };

  const getIconBgGradient = () => {
    const gradients = [
      "from-blue-500 to-purple-600",
      "from-pink-500 to-red-600",
      "from-green-500 to-teal-600", 
      "from-yellow-500 to-orange-600",
      "from-indigo-500 to-blue-600",
      "from-red-500 to-pink-600",
    ];
    return gradients[Math.abs(card.serviceName.charCodeAt(0) % gradients.length)];
  };

  const getBadgeGradient = () => {
    switch (card.badge?.toUpperCase()) {
      case "HOT":
        return "from-red-500 to-orange-500";
      case "NEW":
        return "from-green-500 to-emerald-600";
      case "LIMITED":
        return "from-orange-500 to-yellow-600";
      case "TRENDING":
        return "from-purple-500 to-pink-600";
      case "EXCLUSIVE":
        return "from-purple-500 to-pink-600";
      case "FLASH SALE":
        return "from-red-500 to-pink-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  return (
    <div 
      className="group relative card-gradient rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-border overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`card-${card.serviceName.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Badge */}
      {card.badge && (
        <div className={`absolute top-4 right-4 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <span className={`bg-gradient-to-r ${getBadgeGradient()} text-white px-3 py-1 rounded-full text-sm font-semibold`}>
            {card.badge}
          </span>
        </div>
      )}
      
      <div className="mb-4">
        {/* Logo/Icon */}
        <div className="w-12 h-12 mb-4">
          {card.imageUrl ? (
            <img 
              src={card.imageUrl} 
              alt={`${card.serviceName} logo`}
              className="w-full h-full object-contain rounded-xl bg-white p-2 shadow-md"
              onError={(e) => {
                // Fallback to icon if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallbackDiv = target.nextElementSibling as HTMLDivElement;
                if (fallbackDiv) fallbackDiv.style.display = 'flex';
              }}
              data-testid={`img-logo-${card.serviceName.toLowerCase().replace(/\s+/g, '-')}`}
            />
          ) : null}
          <div 
            className={`w-12 h-12 bg-gradient-to-br ${getIconBgGradient()} rounded-xl flex items-center justify-center ${card.imageUrl ? 'hidden' : 'block'}`}
            style={{ display: card.imageUrl ? 'none' : 'flex' }}
          >
            <i className={`${card.icon || 'fas fa-gift'} text-white text-xl`}></i>
          </div>
        </div>
        
        {/* Service Info */}
        <h3 className="text-xl font-bold text-card-foreground mb-2" data-testid={`text-service-${card.serviceName.toLowerCase().replace(/\s+/g, '-')}`}>
          {card.serviceName}
        </h3>
        <p className="text-muted-foreground mb-4" data-testid={`text-offer-${card.serviceName.toLowerCase().replace(/\s+/g, '-')}`}>
          {card.offer}
        </p>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-accent" data-testid={`text-price-${card.serviceName.toLowerCase().replace(/\s+/g, '-')}`}>
            {card.price}
          </span>
          {card.type === "link" && (
            <span className="text-sm text-muted-foreground">
              {card.category === "Affiliate" ? "Great Value" : "Special Offer"}
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        {/* Main Action Button */}
        {card.type === "link" ? (
          <Button 
            onClick={handleCardClick}
            className={`w-full bg-gradient-to-r ${getGradientClass()} text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105`}
            data-testid={`button-get-deal-${card.serviceName.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Get Deal
          </Button>
        ) : (
          <div className="space-y-3">
            {/* Code Display */}
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <code className="text-lg font-mono font-bold text-gray-800" data-testid={`text-code-${card.serviceName.toLowerCase().replace(/\s+/g, '-')}`}>
                  {card.value}
                </code>
                <Button 
                  onClick={handleCardClick}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                  data-testid={`button-copy-code-${card.serviceName.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Copy className="mr-1 h-4 w-4" />
                  Copy
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Reviews Button */}
        <Button 
          variant="outline"
          onClick={handleReviewClick}
          className="w-full border-2 border-primary text-primary py-2 px-6 rounded-xl font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
          data-testid={`button-view-reviews-${card.serviceName.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <Star className="mr-2 h-4 w-4" />
          View Reviews
        </Button>
      </div>
    </div>
  );
}
