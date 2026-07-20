import {
  pgTable,
  text,
  integer,
  numeric,
  timestamp,
  serial,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: numeric("original_price", { precision: 10, scale: 2 }),
  images: jsonb("images").$type<string[]>().notNull().default([]),
  categoryId: integer("category_id").references(() => categories.id),
  duration: text("duration"),
  location: text("location"),
  travelType: text("travel_type"), // family, couple, solo
  highlights: jsonb("highlights").$type<string[]>().default([]),
  included: jsonb("included").$type<string[]>().default([]),
  featured: boolean("featured").default(false),
  bestSeller: boolean("best_seller").default(false),
  maxGuests: integer("max_guests").default(10),
  rating: numeric("rating", { precision: 2, scale: 1 }).default("0"),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  authorName: text("author_name").notNull(),
  authorAvatar: text("author_avatar"),
  rating: integer("rating").notNull(),
  title: text("title"),
  content: text("content").notNull(),
  travelDate: text("travel_date"),
  travelType: text("travel_type"),
  verified: boolean("verified").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  quantity: integer("quantity").notNull().default(1),
  travelDate: text("travel_date"),
  guests: integer("guests").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone"),
  totalAmount: numeric("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("confirmed"),
  items: jsonb("items").$type<Array<{ productId: number; name: string; price: string; quantity: number; guests: number; travelDate: string }>>().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
