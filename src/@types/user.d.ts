type User = {
  id?: string
  _id?: string
  name?: string
  email: string
  gender?: string
  staffId?: string
  phoneNumber?: string
  designation?: string
  role: string
  email_confirmed_at: string
  phone?: string
  created_at: string
  updated_at: string
  is_anonymous?: boolean
  app_metadata?: {
    provider: string
    providers: string[]
  }
  user_metadata?: {
    email_verified?: boolean
  }
}
