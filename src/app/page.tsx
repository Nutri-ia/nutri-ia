'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, Brain, Shield, Check, Star } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">Nutri-IA</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-700 hover:text-gray-900">Login</Button>
            </Link>
            <Link href="/cadastro">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Cadastre-se</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Seção 1: O Gancho - A Dor */}
      <section className="py-20 px-4 bg-gradient-to-br from-red-50 to-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Cansada de lutar contra a comida?
          </h1>
          
          <h2 className="text-xl md:text-2xl text-gray-700 mb-8 font-medium">
            E se o problema não for sua força de vontade, mas o método que você está usando?
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Você já tentou de tudo. Baixou apps, contou pontos... mas a parte mais chata sempre vence: ter que digitar tudo o que você come. Você desiste. À noite, a ansiedade bate, você "ataca" a geladeira, e o ciclo da culpa recomeça.
          </p>
        </div>
      </section>

      {/* Seção 2: A Mágica - A Ferramenta de IA */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Camera className="h-10 w-10 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Chega de Digitar Comida.
          </h2>
          
          <h3 className="text-xl md:text-2xl text-gray-700 mb-8 font-medium">
            A partir de hoje, você só precisa tirar uma foto.
          </h3>
          
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            O Nutri-IA é o único app que usa IA para eliminar seu maior atrito. Você aponta a câmera, a IA identifica ("Arroz, Feijão, Bife") e você só confirma a porção. Sem digitar. Nunca mais.
          </p>
        </div>
      </section>

      {/* Seção 3: O Método - A Solução Real */}
      <section className="py-20 px-4 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Brain className="h-10 w-10 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Mas a IA é só a ferramenta. O segredo é o Método.
          </h2>
          
          <h3 className="text-xl md:text-2xl text-gray-700 mb-8 font-medium">
            Nós não focamos no seu prato. Focamos na sua mente.
          </h3>
          
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Você precisa entender por que você come. Nosso Programa de 12 Semanas (84 Lições) é um método baseado em psicologia para acabar com a fome emocional e o ciclo da culpa.
          </p>
        </div>
      </section>

      {/* Seção 4: A Oferta - O Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-50 to-green-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Sua transformação começa agora.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Card Mensal */}
            <Card className="border-2 border-gray-200 hover:border-emerald-300 transition-colors">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Plano Mensal</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">R$ 29,90</span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-600" />
                  <span>Acesso completo ao app</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-600" />
                  <span>IA para reconhecimento de alimentos</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-600" />
                  <span>Programa de 12 semanas</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-600" />
                  <span>84 lições de psicologia alimentar</span>
                </div>
                <Button className="w-full mt-6 bg-gray-600 hover:bg-gray-700">
                  Começar Plano Mensal
                </Button>
              </CardContent>
            </Card>

            {/* Card Anual - Em Destaque */}
            <Card className="border-2 border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-emerald-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  MAIS POPULAR
                </div>
              </div>
              <CardHeader className="text-center pb-4 pt-8">
                <CardTitle className="text-2xl font-bold text-gray-900">Plano Anual</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-emerald-600">R$ 197</span>
                  <span className="text-gray-600">/ano</span>
                </div>
                <p className="text-sm text-emerald-700 font-medium mt-2">
                  Economia de R$ 161,80 por ano!
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-600" />
                  <span>Acesso completo ao app</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-600" />
                  <span>IA para reconhecimento de alimentos</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-600" />
                  <span>Programa de 12 semanas</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-600" />
                  <span>84 lições de psicologia alimentar</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-600" />
                  <span className="font-semibold">Suporte prioritário</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-600" />
                  <span className="font-semibold">Acesso vitalício às atualizações</span>
                </div>
                <a 
                  href="https://kiwify.com/checkout/nutri-ia-anual" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <Button className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-lg py-6">
                    QUERO COMEÇAR MINHA TRANSFORMAÇÃO (ANUAL)
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Seção 5: Garantia */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <Shield className="h-10 w-10 text-white" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Risco Zero.
          </h2>
          
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Teste o método por 7 dias. Se não gostar, peça o reembolso. Sem perguntas.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Nutri-IA</span>
          </div>
          <p className="text-gray-400 mb-8">
            Transformando vidas através da inteligência artificial
          </p>
          <div className="flex justify-center gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="hover:text-white transition-colors">Política de Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  )
}