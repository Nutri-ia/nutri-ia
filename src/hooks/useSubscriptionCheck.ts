'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export function useSubscriptionCheck() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkSubscription()
  }, [])

  const checkSubscription = async () => {
    try {
      // Verificar se usuário está logado
      const user = await getCurrentUser()
      
      if (!user) {
        // Se não estiver logado, redirecionar para login
        router.push('/login')
        return
      }

      // Buscar dados do usuário na tabela usuarios
      const { data: userData, error } = await supabase
        .from('usuarios')
        .select('plano_ativo')
        .eq('email', user.email)
        .single()

      if (error) {
        console.error('Erro ao verificar plano:', error)
        // Se não encontrar o usuário na tabela, assumir que não tem plano ativo
        setHasActiveSubscription(false)
        router.push('/assinatura')
        return
      }

      // Verificar se plano está ativo
      const isActive = userData?.plano_ativo === true || userData?.plano_ativo === 'sim'
      
      if (!isActive) {
        // Plano não ativo, redirecionar para página de assinatura
        toast.error('Você precisa de uma assinatura ativa para acessar este conteúdo')
        router.push('/assinatura')
        return
      }

      // Plano ativo, permitir acesso
      setHasActiveSubscription(true)
      
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error)
      router.push('/assinatura')
    } finally {
      setIsLoading(false)
    }
  }

  return { isLoading, hasActiveSubscription }
}