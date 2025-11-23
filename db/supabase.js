import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wgexsjypvjqraxrtmllv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnZXhzanlwdmpxcmF4cnRtbGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4NzU0NTEsImV4cCI6MjA3ODQ1MTQ1MX0.gb08VLSzW1PUnyL6hR1QOej5zyPlGMa2cxnu6bQJmuI';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function logToDB(logData) {
  try {
    const { data, error } = await supabase
      .from('api_logs')
      .insert([{
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        ip_address: logData.ip_address || '0.0.0.0',
        user_agent: logData.user_agent || 'unknown',
        model: logData.model || 'unknown',
        language: logData.language || 'id',
        query: logData.query || '',
        response: logData.response || '',
        duration_ms: logData.duration_ms || 0,
        success: logData.success || false,
        error_message: logData.error_message || null
      }]);

    if (error) {
      console.error('Supabase logging error:', error.message);
    }
    return { success: !error };
  } catch (error) {
    console.error('Failed to log to Supabase:', error.message);
    return { success: false };
  }
}
