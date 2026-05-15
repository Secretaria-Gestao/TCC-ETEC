import {createClient} from '@supabase/supabase-js';

const  SUPABASE_URL= 'supabase.com';
const  SUPABASE_KEY= 'chave123';

const supabase = createClient(SUPABASE_KEY, SUPABASE_URL);

