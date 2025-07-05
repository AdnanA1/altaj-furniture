import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow access if the user is authenticated and is an admin
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  const {
    data: { user },
    error
  } = await supabase.auth.getUser(token);
  if (error || !user) return res.status(401).json({ error: 'Unauthorized' });
  // Only allow admins
  if (user.app_metadata?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admins only' });
  }
  // You may want to check for a custom claim or role here

  if (req.method === 'GET') {
    // List all admin users (Supabase users with admin role)
    const { data, error } = await supabase.auth.admin.listUsers();
    if (error) return res.status(500).json({ error: error.message });
    // Filter users with 'admin' role in user_metadata
    const admins = data.users.filter((u) => u.user_metadata?.role === 'admin');
    return res.status(200).json(admins);
  }
  if (req.method === 'POST') {
    // Create a new admin user
    const { email, password, name } = req.body;
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: 'admin' },
      email_confirm: true
    });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(201).json(data.user);
  }
  if (req.method === 'PUT') {
    // Update an admin user
    const { id, name } = req.body;
    const { data, error } = await supabase.auth.admin.updateUserById(id, {
      user_metadata: { name, role: 'admin' }
    });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data.user);
  }
  if (req.method === 'DELETE') {
    // Delete an admin user by id
    const { id } = req.body;
    const { error } = await supabase.auth.admin.deleteUser(id);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(204).end();
  }
  res.status(405).json({ error: 'Method not allowed' });
}
