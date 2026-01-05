/**
 * @file check-password.ts
 * @description scripts/check-password.ts
 * @author github-actions[bot]
 * @created 2026-01-04
 * @updated 2026-01-04
 * @updates 1
 * @lines 21
 * @size 0.69 KB
 */
import bcrypt from "bcryptjs";

const hash = "JR28nO5EGffH1Pk2NJgCRcQk5kV9Lyy";

console.log("Hash format check:");
console.log("Hash:", hash);
console.log("Length:", hash.length);
console.log("Starts with $2?:", hash.startsWith("$2"));
console.log("\nThis does NOT appear to be a bcrypt hash.");
console.log("Bcrypt hashes typically:");
console.log("  - Start with $2a$, $2b$, or $2y$");
console.log("  - Are 60 characters long");
console.log("  - Cannot be decoded (one-way hash)");
console.log("\nIf this is stored as a password in your database, it should be:");
console.log("  - Hashed with bcrypt");
console.log("  - In the format: $2a$10$saltandhash...");

