import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export const getAuthenticatedUser = async (event: any) => {
    // 1. Tentar método padrão (Cookie)
    try {
        const user = await serverSupabaseUser(event)
        if (user) return user
    } catch (e) {
        // Ignorar erro de cookie e tentar token
    }

    // 2. Tentar via Header Authorization (Bearer Token)
    const authHeader = getHeader(event, 'Authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]
        try {
            const supabase = await serverSupabaseClient(event)
            const { data: { user }, error } = await supabase.auth.getUser(token)
            
            if (user && !error) return user
        } catch (e) {
            console.error('Erro ao validar Token Bearer:', e)
        }
    }

    return null
}
