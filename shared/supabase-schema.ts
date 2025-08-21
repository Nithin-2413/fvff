import { pgTable, text, timestamp, uuid, varchar, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const writtenHug = pgTable("written_hug", {
  id: uuid("id").primaryKey().defaultRandom(),
  Name: text("Name"),
  Date: timestamp("Date", { withTimezone: true }).defaultNow(),
  "Recipient's Name": text("Recipient's Name"),
  Status: varchar("Status"),
  "Email Address": varchar("Email Address"),
  "Phone Number": doublePrecision("Phone Number"),
  "Type of Message": varchar("Type of Message"),
  "Message Details": varchar("Message Details"),
  Feelings: varchar("Feelings"),
  Story: varchar("Story"),
  "Specific Details": varchar("Specific Details"),
  "Delivery Type": varchar("Delivery Type"),
  location_city: text("location_city"),
  latitude: doublePrecision("latitude").notNull(), // Mandatory exact latitude
  longitude: doublePrecision("longitude").notNull(), // Mandatory exact longitude  
  device: text("device"), // Device name/info
});

export const hugReplies = pgTable("hug_replies", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  hugid: uuid("hugid").references(() => writtenHug.id, { onDelete: "cascade" }),
  sender_type: text("sender_type"), // 'admin' or 'client'
  sender_name: text("sender_name"),
  message: text("message"),
  is_read: text("is_read").default("false"), // Add missing column
  email_sent: text("email_sent").default("false"), // Add missing column
});

export const adminLogins = pgTable("admin_logins", {
  id: uuid("id").primaryKey().defaultRandom(),
  created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
  location: text("location"),
  user_agent: text("user_agent"),
  ip_address: text("ip_address"),
});

export const insertWrittenHugSchema = createInsertSchema(writtenHug).omit({
  id: true,
  Date: true,
}).extend({
  latitude: z.number().min(-90).max(90, "Invalid latitude coordinates"),
  longitude: z.number().min(-180).max(180, "Invalid longitude coordinates"),
});

export const insertHugReplySchema = createInsertSchema(hugReplies).omit({
  id: true,
  created_at: true,
});

export type InsertWrittenHug = z.infer<typeof insertWrittenHugSchema>;
export type WrittenHug = typeof writtenHug.$inferSelect;
export type InsertHugReply = z.infer<typeof insertHugReplySchema>;
export type HugReply = typeof hugReplies.$inferSelect;