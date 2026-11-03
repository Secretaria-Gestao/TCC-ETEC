import {createClient} from '@supabase/supabase-js';

// Configuracao usada pelo front para autenticar usuarios direto pelo Supabase Auth.
// A chave "sb_publishable_" é a pública (equivalente à anon key) e pode ficar no código do front.
// A service key (secreta) fica só no .env do back-end.
const  SUPABASE_URL= 'https://qtgubbbrntnltrpyywqx.supabase.co';
const  SUPABASE_KEY= 'sb_publishable_vQdySC4Ec0oLE5CRBHx-sw_DkDzLkYu';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
