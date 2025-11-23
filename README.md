# Simulador de Conexão de Comunidades (Algoritmo de Kruskal)

Este projeto é uma aplicação web interativa desenvolvida para demonstrar a aplicação prática de **Algoritmos Avançados** em problemas de interesse público.

O objetivo é simular o planejamento de uma rede de infraestrutura (como internet, água ou energia elétrica) que precisa conectar diversas comunidades rurais com o **menor custo possível**.

## 🎯 O Problema

Uma prefeitura precisa conectar várias comunidades isoladas. Cada conexão possível (cabo, tubulação) tem um custo associado à distância ou dificuldade do terreno. O desafio é encontrar um subconjunto de conexões que:
1. Conecte **todas** as comunidades.
2. Tenha o **custo total mínimo**.
3. Não crie ciclos (caminhos redundantes desnecessários).

Este é um problema clássico de **Árvore Geradora Mínima (Minimum Spanning Tree - MST)**.

## 🧠 O Algoritmo de Kruskal

Para resolver este problema, utilizamos o **Algoritmo de Kruskal**. Ele é um algoritmo "guloso" (greedy) que funciona da seguinte maneira:

1. **Ordenar**: Lista todas as conexões possíveis da mais barata para a mais cara.
2. **Iterar**: Percorre a lista ordenada, selecionando a conexão de menor custo.
3. **Verificar Ciclos**:
   - Se a conexão une duas comunidades que ainda não estão conectadas (direta ou indiretamente), ela é **aceita**.
   - Se as comunidades já estão conectadas, a conexão criaria um ciclo e é **descartada**.
4. **Finalizar**: O processo para quando todas as comunidades estiverem interligadas.

Para verificar a conectividade e evitar ciclos de forma eficiente, utilizamos a estrutura de dados **Union-Find**.

## ✨ Funcionalidades do Projeto

- **Simulador Interativo**: Visualização gráfica de comunidades (nós) e conexões (arestas).
- **Modo Manual**: O usuário pode tentar conectar as comunidades manualmente para ver quanto gastaria "na intuição".
- **Modo Automático**: O algoritmo de Kruskal roda passo a passo, mostrando visualmente as decisões tomadas (arestas aceitas em verde, rejeitadas em vermelho).
- **Comparação de Custos**: Exibe a economia gerada pelo algoritmo em comparação com a solução manual.
- **Geração de Cenários**: Criação de mapas aleatórios com diferentes números de comunidades.

## 🚀 Como Executar

Este projeto foi desenvolvido com **Next.js**, **TypeScript** e **Tailwind CSS**.

### Pré-requisitos

- Node.js instalado (versão 18 ou superior recomendada).

### Passo a Passo

1. Clone o repositório:
   ```bash
   git clone https://github.com/pedrohfsilva/kruskal-simulator.git
   cd kruskal-simulator
   ```

2. Instale as dependências:
   ```bash
   npm install
   # ou
   yarn install
   ```

3. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   # ou
   yarn dev
   ```

4. Abra o navegador e acesse:
   [http://localhost:3000](http://localhost:3000)

## 🛠️ Tecnologias Utilizadas

- **[Next.js 15](https://nextjs.org/)**: Framework React para a aplicação web.
- **[Tailwind CSS](https://tailwindcss.com/)**: Estilização moderna e responsiva.
- **TypeScript**: Tipagem estática para maior segurança no código.
- **React**: Biblioteca para construção da interface do usuário.

---
Desenvolvido para fins educacionais na disciplina de Algoritmos Avançados.
