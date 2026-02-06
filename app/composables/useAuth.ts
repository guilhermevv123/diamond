export const useAuth = () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const router = useRouter()

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    router.push('/')
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }

    router.push('/login')
  }

  return {
    user,
    login,
    logout,
  }
}
