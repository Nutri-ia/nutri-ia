'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCurrentUser } from '@/lib/auth'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { toast } from 'sonner'
import { Scale, Target } from 'lucide-react'

export default function OnboardingPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    currentWeight: '',
    targetWeight: ''
  })
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/login')
        return
      }
      
      // Verificar se o usuário já completou o onboarding
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('onboarding_completed')
        .eq('id', currentUser.id)
        .single()
      
      if (profile?.onboarding_completed) {
        router.push('/')
        return
      }
      
      setUser(currentUser)
      setLoading(false)
    }

    checkUser()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    // Permitir apenas números e ponto decimal
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) return
    
    const currentWeight = parseFloat(formData.currentWeight)
    const targetWeight = parseFloat(formData.targetWeight)
    
    if (!currentWeight || !targetWeight) {
      toast.error('Por favor, preencha ambos os campos com valores válidos')
      return
    }
    
    if (currentWeight <= 0 || targetWeight <= 0) {
      toast.error('Os pesos devem ser valores positivos')
      return
    }
    
    if (currentWeight > 999 || targetWeight > 999) {
      toast.error('Os pesos devem ser menores que 999 kg')
      return
    }

    setSubmitting(true)

    try {
      // Inserir ou atualizar o perfil do usuário
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          id: user.id,
          current_weight: currentWeight,
          target_weight: targetWeight,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })

      if (error) {
        toast.error('Erro ao salvar dados: ' + error.message)
        return
      }

      toast.success('Perfil configurado com sucesso!')
      router.push('/')
    } catch (error) {
      toast.error('Erro inesperado ao salvar dados')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Vamos começar sua jornada
          </CardTitle>
          <CardDescription>
            Precisamos de algumas informações para personalizar sua experiência
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currentWeight" className="text-sm font-medium">
                Qual seu peso atual?
              </Label>
              <div className="relative">
                <Scale className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="currentWeight"
                  name="currentWeight"
                  type="text"
                  placeholder="Ex: 70.5"
                  value={formData.currentWeight}
                  onChange={handleInputChange}
                  className="pl-10 pr-12"
                  required
                />
                <span className="absolute right-3 top-3 text-sm text-gray-400">kg</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetWeight" className="text-sm font-medium">
                Qual sua meta de peso?
              </Label>
              <div className="relative">
                <Target className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="targetWeight"
                  name="targetWeight"
                  type="text"
                  placeholder="Ex: 65.0"
                  value={formData.targetWeight}
                  onChange={handleInputChange}
                  className="pl-10 pr-12"
                  required
                />
                <span className="absolute right-3 top-3 text-sm text-gray-400">kg</span>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              disabled={submitting}
            >
              {submitting ? 'Salvando...' : 'Concluir'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}