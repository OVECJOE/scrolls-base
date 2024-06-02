import { createClient } from '@supabase/supabase-js'
import { type Database } from './types'

// Verify environment variables are set
const envVars: string[] = ['SUPABASE_URL', 'SUPABASE_KEY']

envVars.forEach(envVar => {
	if (!process.env[envVar]) {
		throw new Error(`${envVar} is required`)
	}
})

export default createClient<Database>(
	process.env.SUPABASE_URL!,
	process.env.SUPABASE_KEY!,
)
