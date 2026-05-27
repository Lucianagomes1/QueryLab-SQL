# QueryLab SQL

Guia interativo para aprender, consultar e praticar SQL com exemplos, saidas esperadas, desafios e um playground com SQLite rodando no navegador.

## Sobre o projeto

O QueryLab SQL foi criado como projeto de portfolio para demonstrar uma experiencia de aprendizado pratica e visual. A aplicacao permite explorar comandos SQL, testar consultas reais em uma base ficticia de loja online e validar desafios pelo resultado retornado pela query.

## Funcionalidades

- Dashboard com metricas do guia, banco e progresso dos desafios.
- Guia com 57 comandos e topicos SQL.
- Filtros por categoria, nivel e busca textual.
- Exemplos com sintaxe, saida esperada, boas praticas e pontos de atencao.
- Playground com editor SQL e resultados em tabela.
- SQLite executando no navegador via WebAssembly.
- Desafios com editor integrado e validacao por resultado real.
- Schema ficticio de loja online com clientes, pedidos, produtos e itens de pedido.

## Stack

- React
- TypeScript
- Vite
- CodeMirror
- sql.js
- Lucide React
- CSS puro

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse:

```text
http://127.0.0.1:5173
```

No Windows, tambem e possivel usar:

```bash
start-dev.cmd
```

## Build

```bash
npm run build
```

O build de producao e gerado na pasta `dist`.

## Deploy

Configuracao recomendada na Vercel:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## Dataset

A base ficticia `loja_online` contem:

- `clientes`
- `pedidos`
- `produtos`
- `itens_pedido`

O banco e carregado em memoria no navegador, entao nao exige backend nem servidor de banco de dados.

