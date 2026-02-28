import { useState, useEffect } from 'react'
import pb from '../lib/pb'

export function useAuth() {
  const [admin, setAdmin] = useState(pb.authStore.model)

  useEffect(() => {
    return pb.authStore.onChange((token, model) => {
      setAdmin(model)
    })
  }, [])

  async function login(email, password) {
    await pb.collection('_superusers').authWithPassword(email, password)
  }

  function logout() {
    pb.authStore.clear()
  }

  return { admin, login, logout, isAuthed: !!admin }
}
