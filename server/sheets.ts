import { google } from "googleapis";
import { Card, InsertCard } from "@shared/schema";

interface SheetsRow {
  serviceName: string;
  category: string;
  offer: string;
  price: string;
  type: string;
  value: string;
  badge: string;
  slug: string;
  icon: string;
  imageUrl: string;
}

export class GoogleSheetsService {
  private sheets: any;
  private auth: any;
  
  constructor() {
    this.initializeAuth();
  }
  
  private async initializeAuth() {
    try {
      const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
      if (!serviceAccountKey) {
        console.error("Google Service Account JSON not found in environment variables");
        return;
      }
      
      const credentials = JSON.parse(serviceAccountKey);
      
      this.auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
      });
      
      this.sheets = google.sheets({ version: 'v4', auth: this.auth });
    } catch (error) {
      console.error("Failed to initialize Google Sheets auth:", error);
    }
  }
  
  async fetchCardsFromSheet(sheetId: string, range: string = "Sheet1!A2:J"): Promise<Card[]> {
    try {
      if (!this.sheets) {
        await this.initializeAuth();
      }
      
      if (!this.sheets) {
        console.error("Google Sheets not initialized");
        return [];
      }
      
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: range,
      });
      
      const rows = response.data.values || [];
      
      return rows.map((row: string[], index: number) => {
        // Ensure we have all required fields, use defaults if missing
        const [
          serviceName = '',
          category = 'Affiliate',
          offer = '',
          price = '',
          type = 'link',
          value = '',
          badge = '',
          slug = '',
          icon = 'fas fa-gift',
          imageUrl = ''
        ] = row;
        
        // Generate unique ID for each card
        const id = `sheet-card-${index}-${Date.now()}`;
        
        const card: Card = {
          id,
          serviceName: serviceName.trim(),
          category: category.trim(),
          offer: offer.trim(),
          price: price.trim(),
          type: type.trim() as 'link' | 'code',
          value: value.trim(),
          badge: badge.trim() || null,
          slug: slug.trim() || serviceName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          icon: icon.trim(),
          imageUrl: imageUrl.trim() || null,
          createdAt: new Date(),
        };
        
        return card;
      }).filter(card => card.serviceName && card.offer && card.value); // Filter out empty rows
      
    } catch (error) {
      console.error("Error fetching data from Google Sheets:", error);
      return [];
    }
  }
}

export const sheetsService = new GoogleSheetsService();