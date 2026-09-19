import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xqsjiyetymgienbqgpey.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhxc2ppeWV0eW1naWVuYnFncGV5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTQ5NjM4NywiZXhwIjoyMTA1MDcyMzg3fQ._vXu6slDafJyjlHePnKNGzTfl_NzuVIgx-4iKbJN-38'
);

async function run() {
  const { data, error } = await supabase.auth.admin.updateUserById(
    'fb96f255-a276-4294-82d9-f8ad62c5749c',
    { password: '@03Kirsty&yeu05' }
  );
  console.log(error || 'Password set successfully:', data);
}

run();