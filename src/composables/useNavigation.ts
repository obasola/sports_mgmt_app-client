import { useRouter } from 'vue-router'

export function useNavigation() {
  const router = useRouter()

  const goToPage = (page: string) => {
    router.push({ name: page }) // Assumes you're using named routes
  }

  return {
    goToPage
  }
}
