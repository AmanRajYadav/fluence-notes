export interface Note {
  id: string
  user_id: string
  title: string | null
  content: string | null
  pinned: boolean
  is_public: boolean
  created_at: string
}
