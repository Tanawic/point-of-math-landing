import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, enrollments, InsertEnrollment, resources, InsertResource } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Create a new enrollment record
 */
export async function createEnrollment(enrollment: InsertEnrollment) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(enrollments).values(enrollment);
  return result;
}

/**
 * Get all enrollments (for admin)
 */
export async function getAllEnrollments() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(enrollments).orderBy(enrollments.createdAt);
}

/**
 * Create a new resource (sheet or exam archive)
 */
export async function createResource(resource: InsertResource) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(resources).values(resource);
  return result;
}

/**
 * Get all resources, optionally filtered by type and course level
 */
export async function getResources(resourceType?: string, courseLevel?: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  let query = db.select().from(resources);
  
  // Note: Drizzle doesn't support complex WHERE with AND easily in this pattern,
  // so we'll fetch all and filter in JS, or you can write raw SQL
  const allResources = await query;
  
  return allResources.filter(r => {
    if (resourceType && r.resourceType !== resourceType) return false;
    if (courseLevel && r.courseLevel !== courseLevel) return false;
    return true;
  });
}

/**
 * Get all resources by type
 */
export async function getResourcesByType(resourceType: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const allResources = await db.select().from(resources);
  return allResources.filter(r => r.resourceType === resourceType);
}

/**
 * Delete a resource
 */
export async function deleteResource(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.delete(resources).where(eq(resources.id, id));
}
