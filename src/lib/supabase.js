import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const signInWithGoogle = () =>
  supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  })

export const sendEmailOTP = (email) => supabase.auth.signInWithOtp({ email })
export const verifyEmailOTP = (email, token) => supabase.auth.verifyOtp({ email, token, type: 'email' })
export const signOut = () => supabase.auth.signOut()

// ─── Users ────────────────────────────────────────────────────────────────────

export const getUserProfile = async (userId) => {
  const { data, error } = await supabase.from('users').select('*').eq('id', userId).single()
  return { data, error }
}

export const upsertUserProfile = async (profile) => {
  const { data, error } = await supabase
    .from('users').upsert(profile, { onConflict: 'id' }).select().single()
  return { data, error }
}

// ─── Products ─────────────────────────────────────────────────────────────────

export const getProducts = async (filters = {}) => {
  let query = supabase
    .from('products')
    .select(`*, users(username, user_type, department, year, whatsapp_number)`)
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  if (filters.category) query = query.eq('category', filters.category)
  if (filters.search) query = query.ilike('name', `%${filters.search}%`)
  return query
}

export const insertProduct = async (product) => {
  const { data, error } = await supabase.from('products').insert(product).select().single()
  return { data, error }
}

export const getUserProducts = async (userId) => {
  const { data, error } = await supabase
    .from('products').select('*').eq('seller_id', userId).order('created_at', { ascending: false })
  return { data, error }
}

export const deleteProduct = async (productId) => {
  const { data, error } = await supabase.from('products').update({ is_active: false }).eq('id', productId)
  return { data, error }
}

// ─── Likes ────────────────────────────────────────────────────────────────────

export const getLikes = async (userId) => {
  const { data, error } = await supabase
    .from('likes')
    .select(`*, products(*, users(username, user_type, department, year, whatsapp_number))`)
    .eq('user_id', userId)
  return { data, error }
}

export const toggleLike = async (userId, productId) => {
  const { data: existing } = await supabase
    .from('likes').select('id').eq('user_id', userId).eq('product_id', productId).single()
  if (existing) return supabase.from('likes').delete().eq('id', existing.id)
  else return supabase.from('likes').insert({ user_id: userId, product_id: productId })
}

export const isLiked = async (userId, productId) => {
  const { data } = await supabase
    .from('likes').select('id').eq('user_id', userId).eq('product_id', productId).single()
  return !!data
}

// ─── WhatsApp Clicks ──────────────────────────────────────────────────────────

export const logWhatsappClick = async (userId, productId, sellerId) => {
  return supabase.from('whatsapp_clicks').insert({ user_id: userId, product_id: productId, seller_id: sellerId })
}

// ─── Image Upload via Cloudinary ─────────────────────────────────────────────
// Cloudinary free tier: 25 GB storage, 25 GB bandwidth/month — no backend needed
// Uses "unsigned upload" with a public upload preset (read setup instructions below)

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name'
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'aec_marketplace'

export const uploadProductImage = async (file) => {
  try {
    // Compress/resize image client-side before uploading to save bandwidth
    const compressed = await compressImage(file, 1200, 0.82)

    const formData = new FormData()
    formData.append('file', compressed)
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
    formData.append('folder', 'aec-marketplace')

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    )

    if (!res.ok) {
      const err = await res.json()
      return { url: null, error: err.error?.message || 'Upload failed' }
    }

    const data = await res.json()
    // Return a slightly compressed version URL automatically
    const optimizedUrl = data.secure_url.replace('/upload/', '/upload/q_auto,f_auto,w_1200/')
    return { url: optimizedUrl, error: null }
  } catch (err) {
    return { url: null, error: err.message }
  }
}

// ─── Client-side image compression ───────────────────────────────────────────
// Shrinks images before upload so each photo is ~200-400KB instead of 3-8MB
// This means your 25GB Cloudinary allowance goes ~10x further

const compressImage = (file, maxWidth = 1200, quality = 0.82) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let { width, height } = img

        // Scale down if wider than maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => resolve(new File([blob], file.name, { type: 'image/jpeg' })),
          'image/jpeg',
          quality
        )
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}
