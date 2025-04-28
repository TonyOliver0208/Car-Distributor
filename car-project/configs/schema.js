import {
  integer,
  json,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const CarListing = pgTable("carListing", {
  id: serial("id").primaryKey(),
  listingTitle: varchar("listingTitle").notNull(),
  tagline: varchar("tagline"),
  originalPrice: varchar("originalPrice"),
  sellingPrice: varchar("sellingPrice").notNull(),
  category: varchar("category").notNull(),
  condition: varchar("condition").notNull(),
  // type: varchar("type").notNull(),
  make: varchar("make").notNull(),
  model: varchar("model").notNull(),
  year: varchar("year").notNull(),
  driveType: varchar("driveType").notNull(),
  transmission: varchar("transmission"),
  fuelType: varchar("fuelType").notNull(),
  mileage: varchar("mileage").notNull(),
  engineSize: varchar("engineSize"),
  cylinder: varchar("cylinder"),
  color: varchar("color").notNull(),
  door: varchar("door").notNull(),
  offerType: varchar("offerType"),
  vin: varchar("vin"),
  listingDescription: varchar("listingDescription").notNull(),
  features: json("features"),
  createdBy: varchar("createdBy").notNull(),
  userName: varchar("userName").notNull(),
  userImageUrl: varchar("userImageUrl"),
  postedOn: varchar("postedOn"),
});

export const CarImages = pgTable("carImages", {
  id: serial("id").primaryKey(),
  imageUrl: varchar("imageUrl").notNull(),
  publicId: varchar("publicId").notNull(),
  carListingId: integer("carListingId")
    .notNull()
    .references(() => CarListing.id),
});

export const Reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  carListingId: integer("carListingId")
    .notNull()
    .references(() => CarListing.id),
  userId: varchar("userId").notNull(),
  userEmail: varchar("userEmail").notNull(),
  userName: varchar("userName"),
  userImageUrl: varchar("userImageUrl"),
  rating: integer("rating"),
  comment: varchar("comment").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const Traffic = pgTable("traffic", {
  id: serial("id").primaryKey(),
  carListingId: integer("carListingId")
    .notNull()
    .references(() => CarListing.id),
  userId: varchar("userId").notNull(),
  accessedAt: timestamp("accessedAt").defaultNow(),
});
