import { ref } from 'vue'
import { getOrCreateUser, getAllUsers } from '@/shared/database'
import type { User } from '@/types'

const currentUser = ref<User | null>(null)

function getSavedUserId(): number | null {
  const id = localStorage.getItem('xiaoshengchu_user_id')
  return id ? Number(id) : null
}

function saveUserId(id: number) {
  localStorage.setItem('xiaoshengchu_user_id', String(id))
}

export function useUser() {
  async function login(name: string): Promise<User> {
    const user = await getOrCreateUser(name)
    currentUser.value = user
    saveUserId(user.id)
    return user
  }

  async function switchUser(name: string): Promise<User> {
    const user = await getOrCreateUser(name)
    currentUser.value = user
    saveUserId(user.id)
    return user
  }

  async function fetchUsers(): Promise<User[]> {
    return getAllUsers()
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem('xiaoshengchu_user_id')
  }

  return {
    currentUser,
    login,
    switchUser,
    fetchUsers,
    logout,
    getSavedUserId
  }
}
