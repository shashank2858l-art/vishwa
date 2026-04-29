const https = require('https');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const url = new URL(process.env.SUPABASE_URL + '/rest/v1/rpc/');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use the Supabase Management API to run SQL
const mgmtUrl = process.env.SUPABASE_URL.replace('.supabase.co', '.supabase.co') + '/rest/v1/';

// Try a simple approach: just insert a test and see if columns exist
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, key);

async function addColumns() {
  // Try to select the new columns
  const { data, error } = await supabase
    .from('complaints')
    .select('id, ai_decision')
    .limit(1);

  if (error) {
    console.log('Columns missing. Trying to add via SQL function...');
    
    // Create a temporary function to run ALTER TABLE
    const { error: funcError } = await supabase.rpc('', {});
    
    // If rpc doesn't work, we need the Dashboard
    console.log('');
    console.log('====================================');
    console.log('MANUAL STEP REQUIRED:');
    console.log('====================================');
    console.log('Go to Supabase Dashboard -> SQL Editor');
    console.log('Run this SQL:');
    console.log('');
    console.log('ALTER TABLE complaints ADD COLUMN IF NOT EXISTS ai_decision text DEFAULT NULL;');
    console.log('ALTER TABLE complaints ADD COLUMN IF NOT EXISTS ai_department text DEFAULT NULL;');
    console.log('ALTER TABLE complaints ADD COLUMN IF NOT EXISTS ai_spam_score integer DEFAULT 0;');
    console.log('ALTER TABLE complaints ADD COLUMN IF NOT EXISTS ai_metadata jsonb DEFAULT NULL;');
    console.log('');
  } else {
    console.log('✅ Columns already exist!');
  }
}

addColumns().catch(console.error);
