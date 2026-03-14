import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Enrollments table to store student enrollment applications
 */
export const enrollments = mysqlTable("enrollments", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 255 }).notNull(),
  lastName: varchar("lastName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  courseLevel: varchar("courseLevel", { length: 100 }).notNull(),
  lineId: varchar("lineId", { length: 255 }),
  paymentSlipKey: varchar("paymentSlipKey", { length: 500 }),
  paymentSlipUrl: text("paymentSlipUrl"),
  message: text("message"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = typeof enrollments.$inferInsert;

/**
 * Downloadable resources table for sheets and exam archives
 */
export const resources = mysqlTable("resources", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  resourceType: mysqlEnum("resourceType", ["sheet", "exam", "other"]).notNull(),
  courseLevel: varchar("courseLevel", { length: 100 }), // e.g., "ม.1-3", "ม.4-6", etc.
  fileKey: varchar("fileKey", { length: 500 }).notNull(), // S3 file key
  fileUrl: text("fileUrl").notNull(), // S3 presigned URL or public URL
  fileName: varchar("fileName", { length: 255 }).notNull(),
  fileSize: int("fileSize"), // in bytes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Resource = typeof resources.$inferSelect;
export type InsertResource = typeof resources.$inferInsert;

/**
 * Course images table to store course thumbnails
 */
export const courseImages = mysqlTable("courseImages", {
  id: int("id").autoincrement().primaryKey(),
  courseLevel: varchar("courseLevel", { length: 100 }).notNull().unique(),
  imageKey: varchar("imageKey", { length: 500 }).notNull(),
  imageUrl: text("imageUrl").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CourseImage = typeof courseImages.$inferSelect;
export type InsertCourseImage = typeof courseImages.$inferInsert;
