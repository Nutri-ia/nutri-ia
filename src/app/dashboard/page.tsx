'use client'

import { useEffect, useState } from 'react'
import { getCurrentUser, onAuthStateChange, signOut } from '@/lib/auth'
import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, User as UserIcon, Scale, Target, TrendingDown, TrendingUp, BookOpen, Calendar, Camera, Plus, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import { useSubscriptionCheck } from '@/hooks/useSubscriptionCheck'
import SubscriptionLoading from '@/components/SubscriptionLoading'
import { useRouter } from 'next/navigation'

interface UserProfile {
  current_weight: number
  target_weight: number
  onboarding_completed: boolean
}

interface Licao {
  id: number
  dia: number
  titulo: string
  conteudo: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [licaoHoje, setLicaoHoje] = useState<Licao | null>(null)
  const [diasDesdeRegistro, setDiasDesdeRegistro] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Verificação de assinatura
  const { isLoading: subscriptionLoading, hasActiveSubscription } = useSubscriptionCheck()

  const calcularDiasDesdeRegistro = (dataRegistro: string) => {
    const hoje = new Date()
    const registro = new Date(dataRegistro)
    
    // Zerar as horas para comparar apenas as datas
    hoje.setHours(0, 0, 0, 0)
    registro.setHours(0, 0, 0, 0)
    
    const diffTime = hoje.getTime() - registro.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1 // +1 porque o dia 1 é o dia do registro
    
    return diffDays
  }

  const buscarLicaoHoje = async (dia: number) => {
    try {
      const { data, error } = await supabase
        .from('Licoes')
        .select('*')
        .eq('dia', dia)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Erro ao buscar lição:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar lição:', error)
      return null
    }
  }

  useEffect(() => {
    // Check current user
    getCurrentUser().then(async (user) => {
      setUser(user)
      
      if (user) {
        // Calcular dias desde o registro
        const dias = calcularDiasDesdeRegistro(user.created_at)
        setDiasDesdeRegistro(dias)

        // Buscar lição do dia
        const licao = await buscarLicaoHoje(dias)
        setLicaoHoje(licao)

        // Buscar perfil do usuário
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('current_weight, target_weight, onboarding_completed')
          .eq('id', user.id)
          .single()
        
        setProfile(profileData)
      }
      
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange(async (user) => {
      setUser(user)
      
      if (user) {
        // Calcular dias desde o registro
        const dias = calcularDiasDesdeRegistro(user.created_at)
        setDiasDesdeRegistro(dias)

        // Buscar lição do dia
        const licao = await buscarLicaoHoje(dias)
        setLicaoHoje(licao)

        // Buscar perfil do usuário
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('current_weight, target_weight, onboarding_completed')
          .eq('id', user.id)
          .single()
        
        setProfile(profileData)
      } else {
        setProfile(null)
        setLicaoHoje(null)
        setDiasDesdeRegistro(0)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error('Erro ao sair: ' + error.message)
    } else {
      toast.success('Logout realizado com sucesso!')
      router.push('/')
    }
  }

  const getWeightDifference = () => {
    if (!profile) return 0
    return profile.current_weight - profile.target_weight
  }

  const getProgressMessage = () => {
    const diff = getWeightDifference()
    if (diff > 0) {
      return `${diff.toFixed(1)} kg para perder`
    } else if (diff < 0) {
      return `${Math.abs(diff).toFixed(1)} kg para ganhar`
    } else {
      return 'Você já está no seu peso ideal!'
    }
  }

  // Mostrar loading da verificação de assinatura
  if (subscriptionLoading) {
    return <SubscriptionLoading />
  }

  // Se não tem assinatura ativa, o hook já redirecionou para /assinatura
  if (!hasActiveSubscription) {
    return null
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  if (!user) {
    // Redireciona para login se não estiver logado
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">
                    Olá, {user.user_metadata?.full_name || user.email}!
                  </CardTitle>
                  <CardDescription>
                    {user.email}
                  </CardDescription>
                </div>
              </div>
              <Button variant="outline" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Botão Registrar Refeição - Card destacado */}
        <Card className="mb-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
          <CardContent className="p-6">
            <Link href="/registrar-refeicao">
              <Button 
                size="lg" 
                className="w-full bg-white text-green-600 hover:bg-gray-100 font-semibold text-lg py-6"
              >
                <Camera className="mr-3 h-6 w-6" />
                Registrar Refeição
                <Plus className="ml-3 h-6 w-6" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Seção: Sua Lição de Hoje */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-xl">Sua Lição de Hoje</CardTitle>
            </div>
            <CardDescription className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Dia {diasDesdeRegistro} da sua jornada
            </CardDescription>
          </CardHeader>
          <CardContent>
            {licaoHoje ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {licaoHoje.titulo}
                </h3>
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {licaoHoje.conteudo}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Ainda não há lição disponível para o dia {diasDesdeRegistro}.
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Continue sua jornada e novas lições aparecerão!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {profile && profile.onboarding_completed && (
          <div className="grid gap-6 md:grid-cols-3 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peso Atual</CardTitle>
                <Scale className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.current_weight} kg</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Meta de Peso</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{profile.target_weight} kg</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progresso</CardTitle>
                {getWeightDifference() > 0 ? (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ) : getWeightDifference() < 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <Target className="h-4 w-4 text-green-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-muted-foreground">
                  {getProgressMessage()}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Progresso</CardTitle>
              <CardDescription>
                Visualize sua evolução
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/progresso">
                <Button className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Ver Progresso
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Perfil</CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                <UserIcon className="mr-2 h-4 w-4" />
                Editar Perfil
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>
                Ajuste suas preferências
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Configurações</Button>
            </CardContent>
          </Card>
        </div>

        {profile && profile.onboarding_completed && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">ID do Usuário:</span>
                <span className="text-muted-foreground font-mono text-sm">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span className="text-muted-foreground">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Provedor:</span>
                <span className="text-muted-foreground capitalize">
                  {user.app_metadata?.provider || 'email'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Criado em:</span>
                <span className="text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Dias na jornada:</span>
                <span className="text-muted-foreground">{diasDesdeRegistro} dias</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Peso Atual:</span>
                <span className="text-muted-foreground">{profile.current_weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Meta de Peso:</span>
                <span className="text-muted-foreground">{profile.target_weight} kg</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}