import { type User, type InsertUser, type Card, type InsertCard, type Review, type InsertReview, type MailingListEntry, type InsertMailingListEntry } from "@shared/schema";
import { randomUUID } from "crypto";
import { sheetsService } from "./sheets";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getCards(): Promise<Card[]>;
  getCardsByCategory(category: string): Promise<Card[]>;
  getCardBySlug(slug: string): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;
  
  getReviews(): Promise<Review[]>;
  getReviewBySlug(slug: string): Promise<Review | undefined>;
  createReview(review: InsertReview): Promise<Review>;
  
  addToMailingList(entry: InsertMailingListEntry): Promise<MailingListEntry>;
  getMailingListEntry(email: string): Promise<MailingListEntry | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private cards: Map<string, Card>;
  private reviews: Map<string, Review>;
  private mailingList: Map<string, MailingListEntry>;
  private sheetsCards: Card[] = [];
  private lastSheetsUpdate: number = 0;
  private readonly SHEET_ID = "1FuWHFumP982YO29qJtDbdGYX8BvjtrWDB0Q0MIXWb9Q";
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.users = new Map();
    this.cards = new Map();
    this.reviews = new Map();
    this.mailingList = new Map();
    
    // Initialize with sample data as fallback
    this.initializeSampleData();
    
    // Load data from Google Sheets
    this.loadCardsFromSheets();
  }

  private initializeSampleData() {
    // Sample cards data
    const sampleCards: Card[] = [
      {
        id: randomUUID(),
        serviceName: "Amazon Prime",
        category: "Affiliate",
        offer: "Get 30 days free trial + exclusive deals on thousands of products",
        price: "Free",
        type: "link",
        value: "https://amazon.com/prime",
        badge: "HOT",
        slug: "amazon-prime",
        icon: "fas fa-shopping-bag",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/300px-Amazon_logo.svg.png",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        serviceName: "Spotify Premium",
        category: "Affiliate",
        offer: "3 months of ad-free music streaming with offline downloads",
        price: "$0.99",
        type: "link",
        value: "https://spotify.com/premium",
        badge: "NEW",
        slug: "spotify-premium",
        icon: "fas fa-music",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/300px-Spotify_logo_without_text.svg.png",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        serviceName: "Udemy Courses",
        category: "Affiliate",
        offer: "Access to over 1000+ programming and design courses",
        price: "$19.99",
        type: "link",
        value: "https://udemy.com/courses",
        badge: "LIMITED",
        slug: "udemy-courses",
        icon: "fas fa-laptop-code",
        imageUrl: "https://www.udemy.com/staticx/udemy/images/v7/logo-udemy.svg",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        serviceName: "DoorDash",
        category: "Code",
        offer: "Get $10 off your first order with free delivery",
        price: "$10 OFF",
        type: "code",
        value: "SAVE10NOW",
        badge: "TRENDING",
        slug: "doordash-discount",
        icon: "fas fa-pizza-slice",
        imageUrl: "https://cdn.iconscout.com/icon/free/png-256/free-doordash-logo-icon-download-in-svg-png-gif-file-formats--delivery-food-brand-logos-icons-1652230.png",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        serviceName: "Nike Store",
        category: "Code",
        offer: "25% off on all sneakers and athletic wear",
        price: "25% OFF",
        type: "code",
        value: "NIKE25OFF",
        badge: "EXCLUSIVE",
        slug: "nike-discount",
        icon: "fas fa-tshirt",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/300px-Logo_NIKE.svg.png",
        createdAt: new Date(),
      },
      {
        id: randomUUID(),
        serviceName: "McDonald's",
        category: "Coupon",
        offer: "Buy one Big Mac, get one free + free medium fries",
        price: "BOGO",
        type: "code",
        value: "BIGMAC2024",
        badge: "FLASH SALE",
        slug: "mcdonalds-bogo",
        icon: "fas fa-utensils",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McDonald%27s_Golden_Arches.svg/300px-McDonald%27s_Golden_Arches.svg.png",
        createdAt: new Date(),
      },
    ];

    sampleCards.forEach(card => {
      this.cards.set(card.id, card);
    });
  }

  private async loadCardsFromSheets(): Promise<void> {
    try {
      console.log("Loading cards from Google Sheets...");
      const sheetsCards = await sheetsService.fetchCardsFromSheet(this.SHEET_ID);
      
      if (sheetsCards.length > 0) {
        this.sheetsCards = sheetsCards;
        this.lastSheetsUpdate = Date.now();
        console.log(`Successfully loaded ${sheetsCards.length} cards from Google Sheets`);
      } else {
        console.log("No cards found in Google Sheets, using sample data");
      }
    } catch (error) {
      console.error("Failed to load cards from Google Sheets:", error);
      console.log("Falling back to sample data");
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCards(): Promise<Card[]> {
    // Refresh from sheets if cache is stale
    const now = Date.now();
    if (now - this.lastSheetsUpdate > this.CACHE_DURATION) {
      await this.loadCardsFromSheets();
    }
    
    // Return sheets data if available, otherwise fallback to sample data
    return this.sheetsCards.length > 0 ? this.sheetsCards : Array.from(this.cards.values());
  }

  async getCardsByCategory(category: string): Promise<Card[]> {
    const allCards = await this.getCards();
    return allCards.filter(card => card.category === category);
  }

  async getCardBySlug(slug: string): Promise<Card | undefined> {
    const allCards = await this.getCards();
    return allCards.find(card => card.slug === slug);
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const id = randomUUID();
    const card: Card = { 
      ...insertCard, 
      id, 
      createdAt: new Date() 
    };
    this.cards.set(id, card);
    return card;
  }

  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }

  async getReviewBySlug(slug: string): Promise<Review | undefined> {
    return Array.from(this.reviews.values()).find(review => review.slug === slug);
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const id = randomUUID();
    const review: Review = { 
      ...insertReview, 
      id, 
      createdAt: new Date() 
    };
    this.reviews.set(id, review);
    return review;
  }

  async addToMailingList(insertEntry: InsertMailingListEntry): Promise<MailingListEntry> {
    const id = randomUUID();
    const entry: MailingListEntry = { 
      ...insertEntry, 
      id, 
      subscribedAt: new Date() 
    };
    this.mailingList.set(id, entry);
    return entry;
  }

  async getMailingListEntry(email: string): Promise<MailingListEntry | undefined> {
    return Array.from(this.mailingList.values()).find(entry => entry.email === email);
  }
}

export const storage = new MemStorage();
