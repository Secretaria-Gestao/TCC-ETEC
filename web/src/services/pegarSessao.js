import { supabase } from "./SupabaseConfig"

export async function pegarSessao() {
    const { data, error } = await supabase.auth.getSession();

    if (error || !data.session) {
        return null;
    }

    return data.session;
}