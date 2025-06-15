// Supabase Client Configuration
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sprlwkfpreajsodowyrs.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwcmx3a2ZwcmVhanNvZG93eXJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5Njc4NjIsImV4cCI6MjA2NTU0Mzg2Mn0.9asEwbT40SPv_FBxUqm_7ON2CCuRZc2iEmDRiYK5n8k'

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables. Please check your .env file.')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Authentication Functions
export const auth = {
    // Sign in with Google
    async signInWithGoogle() {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/my-tutor-app-live/home.html'
                }
            })
            
            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Google sign-in error:', error)
            return { data: null, error }
        }
    },

    // Sign out
    async signOut() {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error
            return { error: null }
        } catch (error) {
            console.error('Sign out error:', error)
            return { error }
        }
    },

    // Get current session
    async getSession() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession()
            if (error) throw error
            return { session, error: null }
        } catch (error) {
            console.error('Get session error:', error)
            return { session: null, error }
        }
    },

    // Get current user
    async getUser() {
        try {
            const { data: { user }, error } = await supabase.auth.getUser()
            if (error) throw error
            return { user, error: null }
        } catch (error) {
            console.error('Get user error:', error)
            return { user: null, error }
        }
    },

    // Listen to auth state changes
    onAuthStateChange(callback) {
        return supabase.auth.onAuthStateChange(callback)
    }
}

// Database Functions
export const db = {
    // Student Management Functions
    async createStudent(userId, studentData) {
        try {
            const { data, error } = await supabase
                .from('students')
                .insert([
                    {
                        id: userId,
                        name: studentData.name,
                        email: studentData.email,
                        profile_picture: studentData.profile_picture,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ])
                .select()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Create student error:', error)
            return { data: null, error }
        }
    },

    // Get student profile
    async getStudent(userId) {
        try {
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Get student error:', error)
            return { data: null, error }
        }
    },

    // Update student profile
    async updateStudent(userId, updates) {
        try {
            const { data, error } = await supabase
                .from('students')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId)
                .select()

            if (error) throw error
            return { data, error: null }
        } catch (error) {
            console.error('Update student error:', error)
            return { data: null, error }
        }
    },

    // Check if student exists
    async studentExists(userId) {
        try {
            const { data, error } = await supabase
                .from('students')
                .select('id')
                .eq('id', userId)
                .single()

            if (error && error.code !== 'PGRST116') throw error
            return { exists: !!data, error: null }
        } catch (error) {
            console.error('Check student exists error:', error)
            return { exists: false, error }
        }
    }
}

// Export the main client for direct access if needed
export default supabase
