import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const cards = pgTable("cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  serviceName: text("service_name").notNull(),
  category: text("category").notNull(), // 'Affiliate', 'Code', 'Coupon'
  offer: text("offer").notNull(),
  price: text("price"),
  type: text("type").notNull(), // 'link' or 'code'
  value: text("value").notNull(), // URL or coupon string
  badge: text("badge"), // 'HOT', 'NEW', 'LIMITED', etc.
  slug: text("slug").notNull().unique(),
  icon: text("icon"), // FontAwesome icon class
  imageUrl: text("image_url"), // Company logo URL
  createdAt: timestamp("created_at").defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mailingList = pgTable("mailing_list", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCardSchema = createInsertSchema(cards).omit({
  id: true,
  createdAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export const insertMailingListSchema = createInsertSchema(mailingList).omit({
  id: true,
  subscribedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Card = typeof cards.$inferSelect;
export type InsertCard = z.infer<typeof insertCardSchema>;
export type Review = typeof reviews.$inferSelect;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type MailingListEntry = typeof mailingList.$inferSelect;
export type InsertMailingListEntry = z.infer<typeof insertMailingListSchema>;
