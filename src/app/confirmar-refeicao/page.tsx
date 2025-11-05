'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Check, Utensils } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useSubscriptionCheck } from '@/hooks/useSubscriptionCheck'
import SubscriptionLoading from '@/components/SubscriptionLoading'

const porcoes = [
  'Pequena',
  'Média', 
  'Grande'
]

export default function ConfirmarRefeicao() {
  const [porcao, setPorcao] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()

  // Verificação de assinatura
  const { isLoading: subscriptionLoading, hasActiveSubscription } = useSubscriptionCheck()

  // Dados vindos da página anterior via URL params
  const fotoUrl = searchParams.get('foto_url')
  const itensDetectados = searchParams.get('itens_detectados')
  const tipoRefeicao = searchParams.get('tipo_refeicao')

  // Verificar se todos os dados necessários estão presentes
  useEffect(() => {
    if (!fotoUrl || !itensDetectados || !tipoRefeicao) {
      toast.error('Dados da refeição não encontrados')
      router.push('/registrar-refeicao')
    }
  }, [fotoUrl, itensDetectados, tipoRefeicao, router])

  // Função para salvar refeição no banco de dados
  const saveRefeicaoToDatabase = async () => {
    const supabase = createClient()
    
    // Obter usuário atual
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      throw new Error('Usuário não autenticado')
    }

    const { data, error } = await supabase
      .from('Refeicoes')
      .insert([
        {
          user_id: user.id,
          foto_url: fotoUrl,
          itens_detectados: itensDetectados,
          tipo_refeicao: tipoRefeicao,
          porcao: porcao,
          data_refeicao: new Date().toISOString()
        }
      ])

    if (error) {
      throw new Error('Erro ao salvar refeição no banco de dados')
    }

    return data
  }

  const handleSaveRefeicao = async () => {
    if (!porcao) {
      toast.error('Por favor, selecione o tamanho da porção')
      return
    }

    setIsSaving(true)

    try {
      // Salvar no banco de dados
      toast.loading('Salvando refeição...')
      await saveRefeicaoToDatabase()
      
      toast.success('Refeição registrada com sucesso!')
      
      // Navegar para o dashboard
      router.push('/')
      
    } catch (error) {
      toast.error('Erro ao salvar refeição. Tente novamente.')
      console.error('Erro:', error)
    } finally {
      setIsSaving(false)
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

  // Se não tem dados necessários, não renderizar
  if (!fotoUrl || !itensDetectados || !tipoRefeicao) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/registrar-refeicao">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Confirmar Refeição</h1>
            <p className="text-gray-600">Revise os dados antes de salvar</p>
          </div>
        </div>

        {/* Foto da Refeição */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Sua Refeição
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100 mb-4">
              <Image
                src={fotoUrl}
                alt="Foto da refeição"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Tipo de Refeição */}
            <div className="mb-4">
              <Label className="text-sm font-medium text-gray-700">Tipo de Refeição:</Label>
              <p className="text-lg font-semibold text-gray-900 mt-1">{tipoRefeicao}</p>
            </div>
          </CardContent>
        </Card>

        {/* Itens Detectados */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Alimentos Detectados</CardTitle>
            <CardDescription>
              Nossa IA identificou os seguintes itens na sua refeição
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">
                Detectamos: {itensDetectados}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Seleção da Porção */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tamanho da Porção</CardTitle>
            <CardDescription>
              Selecione o tamanho da porção que você consumiu
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {porcoes.map((tamanho) => (
                <Button
                  key={tamanho}
                  variant={porcao === tamanho ? "default" : "outline"}
                  onClick={() => setPorcao(tamanho)}
                  className="h-16 flex flex-col gap-1"
                >
                  {porcao === tamanho && (
                    <Check className="h-4 w-4" />
                  )}
                  <span className="font-medium">{tamanho}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Botão de Salvar */}
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={handleSaveRefeicao}
              disabled={!porcao || isSaving}
              className="w-full h-12 text-lg"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando...
                </div>
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Salvar Refeição
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Informações adicionais */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Você pode editar essas informações depois no seu histórico</p>
        </div>
      </div>
    </div>
  )
}