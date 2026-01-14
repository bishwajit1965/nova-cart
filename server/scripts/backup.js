import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Emulate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== CONFIG =====
const SERVER_ROOT = path.resolve(__dirname, "..");
const BACKUP_DIR = path.join(SERVER_ROOT, "backups");
const TOOLS_DIR = path.join(SERVER_ROOT, "tools", "bin");
const MONGODUMP = path.join(TOOLS_DIR, "mongodump.exe");

const DB_NAME = "nova-cart";
const RETENTION_DAYS = 7;

// ==================

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Cleanup old backups
const cleanupOldBackups = async () => {
  const files = await fs.promises.readdir(BACKUP_DIR);
  const expiration = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;

  for (const file of files) {
    if (!file.endsWith(".gz")) continue;

    const fp = path.join(BACKUP_DIR, file);
    const stats = await fs.promises.stat(fp);

    if (stats.mtime.getTime() < expiration) {
      await fs.promises.unlink(fp);
      console.log(`🗑️ Deleted old backup: ${file}`);
    }
  }
};

// Create backup
const createBackup = () => {
  console.log("📦 Starting backup...");

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  const backupFile = path.join(BACKUP_DIR, `nova-cart-${timestamp}.gz`);

  const command = `"${MONGODUMP}" --db ${DB_NAME} --archive="${backupFile}" --gzip`;

  exec(command, async (error) => {
    if (error) {
      console.error("❌ Backup failed:", error.message);
      return;
    }

    console.log("✅ Backup created:", backupFile);
    await cleanupOldBackups();
  });
};

// Run once (manual backup)
createBackup();
