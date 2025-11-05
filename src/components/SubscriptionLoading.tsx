import { Card, CardContent } from '@/components/ui/card'

export default function SubscriptionLoading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold mb-2">Verificando assinatura...</h2>
          <p className="text-muted-foreground text-sm">
            Aguarde enquanto verificamos seu plano ativo
          </p>
        </CardContent>
      </Card>
    </div>
  )
}