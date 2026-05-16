import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const  SUPABASE_URL= 'https://qtgubbbrntnltrpyywqx.supabase.co';
const  SUPABASE_KEY= 'sb_publishable_vQdySC4Ec0oLE5CRBHx-sw_DkDzLkYu';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
