import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name"),
  email: text("email").notNull().unique(),
  subscriptionTier: text("subscription_tier").notNull().default("gratuito"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  email: true,
  subscriptionTier: true,
});

// Research model
export const researches = pgTable("researches", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  product: text("product").notNull(),
  productCategory: text("product_category").notNull(),
  salesChannels: json("sales_channels").$type<string[]>().notNull(),
  country: text("country").notNull(),
  state: text("state").notNull(),
  city: text("city").notNull(),
  competitors: text("competitors"),
  autoFindCompetitors: boolean("auto_find_competitors").default(false),
  aspectsToAnalyze: json("aspects_to_analyze").$type<string[]>().notNull(),
  includeGoogleAnalytics: boolean("include_google_analytics").default(true),
  includeGoogleTrends: boolean("include_google_trends").default(true),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertResearchSchema = createInsertSchema(researches).pick({
  userId: true,
  title: true,
  product: true,
  productCategory: true,
  salesChannels: true,
  country: true,
  state: true,
  city: true,
  competitors: true,
  autoFindCompetitors: true,
  aspectsToAnalyze: true,
  includeGoogleAnalytics: true,
  includeGoogleTrends: true,
});

// Report model
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  researchId: integer("research_id").notNull(),
  userId: integer("user_id").notNull(),
  content: json("content").$type<ReportContent>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertReportSchema = createInsertSchema(reports).pick({
  researchId: true,
  userId: true,
  content: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Research = typeof researches.$inferSelect;
export type InsertResearch = z.infer<typeof insertResearchSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

export type ReportContent = {
  competitors: Competitor[];
  priceComparison?: PriceComparison;
  featureComparison?: FeatureComparison;
  marketPositioning?: MarketPositioning;
  marketShare?: MarketShare;
  googleAnalytics?: GoogleAnalyticsData;
  googleTrends?: GoogleTrendsData;
  conclusions: Conclusions;
};

export type GoogleAnalyticsData = {
  keywords: string[];
  trafficSources: {
    source: string;
    percentage: number;
  }[];
  averageTimeOnSite?: number;
  bounceRate?: number;
  analysis: string;
};

export type GoogleTrendsData = {
  interestOverTime: {
    month: string;
    value: number;
  }[];
  relatedTopics: {
    name: string;
    growth: string;
  }[];
  analysis: string;
};

export type Competitor = {
  name: string;
  website?: string;
  description?: string;
};

export type PriceComparison = {
  data: {
    competitor: string;
    price: number;
  }[];
  analysis: string;
};

export type FeatureComparison = {
  features: string[];
  data: {
    competitor: string;
    hasFeature: boolean[];
  }[];
  analysis: string;
};

export type MarketPositioning = {
  data: {
    competitor: string;
    x: number; // price (higher is more expensive)
    y: number; // quality/feature richness (higher is better)
    marketShare: number; // size of the bubble
  }[];
  analysis: string;
};

export type MarketShare = {
  data: {
    competitor: string;
    share: number;
  }[];
  analysis: string;
};

export type Conclusions = {
  findings: string[];
  opportunities: string[];
  recommendations: string[];
};

// Subscription tiers
export const subscriptionTiers = {
  GRATUITO: 'gratuito',
  INTERMEDIARIO: 'intermediario',
  AVANCADO: 'avancado'
};

// Limits per subscription tier
export const subscriptionLimits = {
  [subscriptionTiers.GRATUITO]: {
    researchesPerMonth: 5,
    featuresEnabled: ['basic_analysis', 'simple_reports', 'email_support']
  },
  [subscriptionTiers.INTERMEDIARIO]: {
    researchesPerMonth: 30,
    featuresEnabled: ['advanced_analysis', 'detailed_reports', 'pdf_export', 'priority_support']
  },
  [subscriptionTiers.AVANCADO]: {
    researchesPerMonth: Infinity,
    featuresEnabled: ['premium_analysis', 'customized_reports', 'integrations', 'team_management', '24_7_support']
  }
};
