import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { data: rows, error } = await supabase
        .from('app_state')
        .select('*')
        .eq('id', 'global')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!rows) {
        return res.status(200).json({ data: null });
      }

      return res.status(200).json({ data: rows });
    }

    if (req.method === 'POST') {
      const { data, user } = req.body;
      if (!data || typeof data !== 'object') {
        return res.status(400).json({ error: 'Invalid payload' });
      }

      const payload = {
        id: 'global',
        data: JSON.stringify(data),
        user: JSON.stringify(user),
      };

      const { error } = await supabase
        .from('app_state')
        .upsert(payload, { onConflict: 'id' });

      if (error) {
        throw error;
      }

      return res.status(200).json({ message: 'Saved' });
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error('API/state error:', error);
    return res.status(500).json({ error: error.message || 'Server error' });
  }
}
