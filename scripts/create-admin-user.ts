require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const email = process.argv[2];
const password = process.argv[3];
const adminName = process.argv[4] || '';

if (!email || !password) {
  console.error(
    'Usage: node scripts/create-admin-user.ts <email> <password> [name]'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function createAdminUser() {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { name: adminName, role: 'admin' },
    email_confirm: true
  });
  if (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  }
  console.log('Admin user created:', data.user);
}

createAdminUser();
