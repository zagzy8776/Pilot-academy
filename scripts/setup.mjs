import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'node:fs';
const sql = neon(process.env.DATABASE_URL);
for (const file of ['db/schema.sql', 'db/seed.sql']) {
  const statements = readFileSync(file, 'utf8').split(/;\s*\n/).map((s) => s.trim()).filter(Boolean);
  for (const s of statements) await sql.query(s);
  console.log('ran', file, statements.length, 'statements');
}
