import { Card as CardType } from "@shared/schema";
import DealCard from "./deal-card";

interface CardGridProps {
  cards: CardType[];
  isLoading: boolean;
  onCardClick?: () => void;
}

export default function CardGrid({ cards, isLoading, onCardClick }: CardGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card-gradient rounded-2xl p-6 shadow-lg border border-border animate-pulse">
            <div className="w-12 h-12 bg-gray-300 rounded-xl mb-4"></div>
            <div className="h-6 bg-gray-300 rounded mb-2"></div>
            <div className="h-16 bg-gray-300 rounded mb-4"></div>
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-12 bg-gray-300 rounded"></div>
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fas fa-search text-3xl text-muted-foreground"></i>
        </div>
        <h3 className="text-2xl font-bold text-card-foreground mb-2">No deals found</h3>
        <p className="text-muted-foreground">Try adjusting your search or browse different categories.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cards.map((card) => (
        <DealCard 
          key={card.id} 
          card={card} 
          onInteraction={onCardClick}
        />
      ))}
    </div>
  );
}
