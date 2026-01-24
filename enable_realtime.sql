-- 1. Enable Realtime for the products table
-- This allows the website to receive instant updates when you change data
alter publication supabase_realtime add table products;

-- 2. Ensure Public Access (Row Level Security)
-- This ensures that your website visitors (who are not logged in) can READ the data
alter table products enable row level security;

create policy "Allow Public Read" 
on products 
for select 
to anon
using (true);
