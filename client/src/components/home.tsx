import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/search-bar";
import CardGrid from "@/components/card-grid";
import MailingListModal from "@/components/mailing-list-modal";
import { Card } from "@shared/schema";
import { trackEvent } from "@/lib/tracking";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("Affiliate");
  const [showMailingModal, setShowMailingModal] = useState(false);

  const { data: cards = [], isLoading } = useQuery<Card[]>({
    queryKey: ["/api/cards"],
  });

  const filteredCards = useMemo(() => {
    let filtered = cards;

    // Filter by active tab
    filtered = filtered.filter(card => card.category === activeTab);

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(card =>
        card.serviceName.toLowerCase().includes(query) ||
        card.offer.toLowerCase().includes(query) ||
        card.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [cards, activeTab, searchQuery]);

  const handleTabSwitch = (tab: string) => {
    setActiveTab(tab);
    trackEvent("tab_switch", { tab });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Search */}
      <div className="gradient-bg min-h-[60vh] flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Find Amazing{" "}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Deals
              </span>
            </h1>
            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
              Discover the best affiliate links, coupon codes, and exclusive offers all in one place
            </p>
            
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              data-testid="search-input"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Tab Navigation */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
            {["Affiliate", "Code", "Coupon"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabSwitch(tab)}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                }`}
                data-testid={`tab-${tab.toLowerCase()}`}
              >
                <i className={`mr-2 ${
                  tab === "Affiliate" ? "fas fa-link" :
                  tab === "Code" ? "fas fa-code" :
                  "fas fa-ticket-alt"
                }`}></i>
                {tab === "Affiliate" ? "Affiliate Links" :
                 tab === "Code" ? "Coupon Codes" :
                 "Special Offers"}
              </button>
            ))}
          </div>

          {/* Cards Grid */}
          <CardGrid 
            cards={filteredCards}
            isLoading={isLoading}
            onCardClick={() => {
              // Show mailing list modal after card interaction
              setTimeout(() => setShowMailingModal(true), 1500);
            }}
          />
        </div>

        {/* Mailing List CTA Section */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <div className="gradient-bg rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Never Miss a Deal!</h2>
              <p className="text-xl mb-8 text-gray-100">Join our list for weekly raffles and the latest codes!</p>
              <button 
                onClick={() => setShowMailingModal(true)}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                data-testid="button-join-mailing-list"
              >
                <i className="fas fa-envelope mr-2"></i>
                Join Mailing List
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-xl mb-4 text-card-foreground">DealFinder</h4>
              <p className="text-muted-foreground">Your ultimate destination for the best deals, coupons, and affiliate offers.</p>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-card-foreground">Categories</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><button onClick={() => handleTabSwitch("Affiliate")} className="hover:text-foreground transition-colors">Affiliate Links</button></li>
                <li><button onClick={() => handleTabSwitch("Code")} className="hover:text-foreground transition-colors">Coupon Codes</button></li>
                <li><button onClick={() => handleTabSwitch("Coupon")} className="hover:text-foreground transition-colors">Special Offers</button></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-card-foreground">Support</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4 text-card-foreground">Connect</h5>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 DealFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Mailing List Modal */}
      <MailingListModal 
        open={showMailingModal}
        onOpenChange={setShowMailingModal}
      />
    </div>
  );
}
