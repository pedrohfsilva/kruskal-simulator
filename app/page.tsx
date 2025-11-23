import KruskalVisualizer from './components/KruskalVisualizer';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      
      {/* Hero Section */}
      <header className="bg-white border-b border-slate-200 pt-16 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Conectando Comunidades com <span className="text-blue-600">Eficiência Máxima</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Como a matemática e a computação ajudam prefeituras a levar internet, água e luz para mais pessoas gastando menos.
          </p>
        </div>
      </header>

      {/* Context Section */}
      <section className="py-12 px-4 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800">O Problema Real</h2>
            <p className="text-slate-600 leading-relaxed">
              Imagine que uma prefeitura precisa conectar várias comunidades rurais a uma rede de internet. 
              Cada quilômetro de cabo custa dinheiro (material, instalação, manutenção).
            </p>
            <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500 shadow-sm">
              <p className="font-medium text-slate-800">O Desafio:</p>
              <p className="text-slate-600 text-sm mt-1">
                Conectar <strong>todas</strong> as comunidades com o <strong>menor custo total</strong> possível, sem criar caminhos redundantes (ciclos).
              </p>
            </div>
          </div>
          <div className="bg-blue-100 rounded-xl p-6 flex items-center justify-center aspect-video">
            <div className="text-center space-y-2">
              <div className="text-4xl">📡 💧 ⚡</div>
              <p className="text-sm font-medium text-blue-800">Infraestrutura Essencial</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-8 bg-slate-100 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Simulador Interativo</h2>
            <p className="text-slate-600">
              Experimente conectar as comunidades manualmente e veja se você consegue bater o algoritmo!
            </p>
          </div>
          
          <KruskalVisualizer />
          
        </div>
      </section>

      {/* Algorithm Explanation */}
      <section className="py-16 px-4 max-w-4xl mx-auto space-y-12">
        
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-slate-800">Como a Mágica Acontece? (Algoritmo de Kruskal)</h2>
          <p className="text-slate-600 text-lg leading-relaxed">
            O computador não "adivinha" a solução. Ele segue uma receita lógica muito elegante chamada <strong>Algoritmo de Kruskal</strong>.
            A ideia é ser "ganancioso" (greedy), ou seja, aproveitar as melhores oportunidades primeiro.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              { step: 1, title: "Ordenar", desc: "Listamos todas as conexões possíveis da mais barata para a mais cara." },
              { step: 2, title: "Selecionar", desc: "Pegamos a conexão mais barata da lista." },
              { step: 3, title: "Verificar", desc: "Essa conexão cria um ciclo (redudância)? Se não, construímos. Se sim, descartamos." },
            ].map((item) => (
              <div key={item.step} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-9xl font-bold text-slate-50 opacity-50">{item.step}</div>
                <h3 className="text-xl font-bold text-blue-600 mb-2 relative z-10">{item.title}</h3>
                <p className="text-slate-600 text-sm relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-2xl p-8 md:p-12 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold">Impacto Social</h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Ao economizar 20% ou 30% no orçamento de cabos, a prefeitura pode usar esse dinheiro para construir um posto de saúde ou reformar uma escola.
          </p>
          <div className="inline-block bg-white/10 backdrop-blur px-6 py-3 rounded-lg font-mono text-sm text-blue-200">
            Computação = Eficiência = Mais Direitos Garantidos
          </div>
        </div>

      </section>

      <footer className="bg-white border-t border-slate-200 py-8 text-center text-slate-500 text-sm">
        <p>Desenvolvido para demonstração de Algoritmos Avançados.</p>
      </footer>
    </main>
  );
}
