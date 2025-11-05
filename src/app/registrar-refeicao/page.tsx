'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Camera, Upload, ArrowLeft, Check } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { useSubscriptionCheck } from '@/hooks/useSubscriptionCheck'
import SubscriptionLoading from '@/components/SubscriptionLoading'

const tiposRefeicao = [
  'Café da Manhã',
  'Almoço', 
  'Jantar',
  'Lanche'
]

export default function RegistrarRefeicao() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [tipoRefeicao, setTipoRefeicao] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Verificação de assinatura
  const { isLoading: subscriptionLoading, hasActiveSubscription } = useSubscriptionCheck()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file)
        const reader = new FileReader()
        reader.onload = (e) => {
          setSelectedImage(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        toast.error('Por favor, selecione apenas arquivos de imagem')
      }
    }
  }

  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click()
    }
  }

  const handleGalleryUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  // Função para converter arquivo para base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        const base64 = reader.result as string
        // Remove o prefixo "data:image/...;base64," para obter apenas o base64
        const base64Content = base64.split(',')[1]
        resolve(base64Content)
      }
      reader.onerror = error => reject(error)
    })
  }

  // Função para chamar a API do Google Vision
  const analyzeImageWithGoogleVision = async (base64Image: string) => {
    const apiUrl = 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyACLWuFh_TW2msLLe0mNGbcGawkM8EolRI'
    
    const requestBody = {
      requests: [
        {
          image: {
            content: base64Image
          },
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 5
            }
          ]
        }
      ]
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error('Erro ao analisar imagem com Google Vision')
    }

    return await response.json()
  }

  // Função para extrair descriptions da resposta do Google Vision
  const extractFoodDescriptions = (visionResponse: any): string => {
    try {
      const labels = visionResponse.responses[0]?.labelAnnotations || []
      const descriptions = labels.map((label: any) => label.description)
      return descriptions.join(', ')
    } catch (error) {
      console.error('Erro ao extrair descriptions:', error)
      return ''
    }
  }

  // Função para fazer upload da imagem para o Supabase Storage
  const uploadImageToSupabase = async (file: File): Promise<string> => {
    const supabase = createClient()
    
    // Gerar nome único para o arquivo
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `refeicoes/${fileName}`

    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (error) {
      throw new Error('Erro ao fazer upload da imagem')
    }

    // Obter URL pública da imagem
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return publicUrl
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error('Por favor, selecione uma foto da refeição')
      return
    }

    if (!tipoRefeicao) {
      toast.error('Por favor, selecione o tipo de refeição')
      return
    }

    setIsProcessing(true)

    try {
      // 1. Converter imagem para base64
      toast.loading('Analisando imagem...')
      const base64Image = await fileToBase64(selectedFile)
      
      // 2. Chamar API do Google Vision
      const visionResponse = await analyzeImageWithGoogleVision(base64Image)
      
      // 3. Extrair descriptions dos alimentos
      const itensDetectados = extractFoodDescriptions(visionResponse)
      
      // 4. Fazer upload da imagem para o Supabase Storage
      toast.loading('Salvando imagem...')
      const fotoUrl = await uploadImageToSupabase(selectedFile)
      
      toast.success('Análise concluída!')
      
      // 5. NOVO FLUXO: Navegar para página de confirmação com os dados
      const params = new URLSearchParams({
        foto_url: fotoUrl,
        itens_detectados: itensDetectados,
        tipo_refeicao: tipoRefeicao
      })
      
      router.push(`/confirmar-refeicao?${params.toString()}`)
      
    } catch (error) {
      toast.error('Erro ao processar refeição. Tente novamente.')
      console.error('Erro:', error)
    } finally {
      setIsProcessing(false)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Registrar Refeição</h1>
            <p className="text-gray-600">Tire uma foto da sua refeição</p>
          </div>
        </div>

        {/* Upload de Foto */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Foto da Refeição
            </CardTitle>
            <CardDescription>
              Use a câmera ou faça upload de uma foto da galeria
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Preview da imagem */}
            {selectedImage && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={selectedImage}
                  alt="Preview da refeição"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Botões de captura */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                onClick={handleCameraCapture}
                variant="outline"
                className="h-20 flex flex-col gap-2"
              >
                <Camera className="h-6 w-6" />
                <span>Usar Câmera</span>
              </Button>

              <Button
                onClick={handleGalleryUpload}
                variant="outline"
                className="h-20 flex flex-col gap-2"
              >
                <Upload className="h-6 w-6" />
                <span>Galeria</span>
              </Button>
            </div>

            {/* Inputs ocultos */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </CardContent>
        </Card>

        {/* Seleção do Tipo de Refeição */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Tipo de Refeição</CardTitle>
            <CardDescription>
              Selecione qual tipo de refeição você está registrando
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {tiposRefeicao.map((tipo) => (
                <Button
                  key={tipo}
                  variant={tipoRefeicao === tipo ? "default" : "outline"}
                  onClick={() => setTipoRefeicao(tipo)}
                  className="h-12 relative"
                >
                  {tipoRefeicao === tipo && (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  {tipo}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Botão de Continuar */}
        <Card>
          <CardContent className="pt-6">
            <Button
              onClick={handleSubmit}
              disabled={!selectedFile || !tipoRefeicao || isProcessing}
              className="w-full h-12 text-lg"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processando...
                </div>
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Continuar
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Informações adicionais */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Dica: Tire fotos claras e bem iluminadas para melhor análise</p>
        </div>
      </div>
    </div>
  )
}