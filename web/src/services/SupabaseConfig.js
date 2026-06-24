import {createClient} from '@supabase/supabase-js';

// Configuracao usada pelo front para autenticar usuarios direto pelo Supabase Auth.
const  SUPABASE_URL= 'https://qtgubbbrntnltrpyywqx.supabase.co';
const  SUPABASE_KEY= 'sb_publishable_vQdySC4Ec0oLE5CRBHx-sw_DkDzLkYu';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
