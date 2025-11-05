'use client'

import { Crown, Check } from 'lucide-react'

export default function AssinaturaPage() {
  const handleSubscribe = (url: string) => {
    // Abre o link de checkout em uma nova aba
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Título Principal */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Você está a um passo de mudar sua{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              mente
            </span>{' '}
            (e seu{' '}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              corpo
            </span>
            )
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Escolha o plano que melhor se adapta ao seu estilo de vida e comece sua transformação hoje mesmo.
          </p>
        </div>

        {/* Cards de Planos */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Plano Anual */}
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-purple-200 dark:border-purple-700 p-8 transform hover:scale-105 transition-all duration-300">
            {/* Badge Mais Popular */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                <Crown className="w-4 h-4" />
                Mais Popular
              </div>
            </div>

            <div className="text-center mt-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Plano Anual
              </h3>
              <div className="mb-6">
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  R$ 197,00
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  Apenas R$ 16,41 por mês
                </div>
              </div>

              {/* Benefícios */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Acesso completo por 12 meses</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Economia de 44%</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Suporte prioritário</span>
                </div>
              </div>

              <button
                onClick={() => handleSubscribe('https://kiwify.app/prb0PTX')}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Assinar Agora
              </button>
            </div>
          </div>

          {/* Plano Mensal */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 transform hover:scale-105 transition-all duration-300">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Plano Flexível
              </h3>
              <div className="mb-6">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  R$ 29,90
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  por mês
                </div>
              </div>

              {/* Benefícios */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Acesso completo mensal</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Cancele quando quiser</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
                  <Check className="w-5 h-5 text-green-500" />
                  <span>Flexibilidade total</span>
                </div>
              </div>

              <button
                onClick={() => handleSubscribe('https://pay.kiwify.com.br/OXRUGlK')}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Assinar Agora
              </button>
            </div>
          </div>
        </div>

        {/* Garantia */}
        <div className="text-center mt-12">
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            ✨ Garantia de 7 dias. Se não ficar satisfeito, devolvemos seu dinheiro sem perguntas.
          </p>
        </div>
      </div>
    </div>
  )
}