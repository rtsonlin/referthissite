import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCardSchema, insertReviewSchema, insertMailingListSchema } from "@shared/schema";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all cards
  app.get("/api/cards", async (req, res) => {
    try {
      const cards = await storage.getCards();
      res.json(cards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cards" });
    }
  });

  // Get cards by category
  app.get("/api/cards/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const cards = await storage.getCardsByCategory(category);
      res.json(cards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch cards by category" });
    }
  });

  // Get card by slug
  app.get("/api/cards/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const card = await storage.getCardBySlug(slug);
      if (!card) {
        return res.status(404).json({ error: "Card not found" });
      }
      res.json(card);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch card" });
    }
  });

  // Create card (for Google Sheets integration)
  app.post("/api/cards", async (req, res) => {
    try {
      const cardData = insertCardSchema.parse(req.body);
      const card = await storage.createCard(cardData);
      res.status(201).json(card);
    } catch (error) {
      res.status(400).json({ error: "Invalid card data" });
    }
  });

  // Get review by slug
  app.get("/api/reviews/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      
      // First check if review exists in storage
      let review = await storage.getReviewBySlug(slug);
      
      if (!review) {
        // Try to load from markdown file
        const contentPath = path.resolve(__dirname, "..", "content", "reviews", `${slug}.md`);
        
        try {
          const content = await fs.promises.readFile(contentPath, "utf-8");
          
          // Parse markdown frontmatter (simple approach)
          const lines = content.split('\n');
          let title = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          let coverImage = null;
          let markdownContent = content;
          
          if (lines[0] === '---') {
            const frontmatterEnd = lines.findIndex((line, index) => index > 0 && line === '---');
            if (frontmatterEnd > 0) {
              const frontmatter = lines.slice(1, frontmatterEnd);
              markdownContent = lines.slice(frontmatterEnd + 1).join('\n');
              
              frontmatter.forEach(line => {
                if (line.startsWith('title:')) {
                  title = line.replace('title:', '').trim().replace(/['"]/g, '');
                }
                if (line.startsWith('coverImage:')) {
                  coverImage = line.replace('coverImage:', '').trim().replace(/['"]/g, '');
                }
              });
            }
          }
          
          // Create and store the review
          const reviewData = {
            slug,
            title,
            content: markdownContent,
            coverImage
          };
          
          review = await storage.createReview(reviewData);
        } catch (fileError) {
          return res.status(404).json({ error: "Review not found" });
        }
      }
      
      res.json(review);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch review" });
    }
  });

  // Subscribe to mailing list
  app.post("/api/mailing-list", async (req, res) => {
    try {
      const entryData = insertMailingListSchema.parse(req.body);
      
      // Check if email already exists
      const existing = await storage.getMailingListEntry(entryData.email);
      if (existing) {
        return res.status(409).json({ error: "Email already subscribed" });
      }
      
      const entry = await storage.addToMailingList(entryData);
      
      // TODO: Integrate with Mailchimp API here
      const mailchimpApiKey = process.env.MAILCHIMP_API_KEY;
      const mailchimpListId = process.env.MAILCHIMP_LIST_ID;
      
      if (mailchimpApiKey && mailchimpListId) {
        try {
          // Mailchimp integration would go here
          console.log("Would integrate with Mailchimp:", entryData.email);
        } catch (mailchimpError) {
          console.error("Mailchimp integration failed:", mailchimpError);
        }
      }
      
      res.status(201).json({ success: true, message: "Successfully subscribed to mailing list" });
    } catch (error) {
      res.status(400).json({ error: "Invalid email address" });
    }
  });

  // Track events (for analytics)
  app.post("/api/track", async (req, res) => {
    try {
      const { event, data } = req.body;
      
      // TODO: Integrate with Google Analytics or other tracking service
      console.log("Tracking event:", event, data);
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to track event" });
    }
  });

  // Google Sheets webhook endpoint (for dynamic updates)
  app.post("/api/sheets-webhook", async (req, res) => {
    try {
      // TODO: Verify webhook signature from Google Sheets
      const { cards } = req.body;
      
      if (Array.isArray(cards)) {
        for (const cardData of cards) {
          try {
            const validatedCard = insertCardSchema.parse(cardData);
            await storage.createCard(validatedCard);
          } catch (validationError) {
            console.error("Invalid card data from sheets:", validationError);
          }
        }
      }
      
      res.json({ success: true, message: "Cards updated from Google Sheets" });
    } catch (error) {
      res.status(500).json({ error: "Failed to process sheets webhook" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
