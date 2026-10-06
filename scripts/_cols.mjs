import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
const rows = await sql`
  select table_name, column_name, is_nullable, data_type
  from information_schema.columns
  where table_schema = 'public'
    and table_name in ('programs', 'rates', 'faqs', 'training_steps')
  order by table_name, ordinal_position`;
for (const c of rows) {
  console.log(`${c.table_name}.${c.column_name} | ${c.data_type} | nullable=${c.is_nullable}`);
}
