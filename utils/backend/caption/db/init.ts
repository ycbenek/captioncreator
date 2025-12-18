// In-memory storage
interface Database {
  users: Map<string, any>;
  generations: Map<string, any>;
  rateLimits: Map<string, number[]>;
}

let db: Database;

export function getDatabase(): Database {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}

export async function initDatabase(): Promise<void> {
  db = {
    users: new Map(),
    generations: new Map(),
    rateLimits: new Map(),
  };

  console.log("✅ In-memory database initialized successfully");
}

export function closeDatabase(): void {
  if (db) {
    db.users.clear();
    db.generations.clear();
    db.rateLimits.clear();
  }
}
