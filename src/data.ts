import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Code2,
  Database,
  FileCode2,
  Lightbulb,
  Play,
  ShieldCheck,
  Table2,
  type LucideIcon,
} from "lucide-react";

export type ViewId = "dashboard" | "guide" | "playground" | "challenges" | "practices";

export type CommandGuide = {
  name: string;
  group: string;
  level: "Basico" | "Intermediario" | "Avancado";
  description: string;
  syntax: string;
  example: string;
  best: string;
  avoid: string;
};

export type CommandOutput =
  | {
      kind: "table";
      columns: string[];
      rows: Array<Array<string | number>>;
    }
  | {
      kind: "message";
      text: string;
    };

export type QueryExample = {
  label: string;
  query: string;
};

export type ExpectedResult = {
  columns: string[];
  rows: Array<Array<string | number | null>>;
};

export type Challenge = {
  title: string;
  text: string;
  tag: string;
  starter: string;
  hint: string;
  expectedResult: ExpectedResult;
  successMessage: string;
};

export const levels = ["Todos", "Basico", "Intermediario", "Avancado"] as const;

export type Practice = {
  title: string;
  text: string;
  bad: string;
  good: string;
};

export const views: Array<{ id: ViewId; label: string; icon: LucideIcon }> = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "guide", label: "Guia", icon: BookOpen },
  { id: "playground", label: "Playground", icon: Play },
  { id: "challenges", label: "Desafios", icon: CheckCircle2 },
  { id: "practices", label: "Boas praticas", icon: ShieldCheck },
];

export const datasetMetrics = [
  { label: "Comandos SQL", value: "57", detail: "consulta, DML, DDL e performance" },
  { label: "Clientes", value: "12", detail: "base ficticia de loja online" },
  { label: "Pedidos", value: "13", detail: "status, datas e valores variados" },
  { label: "Produtos", value: "11", detail: "cursos, livros, servicos e acessorios" },
];

export const schemaTables = [
  {
    name: "clientes",
    icon: Database,
    columns: ["id", "nome", "cidade", "segmento", "criado_em"],
  },
  {
    name: "pedidos",
    icon: FileCode2,
    columns: ["id", "cliente_id", "status", "total", "criado_em"],
  },
  {
    name: "produtos",
    icon: Table2,
    columns: ["id", "nome", "categoria", "preco"],
  },
  {
    name: "itens_pedido",
    icon: Code2,
    columns: ["pedido_id", "produto_id", "quantidade", "preco_unitario"],
  },
];

export const commands: CommandGuide[] = [
  {
    name: "SELECT",
    group: "Consulta",
    level: "Basico",
    description: "Busca colunas de uma tabela. E o ponto de partida para quase toda analise em SQL.",
    syntax: "SELECT coluna_1, coluna_2\nFROM tabela;",
    example: "SELECT nome, cidade\nFROM clientes;",
    best: "Escolha apenas as colunas que voce precisa.",
    avoid: "Evite SELECT * em consultas que vao para producao.",
  },
  {
    name: "FROM",
    group: "Consulta",
    level: "Basico",
    description: "Define de qual tabela, view ou subconsulta os dados serao lidos.",
    syntax: "SELECT colunas\nFROM tabela;",
    example: "SELECT nome, cidade\nFROM clientes;",
    best: "Use nomes de tabela claros e aliases quando a query tiver mais de uma fonte.",
    avoid: "Nao deixe a origem implicita em consultas com joins ou subqueries.",
  },
  {
    name: "WHERE",
    group: "Filtro",
    level: "Basico",
    description: "Filtra linhas antes de elas entrarem no resultado final.",
    syntax: "SELECT colunas\nFROM tabela\nWHERE condicao;",
    example: "SELECT nome, cidade\nFROM clientes\nWHERE cidade = 'Sao Paulo';",
    best: "Use filtros especificos e legiveis.",
    avoid: "Cuidado com comparacoes que ignoram nulos sem querer.",
  },
  {
    name: "AND / OR",
    group: "Filtro",
    level: "Basico",
    description: "Combina condicoes para criar filtros mais especificos ou mais flexiveis.",
    syntax: "SELECT colunas\nFROM tabela\nWHERE condicao_1 AND condicao_2;",
    example: "SELECT nome, cidade\nFROM clientes\nWHERE cidade = 'Sao Paulo' AND segmento = 'B2B';",
    best: "Use parenteses quando misturar AND e OR para deixar a precedencia explicita.",
    avoid: "Nao confie que todo leitor lembrara a ordem de avaliacao dos operadores.",
  },
  {
    name: "IN",
    group: "Filtro",
    level: "Basico",
    description: "Filtra valores que pertencem a uma lista ou ao resultado de uma subconsulta.",
    syntax: "SELECT colunas\nFROM tabela\nWHERE coluna IN (valor_1, valor_2);",
    example: "SELECT nome, cidade\nFROM clientes\nWHERE cidade IN ('Sao Paulo', 'Curitiba');",
    best: "Use IN para listas pequenas e legiveis de valores aceitos.",
    avoid: "Evite listas enormes hardcoded quando uma tabela de referencia resolver melhor.",
  },
  {
    name: "BETWEEN",
    group: "Filtro",
    level: "Basico",
    description: "Filtra valores dentro de um intervalo inclusivo.",
    syntax: "SELECT colunas\nFROM tabela\nWHERE coluna BETWEEN inicio AND fim;",
    example: "SELECT id, total\nFROM pedidos\nWHERE total BETWEEN 300 AND 900;",
    best: "Use BETWEEN para faixas numericas ou datas quando os limites devem entrar no resultado.",
    avoid: "Nao use sem lembrar que os dois extremos sao incluidos.",
  },
  {
    name: "LIKE",
    group: "Filtro",
    level: "Basico",
    description: "Busca padroes em textos usando curingas como % e _.",
    syntax: "SELECT colunas\nFROM tabela\nWHERE coluna LIKE 'padrao%';",
    example: "SELECT nome\nFROM clientes\nWHERE nome LIKE 'Ana%';",
    best: "Prefira padroes que possam aproveitar indices quando possivel.",
    avoid: "Evite LIKE '%texto%' em tabelas grandes sem estrategia de busca.",
  },
  {
    name: "IS NULL",
    group: "Filtro",
    level: "Basico",
    description: "Verifica campos sem valor definido.",
    syntax: "SELECT colunas\nFROM tabela\nWHERE coluna IS NULL;",
    example: "SELECT id, status\nFROM pedidos\nWHERE status IS NULL;",
    best: "Use IS NULL ou IS NOT NULL para tratar ausencia de valor corretamente.",
    avoid: "Nao compare nulos com = NULL ou <> NULL.",
  },
  {
    name: "DISTINCT",
    group: "Consulta",
    level: "Basico",
    description: "Remove linhas duplicadas do resultado considerando as colunas selecionadas.",
    syntax: "SELECT DISTINCT coluna\nFROM tabela;",
    example: "SELECT DISTINCT cidade\nFROM clientes;",
    best: "Use para responder perguntas de valores unicos.",
    avoid: "Nao use DISTINCT para esconder duplicidade causada por join incorreto.",
  },
  {
    name: "ORDER BY",
    group: "Ordenacao",
    level: "Basico",
    description: "Controla a ordem em que as linhas aparecem no resultado.",
    syntax: "SELECT colunas\nFROM tabela\nORDER BY coluna ASC;",
    example: "SELECT nome, cidade\nFROM clientes\nORDER BY nome ASC;",
    best: "Ordene por colunas relevantes para a leitura do dado.",
    avoid: "Nao dependa da ordem padrao do banco.",
  },
  {
    name: "LIMIT",
    group: "Consulta",
    level: "Basico",
    description: "Restringe a quantidade de linhas retornadas.",
    syntax: "SELECT colunas\nFROM tabela\nLIMIT quantidade;",
    example: "SELECT id, total\nFROM pedidos\nORDER BY total DESC\nLIMIT 3;",
    best: "Combine com ORDER BY para deixar claro quais linhas entram no topo.",
    avoid: "Nao use LIMIT sem ordenacao quando a escolha das linhas importa.",
  },
  {
    name: "OFFSET",
    group: "Consulta",
    level: "Intermediario",
    description: "Pula uma quantidade de linhas antes de retornar o resultado.",
    syntax: "SELECT colunas\nFROM tabela\nORDER BY coluna\nLIMIT 10 OFFSET 20;",
    example: "SELECT id, nome\nFROM clientes\nORDER BY nome\nLIMIT 2 OFFSET 2;",
    best: "Use em paginacoes pequenas e sempre com ORDER BY.",
    avoid: "Evite offsets muito altos em tabelas grandes sem avaliar performance.",
  },
  {
    name: "GROUP BY",
    group: "Agregacao",
    level: "Intermediario",
    description: "Agrupa linhas para calcular totais, medias, contagens e outras metricas.",
    syntax: "SELECT coluna, COUNT(*)\nFROM tabela\nGROUP BY coluna;",
    example: "SELECT cidade, COUNT(*) AS total_clientes\nFROM clientes\nGROUP BY cidade;",
    best: "Nomeie metricas com aliases claros.",
    avoid: "Nao misture colunas soltas com agregacoes sem agrupar.",
  },
  {
    name: "COUNT",
    group: "Agregacao",
    level: "Basico",
    description: "Conta linhas ou valores nao nulos em uma coluna.",
    syntax: "SELECT COUNT(*) AS total\nFROM tabela;",
    example: "SELECT COUNT(*) AS total_clientes\nFROM clientes;",
    best: "Use COUNT(*) para contar linhas e COUNT(coluna) para contar valores preenchidos.",
    avoid: "Nao confunda contagem de linhas com soma de valores.",
  },
  {
    name: "SUM",
    group: "Agregacao",
    level: "Basico",
    description: "Soma valores numericos de uma coluna ou expressao.",
    syntax: "SELECT SUM(coluna) AS total\nFROM tabela;",
    example: "SELECT ROUND(SUM(total), 2) AS receita_total\nFROM pedidos;",
    best: "Nomeie o resultado com um alias de negocio.",
    avoid: "Nao some campos de texto ou codigos que parecem numericos.",
  },
  {
    name: "AVG",
    group: "Agregacao",
    level: "Basico",
    description: "Calcula a media de valores numericos.",
    syntax: "SELECT AVG(coluna) AS media\nFROM tabela;",
    example: "SELECT ROUND(AVG(total), 2) AS ticket_medio\nFROM pedidos;",
    best: "Arredonde apenas na camada final de apresentacao quando precisar de precisao.",
    avoid: "Nao ignore que valores nulos ficam fora do calculo.",
  },
  {
    name: "MIN / MAX",
    group: "Agregacao",
    level: "Basico",
    description: "Retorna o menor e o maior valor de uma coluna.",
    syntax: "SELECT MIN(coluna), MAX(coluna)\nFROM tabela;",
    example: "SELECT MIN(total) AS menor_pedido, MAX(total) AS maior_pedido\nFROM pedidos;",
    best: "Use para encontrar limites, datas iniciais e valores extremos.",
    avoid: "Nao interprete o restante da linha junto sem uma query apropriada.",
  },
  {
    name: "JOIN",
    group: "Relacionamento",
    level: "Intermediario",
    description: "Combina dados de tabelas relacionadas por chaves.",
    syntax: "SELECT a.coluna, b.coluna\nFROM tabela_a a\nINNER JOIN tabela_b b ON b.id = a.b_id;",
    example: "SELECT p.id, c.nome, p.total\nFROM pedidos p\nINNER JOIN clientes c ON c.id = p.cliente_id;",
    best: "Use aliases curtos e explicite a coluna de relacionamento.",
    avoid: "Evite joins sem ON, eles podem multiplicar linhas.",
  },
  {
    name: "INNER JOIN",
    group: "Relacionamento",
    level: "Intermediario",
    description: "Retorna apenas linhas que possuem correspondencia nas duas tabelas.",
    syntax: "SELECT a.coluna, b.coluna\nFROM tabela_a a\nINNER JOIN tabela_b b ON b.id = a.b_id;",
    example: "SELECT p.id, c.nome\nFROM pedidos p\nINNER JOIN clientes c ON c.id = p.cliente_id;",
    best: "Use quando a relacao deve existir dos dois lados.",
    avoid: "Nao use se voce precisa manter registros sem correspondencia.",
  },
  {
    name: "LEFT JOIN",
    group: "Relacionamento",
    level: "Intermediario",
    description: "Mantem todas as linhas da tabela da esquerda, mesmo sem correspondencia na direita.",
    syntax: "SELECT a.coluna, b.coluna\nFROM tabela_a a\nLEFT JOIN tabela_b b ON b.id = a.b_id;",
    example: "SELECT c.nome, p.id AS pedido_id\nFROM clientes c\nLEFT JOIN pedidos p ON p.cliente_id = c.id;",
    best: "Use para encontrar registros com ou sem relacionamento.",
    avoid: "Cuidado ao colocar filtros da tabela direita no WHERE e transformar o resultado em INNER JOIN.",
  },
  {
    name: "RIGHT JOIN",
    group: "Relacionamento",
    level: "Intermediario",
    description: "Mantem todas as linhas da tabela da direita, mesmo sem correspondencia na esquerda.",
    syntax: "SELECT a.coluna, b.coluna\nFROM tabela_a a\nRIGHT JOIN tabela_b b ON b.id = a.b_id;",
    example: "SELECT c.nome, p.id\nFROM clientes c\nRIGHT JOIN pedidos p ON p.cliente_id = c.id;",
    best: "Use quando a tabela principal esta no lado direito do join.",
    avoid: "Em muitos casos, prefira reordenar as tabelas e usar LEFT JOIN para leitura mais comum.",
  },
  {
    name: "FULL OUTER JOIN",
    group: "Relacionamento",
    level: "Avancado",
    description: "Retorna linhas correspondentes e tambem linhas sem correspondencia dos dois lados.",
    syntax: "SELECT a.coluna, b.coluna\nFROM tabela_a a\nFULL OUTER JOIN tabela_b b ON b.id = a.b_id;",
    example: "SELECT c.nome, p.id\nFROM clientes c\nFULL OUTER JOIN pedidos p ON p.cliente_id = c.id;",
    best: "Use em auditorias de diferenca entre duas fontes.",
    avoid: "Lembre que SQLite nao oferece FULL OUTER JOIN nativo.",
  },
  {
    name: "CROSS JOIN",
    group: "Relacionamento",
    level: "Avancado",
    description: "Cria todas as combinacoes possiveis entre duas tabelas.",
    syntax: "SELECT a.coluna, b.coluna\nFROM tabela_a a\nCROSS JOIN tabela_b b;",
    example: "SELECT c.nome, pr.nome AS produto\nFROM clientes c\nCROSS JOIN produtos pr;",
    best: "Use para gerar matrizes, combinacoes ou calendarios controlados.",
    avoid: "Nao use sem estimar o volume, pois o resultado cresce muito rapido.",
  },
  {
    name: "UNION",
    group: "Combinacao",
    level: "Intermediario",
    description: "Combina resultados de duas consultas e remove duplicidades.",
    syntax: "SELECT coluna FROM tabela_a\nUNION\nSELECT coluna FROM tabela_b;",
    example: "SELECT cidade FROM clientes\nUNION\nSELECT status FROM pedidos;",
    best: "Garanta que as consultas tenham a mesma quantidade e tipos compativeis de colunas.",
    avoid: "Nao use UNION quando duplicatas precisam ser preservadas.",
  },
  {
    name: "UNION ALL",
    group: "Combinacao",
    level: "Intermediario",
    description: "Combina resultados de duas consultas preservando duplicidades.",
    syntax: "SELECT coluna FROM tabela_a\nUNION ALL\nSELECT coluna FROM tabela_b;",
    example: "SELECT cidade FROM clientes\nUNION ALL\nSELECT cidade FROM clientes;",
    best: "Prefira UNION ALL quando duplicatas sao validas ou quando performance importa.",
    avoid: "Nao use se o resultado final precisa ser unico.",
  },
  {
    name: "HAVING",
    group: "Agregacao",
    level: "Intermediario",
    description: "Filtra resultados depois de uma agregacao.",
    syntax: "SELECT coluna, SUM(valor)\nFROM tabela\nGROUP BY coluna\nHAVING SUM(valor) > 100;",
    example: "SELECT cliente_id, SUM(total) AS receita\nFROM pedidos\nGROUP BY cliente_id\nHAVING SUM(total) > 500;",
    best: "Use WHERE antes do agrupamento e HAVING para metricas agregadas.",
    avoid: "Nao use HAVING para filtros simples de linha.",
  },
  {
    name: "CASE",
    group: "Expressao",
    level: "Intermediario",
    description: "Cria regras condicionais dentro da consulta.",
    syntax: "CASE\n  WHEN condicao THEN valor\n  ELSE outro_valor\nEND",
    example: "SELECT id,\n  CASE WHEN total >= 500 THEN 'alto' ELSE 'padrao' END AS faixa\nFROM pedidos;",
    best: "Use CASE para classificar resultados sem criar colunas fisicas.",
    avoid: "Nao coloque regras de negocio enormes sem documentar a intencao.",
  },
  {
    name: "COALESCE",
    group: "Expressao",
    level: "Intermediario",
    description: "Retorna o primeiro valor nao nulo de uma lista.",
    syntax: "SELECT COALESCE(coluna, valor_padrao)\nFROM tabela;",
    example: "SELECT COALESCE(status, 'sem status') AS status_tratado\nFROM pedidos;",
    best: "Use para exibir valores padrao ou tratar nulos em calculos.",
    avoid: "Nao esconda problemas de qualidade de dados sem investigar a causa.",
  },
  {
    name: "CAST",
    group: "Expressao",
    level: "Intermediario",
    description: "Converte um valor para outro tipo de dado.",
    syntax: "SELECT CAST(coluna AS tipo)\nFROM tabela;",
    example: "SELECT CAST(total AS INTEGER) AS total_inteiro\nFROM pedidos;",
    best: "Use quando a conversao deixa calculos ou comparacoes corretos.",
    avoid: "Nao force conversoes que podem truncar ou perder informacao importante.",
  },
  {
    name: "ROUND",
    group: "Funcao",
    level: "Basico",
    description: "Arredonda valores numericos para uma quantidade de casas decimais.",
    syntax: "SELECT ROUND(valor, casas_decimais);",
    example: "SELECT ROUND(AVG(total), 2) AS ticket_medio\nFROM pedidos;",
    best: "Use para apresentacao de metricas monetarias e medias.",
    avoid: "Evite arredondar etapas intermediarias de calculos financeiros.",
  },
  {
    name: "SUBQUERY",
    group: "Subconsulta",
    level: "Intermediario",
    description: "Usa uma consulta dentro de outra para filtrar, calcular ou comparar resultados.",
    syntax: "SELECT colunas\nFROM tabela\nWHERE coluna IN (SELECT coluna FROM outra_tabela);",
    example: "SELECT nome\nFROM clientes\nWHERE id IN (SELECT cliente_id FROM pedidos WHERE total > 500);",
    best: "Use subqueries quando elas expressam melhor uma etapa logica.",
    avoid: "Nao aninhe muitas subqueries se uma CTE deixaria a leitura mais clara.",
  },
  {
    name: "EXISTS",
    group: "Subconsulta",
    level: "Intermediario",
    description: "Verifica se uma subconsulta retorna pelo menos uma linha.",
    syntax: "SELECT colunas\nFROM tabela t\nWHERE EXISTS (SELECT 1 FROM outra o WHERE o.t_id = t.id);",
    example: "SELECT c.nome\nFROM clientes c\nWHERE EXISTS (SELECT 1 FROM pedidos p WHERE p.cliente_id = c.id);",
    best: "Use EXISTS para checar existencia sem precisar trazer os dados da subconsulta.",
    avoid: "Nao selecione colunas desnecessarias dentro do EXISTS.",
  },
  {
    name: "CTE",
    group: "Organizacao",
    level: "Avancado",
    description: "Cria uma consulta nomeada temporaria para organizar raciocinios maiores.",
    syntax: "WITH nome_cte AS (\n  SELECT ...\n)\nSELECT *\nFROM nome_cte;",
    example: "WITH vendas_cliente AS (\n  SELECT cliente_id, SUM(total) AS receita\n  FROM pedidos\n  GROUP BY cliente_id\n)\nSELECT *\nFROM vendas_cliente;",
    best: "Quebre queries longas em etapas com nomes de negocio.",
    avoid: "Nao transforme cada linha em uma CTE sem necessidade.",
  },
  {
    name: "WITH RECURSIVE",
    group: "Organizacao",
    level: "Avancado",
    description: "Cria CTEs recursivas para percorrer hierarquias ou gerar sequencias.",
    syntax: "WITH RECURSIVE cte AS (\n  SELECT valor_inicial\n  UNION ALL\n  SELECT proximo_valor FROM cte WHERE condicao\n)\nSELECT * FROM cte;",
    example: "WITH RECURSIVE numeros(n) AS (\n  SELECT 1\n  UNION ALL\n  SELECT n + 1 FROM numeros WHERE n < 5\n)\nSELECT n FROM numeros;",
    best: "Defina uma condicao de parada clara.",
    avoid: "Nao rode recursao sem limite, ela pode travar ou consumir muitos recursos.",
  },
  {
    name: "ROW_NUMBER",
    group: "Window function",
    level: "Avancado",
    description: "Numera linhas dentro de uma janela ordenada.",
    syntax: "ROW_NUMBER() OVER (PARTITION BY coluna ORDER BY coluna_ordem)",
    example: "SELECT cliente_id, total,\n  ROW_NUMBER() OVER (PARTITION BY cliente_id ORDER BY total DESC) AS ranking\nFROM pedidos;",
    best: "Use para escolher top N por grupo ou deduplicar registros.",
    avoid: "Nao use sem ORDER BY quando a ordem precisa ser deterministica.",
  },
  {
    name: "RANK / DENSE_RANK",
    group: "Window function",
    level: "Avancado",
    description: "Cria rankings considerando empates.",
    syntax: "RANK() OVER (ORDER BY metrica DESC)",
    example: "SELECT id, total,\n  RANK() OVER (ORDER BY total DESC) AS posicao\nFROM pedidos;",
    best: "Use RANK quando empates devem pular posicoes e DENSE_RANK quando nao devem.",
    avoid: "Nao confunda ranking com ordenacao simples.",
  },
  {
    name: "LAG / LEAD",
    group: "Window function",
    level: "Avancado",
    description: "Acessa valores de linhas anteriores ou seguintes dentro de uma janela.",
    syntax: "LAG(coluna) OVER (PARTITION BY grupo ORDER BY data)",
    example: "SELECT id, total,\n  LAG(total) OVER (ORDER BY criado_em) AS total_anterior\nFROM pedidos;",
    best: "Use para comparar evolucao entre registros.",
    avoid: "Nao esqueca que a primeira ou ultima linha pode retornar nulo.",
  },
  {
    name: "OVER / PARTITION BY",
    group: "Window function",
    level: "Avancado",
    description: "Define a janela usada por funcoes analiticas sem reduzir linhas como GROUP BY.",
    syntax: "funcao() OVER (PARTITION BY grupo ORDER BY ordem)",
    example: "SELECT cliente_id, total,\n  SUM(total) OVER (PARTITION BY cliente_id) AS total_cliente\nFROM pedidos;",
    best: "Use para mostrar detalhe e agregado na mesma linha.",
    avoid: "Nao substitua GROUP BY quando voce realmente quer uma linha por grupo.",
  },
  {
    name: "CREATE TABLE",
    group: "DDL",
    level: "Basico",
    description: "Cria uma tabela e define suas colunas.",
    syntax: "CREATE TABLE tabela (\n  id INTEGER PRIMARY KEY,\n  nome TEXT NOT NULL\n);",
    example: "CREATE TABLE categorias (\n  id INTEGER PRIMARY KEY,\n  nome TEXT NOT NULL\n);",
    best: "Defina tipos, chaves e obrigatoriedade desde o inicio.",
    avoid: "Nao crie tabelas sem uma chave primaria clara.",
  },
  {
    name: "ALTER TABLE",
    group: "DDL",
    level: "Intermediario",
    description: "Altera a estrutura de uma tabela existente.",
    syntax: "ALTER TABLE tabela ADD COLUMN coluna tipo;",
    example: "ALTER TABLE clientes ADD COLUMN email TEXT;",
    best: "Planeje alteracoes pensando em dados existentes e compatibilidade.",
    avoid: "Nao altere estrutura de producao sem backup e plano de rollback.",
  },
  {
    name: "DROP TABLE",
    group: "DDL",
    level: "Intermediario",
    description: "Remove uma tabela e seus dados.",
    syntax: "DROP TABLE tabela;",
    example: "DROP TABLE categorias;",
    best: "Use apenas quando a remocao e intencional e reversivel por backup.",
    avoid: "Nao rode DROP em ambiente errado ou sem confirmar dependencias.",
  },
  {
    name: "CREATE VIEW",
    group: "DDL",
    level: "Intermediario",
    description: "Cria uma consulta reutilizavel como se fosse uma tabela virtual.",
    syntax: "CREATE VIEW nome_view AS\nSELECT colunas FROM tabela;",
    example: "CREATE VIEW vw_pedidos_clientes AS\nSELECT p.id, c.nome, p.total\nFROM pedidos p\nJOIN clientes c ON c.id = p.cliente_id;",
    best: "Use views para padronizar leituras frequentes.",
    avoid: "Nao esconda regras muito pesadas em views sem medir performance.",
  },
  {
    name: "CREATE INDEX",
    group: "Performance",
    level: "Intermediario",
    description: "Cria uma estrutura para acelerar filtros, ordenacoes e joins.",
    syntax: "CREATE INDEX nome_indice ON tabela(coluna);",
    example: "CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_id);",
    best: "Crie indices em colunas muito usadas em WHERE, JOIN e ORDER BY.",
    avoid: "Nao crie indice em tudo, pois isso aumenta custo de escrita e armazenamento.",
  },
  {
    name: "DROP INDEX",
    group: "Performance",
    level: "Intermediario",
    description: "Remove um indice existente.",
    syntax: "DROP INDEX nome_indice;",
    example: "DROP INDEX idx_pedidos_cliente;",
    best: "Remova indices que nao sao usados ou que prejudicam escritas.",
    avoid: "Nao remova antes de verificar planos de execucao e consultas dependentes.",
  },
  {
    name: "EXPLAIN",
    group: "Performance",
    level: "Avancado",
    description: "Mostra como o banco pretende executar uma consulta.",
    syntax: "EXPLAIN QUERY PLAN\nSELECT colunas FROM tabela;",
    example: "EXPLAIN QUERY PLAN\nSELECT * FROM pedidos WHERE cliente_id = 1;",
    best: "Use para investigar lentidao e validar uso de indices.",
    avoid: "Nao otimize no escuro sem olhar volume, plano e frequencia da query.",
  },
  {
    name: "INSERT",
    group: "DML",
    level: "Basico",
    description: "Adiciona novas linhas em uma tabela.",
    syntax: "INSERT INTO tabela (coluna_1, coluna_2)\nVALUES (valor_1, valor_2);",
    example: "INSERT INTO clientes (id, nome, cidade, segmento, criado_em)\nVALUES (6, 'Luiza Martins', 'Recife', 'B2C', '2026-05-01');",
    best: "Informe as colunas explicitamente para evitar erro se a tabela mudar.",
    avoid: "Nao dependa da ordem fisica das colunas.",
  },
  {
    name: "UPDATE",
    group: "DML",
    level: "Intermediario",
    description: "Altera valores de linhas existentes.",
    syntax: "UPDATE tabela\nSET coluna = valor\nWHERE condicao;",
    example: "UPDATE pedidos\nSET status = 'enviado'\nWHERE id = 1042;",
    best: "Teste o WHERE com SELECT antes de atualizar.",
    avoid: "Nunca rode UPDATE sem WHERE quando a intencao nao for atualizar tudo.",
  },
  {
    name: "DELETE",
    group: "DML",
    level: "Intermediario",
    description: "Remove linhas de uma tabela.",
    syntax: "DELETE FROM tabela\nWHERE condicao;",
    example: "DELETE FROM pedidos\nWHERE status = 'cancelado';",
    best: "Valide as linhas afetadas com SELECT antes de remover.",
    avoid: "Nao rode DELETE sem filtro em ambientes com dados reais.",
  },
  {
    name: "TRUNCATE",
    group: "DML",
    level: "Intermediario",
    description: "Remove todas as linhas de uma tabela de forma rapida em bancos que suportam o comando.",
    syntax: "TRUNCATE TABLE tabela;",
    example: "TRUNCATE TABLE staging_importacao;",
    best: "Use em tabelas temporarias ou de carga quando todo conteudo deve ser apagado.",
    avoid: "Lembre que SQLite nao suporta TRUNCATE nativo.",
  },
  {
    name: "PRIMARY KEY",
    group: "Constraint",
    level: "Basico",
    description: "Define a coluna que identifica unicamente cada linha da tabela.",
    syntax: "id INTEGER PRIMARY KEY",
    example: "CREATE TABLE categorias (\n  id INTEGER PRIMARY KEY,\n  nome TEXT NOT NULL\n);",
    best: "Toda tabela de entidade deve ter uma chave primaria estavel.",
    avoid: "Nao use valores que podem mudar como chave primaria.",
  },
  {
    name: "FOREIGN KEY",
    group: "Constraint",
    level: "Intermediario",
    description: "Cria uma relacao entre tabelas e ajuda a proteger integridade referencial.",
    syntax: "FOREIGN KEY (coluna) REFERENCES outra_tabela(id)",
    example: "FOREIGN KEY (cliente_id) REFERENCES clientes(id)",
    best: "Use para representar relacionamentos reais entre entidades.",
    avoid: "Nao ignore chaves estrangeiras quando a consistencia dos dados importa.",
  },
  {
    name: "NOT NULL",
    group: "Constraint",
    level: "Basico",
    description: "Impede que uma coluna receba valores nulos.",
    syntax: "coluna tipo NOT NULL",
    example: "nome TEXT NOT NULL",
    best: "Use em campos obrigatorios para o negocio.",
    avoid: "Nao marque como obrigatorio algo que pode estar ausente legitimamente.",
  },
  {
    name: "UNIQUE",
    group: "Constraint",
    level: "Basico",
    description: "Garante que os valores de uma coluna ou conjunto de colunas nao se repitam.",
    syntax: "coluna tipo UNIQUE",
    example: "email TEXT UNIQUE",
    best: "Use para documentos, emails, slugs e codigos que devem ser exclusivos.",
    avoid: "Nao substitua validacao de negocio complexa apenas por UNIQUE.",
  },
  {
    name: "CHECK",
    group: "Constraint",
    level: "Intermediario",
    description: "Garante que valores obedecam uma regra definida.",
    syntax: "CHECK (condicao)",
    example: "total REAL CHECK (total >= 0)",
    best: "Use para limites simples e regras invariantes.",
    avoid: "Nao coloque regras que mudam com frequencia dentro de constraints rigidas.",
  },
  {
    name: "DEFAULT",
    group: "Constraint",
    level: "Basico",
    description: "Define um valor padrao quando nenhum valor e informado.",
    syntax: "coluna tipo DEFAULT valor",
    example: "status TEXT DEFAULT 'pendente'",
    best: "Use para estados iniciais previsiveis.",
    avoid: "Nao use default para esconder informacao obrigatoria ausente.",
  },
  {
    name: "TRANSACTION",
    group: "Controle",
    level: "Intermediario",
    description: "Agrupa operacoes para confirmar tudo junto ou desfazer em caso de erro.",
    syntax: "BEGIN;\n-- comandos\nCOMMIT;",
    example: "BEGIN;\nUPDATE pedidos SET status = 'pago' WHERE id = 1042;\nCOMMIT;",
    best: "Use transacoes para alteracoes que precisam ser atomicas.",
    avoid: "Nao deixe transacoes abertas por muito tempo.",
  },
  {
    name: "ROLLBACK",
    group: "Controle",
    level: "Intermediario",
    description: "Desfaz alteracoes realizadas dentro de uma transacao ainda nao confirmada.",
    syntax: "BEGIN;\n-- comandos\nROLLBACK;",
    example: "BEGIN;\nDELETE FROM pedidos WHERE status = 'cancelado';\nROLLBACK;",
    best: "Use durante testes ou quando uma etapa da transacao falhar.",
    avoid: "Nao espere rollback funcionar depois que o commit ja foi feito.",
  },
];

export const commandOutputs: Record<string, CommandOutput> = {
  SELECT: {
    kind: "table",
    columns: ["nome", "cidade"],
    rows: [
      ["Ana Lima", "Sao Paulo"],
      ["Joao Pedro", "Curitiba"],
      ["Bia Rocha", "Rio de Janeiro"],
    ],
  },
  FROM: {
    kind: "table",
    columns: ["nome", "cidade"],
    rows: [
      ["Ana Lima", "Sao Paulo"],
      ["Joao Pedro", "Curitiba"],
      ["Bia Rocha", "Rio de Janeiro"],
    ],
  },
  WHERE: {
    kind: "table",
    columns: ["nome", "cidade"],
    rows: [
      ["Ana Lima", "Sao Paulo"],
      ["Camila Torres", "Sao Paulo"],
      ["Marina Costa", "Sao Paulo"],
      ["Tiago Barros", "Sao Paulo"],
    ],
  },
  "AND / OR": {
    kind: "table",
    columns: ["nome", "cidade"],
    rows: [["Marina Costa", "Sao Paulo"]],
  },
  IN: {
    kind: "table",
    columns: ["nome", "cidade"],
    rows: [
      ["Ana Lima", "Sao Paulo"],
      ["Joao Pedro", "Curitiba"],
      ["Marina Costa", "Sao Paulo"],
    ],
  },
  BETWEEN: {
    kind: "table",
    columns: ["id", "total"],
    rows: [
      [1042, 820],
      [1048, 560],
      [1051, 310],
    ],
  },
  LIKE: {
    kind: "table",
    columns: ["nome"],
    rows: [["Ana Lima"]],
  },
  "IS NULL": {
    kind: "table",
    columns: ["id", "status"],
    rows: [],
  },
  DISTINCT: {
    kind: "table",
    columns: ["cidade"],
    rows: [["Sao Paulo"], ["Curitiba"], ["Rio de Janeiro"], ["Belo Horizonte"], ["Recife"], ["Porto Alegre"], ["Florianopolis"]],
  },
  "ORDER BY": {
    kind: "table",
    columns: ["nome", "cidade"],
    rows: [
      ["Ana Lima", "Sao Paulo"],
      ["Bia Rocha", "Rio de Janeiro"],
      ["Joao Pedro", "Curitiba"],
    ],
  },
  LIMIT: {
    kind: "table",
    columns: ["id", "total"],
    rows: [
      [1066, 1490],
      [1061, 1120],
      [1052, 980],
    ],
  },
  OFFSET: {
    kind: "table",
    columns: ["id", "nome"],
    rows: [
      [3, "Bia Rocha"],
      [2, "Joao Pedro"],
    ],
  },
  "GROUP BY": {
    kind: "table",
    columns: ["cidade", "total_clientes"],
    rows: [
      ["Sao Paulo", 4],
      ["Belo Horizonte", 2],
      ["Curitiba", 2],
    ],
  },
  COUNT: {
    kind: "table",
    columns: ["total_clientes"],
    rows: [[12]],
  },
  SUM: {
    kind: "table",
    columns: ["receita_total"],
    rows: [[7863]],
  },
  AVG: {
    kind: "table",
    columns: ["ticket_medio"],
    rows: [[604.85]],
  },
  "MIN / MAX": {
    kind: "table",
    columns: ["menor_pedido", "maior_pedido"],
    rows: [[88, 1490]],
  },
  JOIN: {
    kind: "table",
    columns: ["id", "nome", "total"],
    rows: [
      [1042, "Ana Lima", 820],
      [1048, "Joao Pedro", 560],
    ],
  },
  "INNER JOIN": {
    kind: "table",
    columns: ["id", "nome"],
    rows: [
      [1042, "Ana Lima"],
      [1048, "Joao Pedro"],
    ],
  },
  "LEFT JOIN": {
    kind: "table",
    columns: ["nome", "pedido_id"],
    rows: [
      ["Ana Lima", 1042],
      ["Rafael Nunes", ""],
    ],
  },
  "RIGHT JOIN": {
    kind: "message",
    text: "Retorna todos os pedidos e os clientes relacionados. Em SQLite, reescreva como LEFT JOIN invertendo a ordem das tabelas.",
  },
  "FULL OUTER JOIN": {
    kind: "message",
    text: "Retornaria registros correspondentes e nao correspondentes dos dois lados. SQLite nao possui suporte nativo a FULL OUTER JOIN.",
  },
  "CROSS JOIN": {
    kind: "table",
    columns: ["nome", "produto"],
    rows: [
      ["Ana Lima", "Curso SQL Essencial"],
      ["Ana Lima", "Livro Modelagem de Dados"],
      ["Joao Pedro", "Curso SQL Essencial"],
    ],
  },
  UNION: {
    kind: "table",
    columns: ["cidade"],
    rows: [["Sao Paulo"], ["Curitiba"], ["Rio de Janeiro"], ["Belo Horizonte"]],
  },
  "UNION ALL": {
    kind: "table",
    columns: ["cidade"],
    rows: [["Sao Paulo"], ["Sao Paulo"], ["Curitiba"]],
  },
  HAVING: {
    kind: "table",
    columns: ["cliente_id", "receita"],
    rows: [
      [1, 940],
      [2, 560],
      [4, 980],
      [7, 1208],
      [10, 1490],
    ],
  },
  CASE: {
    kind: "table",
    columns: ["id", "faixa"],
    rows: [
      [1042, "alto"],
      [1051, "padrao"],
    ],
  },
  COALESCE: {
    kind: "table",
    columns: ["status_tratado"],
    rows: [["pago"], ["enviado"], ["sem status"]],
  },
  CAST: {
    kind: "table",
    columns: ["total_inteiro"],
    rows: [[820], [560], [310]],
  },
  ROUND: {
    kind: "table",
    columns: ["ticket_medio"],
    rows: [[604.85]],
  },
  SUBQUERY: {
    kind: "table",
    columns: ["nome"],
    rows: [["Ana Lima"], ["Joao Pedro"], ["Marina Costa"]],
  },
  EXISTS: {
    kind: "table",
    columns: ["nome"],
    rows: [["Ana Lima"], ["Joao Pedro"], ["Bia Rocha"], ["Marina Costa"]],
  },
  CTE: {
    kind: "table",
    columns: ["cliente_id", "receita"],
    rows: [
      [1, 940],
      [2, 560],
      [3, 310],
    ],
  },
  "WITH RECURSIVE": {
    kind: "table",
    columns: ["n"],
    rows: [[1], [2], [3], [4], [5]],
  },
  ROW_NUMBER: {
    kind: "table",
    columns: ["cliente_id", "total", "ranking"],
    rows: [
      [1, 820, 1],
      [1, 120, 2],
      [2, 560, 1],
    ],
  },
  "RANK / DENSE_RANK": {
    kind: "table",
    columns: ["id", "total", "posicao"],
    rows: [
      [1066, 1490, 1],
      [1061, 1120, 2],
      [1052, 980, 3],
    ],
  },
  "LAG / LEAD": {
    kind: "table",
    columns: ["id", "total", "total_anterior"],
    rows: [
      [1042, 820, ""],
      [1048, 560, 820],
      [1051, 310, 560],
    ],
  },
  "OVER / PARTITION BY": {
    kind: "table",
    columns: ["cliente_id", "total", "total_cliente"],
    rows: [
      [1, 820, 940],
      [1, 120, 940],
      [2, 560, 560],
    ],
  },
  "CREATE TABLE": {
    kind: "message",
    text: "Tabela categorias criada com as colunas id e nome.",
  },
  "ALTER TABLE": {
    kind: "message",
    text: "Coluna email adicionada na tabela clientes.",
  },
  "DROP TABLE": {
    kind: "message",
    text: "Tabela categorias removida do banco de dados.",
  },
  "CREATE VIEW": {
    kind: "message",
    text: "View vw_pedidos_clientes criada para reutilizar a consulta de pedidos com clientes.",
  },
  "CREATE INDEX": {
    kind: "message",
    text: "Indice idx_pedidos_cliente criado sobre pedidos(cliente_id).",
  },
  "DROP INDEX": {
    kind: "message",
    text: "Indice idx_pedidos_cliente removido.",
  },
  EXPLAIN: {
    kind: "table",
    columns: ["detail"],
    rows: [["SEARCH pedidos USING INDEX idx_pedidos_cliente (cliente_id=?)"]],
  },
  INSERT: {
    kind: "message",
    text: "1 linha inserida em clientes.",
  },
  UPDATE: {
    kind: "message",
    text: "1 linha atualizada em pedidos.",
  },
  DELETE: {
    kind: "message",
    text: "Linhas com status cancelado removidas de pedidos.",
  },
  TRUNCATE: {
    kind: "message",
    text: "Todas as linhas da tabela seriam removidas. SQLite nao possui TRUNCATE nativo.",
  },
  "PRIMARY KEY": {
    kind: "message",
    text: "A coluna id passa a identificar unicamente cada registro da tabela.",
  },
  "FOREIGN KEY": {
    kind: "message",
    text: "cliente_id passa a apontar para clientes(id), preservando a relacao entre pedidos e clientes.",
  },
  "NOT NULL": {
    kind: "message",
    text: "A coluna nome passa a exigir valor em toda insercao.",
  },
  UNIQUE: {
    kind: "message",
    text: "Valores duplicados passam a ser bloqueados nessa coluna.",
  },
  CHECK: {
    kind: "message",
    text: "Valores negativos em total passam a ser rejeitados.",
  },
  DEFAULT: {
    kind: "message",
    text: "Quando status nao for informado, o banco usara pendente.",
  },
  TRANSACTION: {
    kind: "message",
    text: "Alteracoes executadas entre BEGIN e COMMIT sao confirmadas juntas.",
  },
  ROLLBACK: {
    kind: "message",
    text: "Alteracoes feitas dentro da transacao sao desfeitas antes do COMMIT.",
  },
};

export const examples: QueryExample[] = [
  {
    label: "Clientes de Sao Paulo",
    query: "SELECT nome, cidade, segmento\nFROM clientes\nWHERE cidade = 'Sao Paulo'\nORDER BY nome ASC;",
  },
  {
    label: "Pedidos com cliente",
    query: "SELECT p.id, c.nome, p.status, p.total\nFROM pedidos p\nINNER JOIN clientes c ON c.id = p.cliente_id\nORDER BY p.total DESC;",
  },
  {
    label: "Receita por categoria",
    query: "SELECT pr.categoria, ROUND(SUM(i.quantidade * i.preco_unitario), 2) AS receita\nFROM itens_pedido i\nINNER JOIN produtos pr ON pr.id = i.produto_id\nGROUP BY pr.categoria\nORDER BY receita DESC;",
  },
  {
    label: "Clientes acima de 500",
    query: "SELECT c.nome, ROUND(SUM(p.total), 2) AS receita\nFROM clientes c\nINNER JOIN pedidos p ON p.cliente_id = c.id\nGROUP BY c.nome\nHAVING SUM(p.total) > 500\nORDER BY receita DESC;",
  },
];

export const challenges: Challenge[] = [
  {
    title: "Filtrar clientes",
    text: "Liste clientes da cidade Sao Paulo.",
    tag: "WHERE",
    starter: "SELECT nome, cidade\nFROM clientes\nWHERE cidade = 'Sao Paulo'\nORDER BY nome ASC;",
    hint: "Use WHERE para filtrar a cidade e ORDER BY para manter a saida previsivel.",
    expectedResult: {
      columns: ["nome", "cidade"],
      rows: [
        ["Ana Lima", "Sao Paulo"],
        ["Camila Torres", "Sao Paulo"],
        ["Marina Costa", "Sao Paulo"],
        ["Tiago Barros", "Sao Paulo"],
      ],
    },
    successMessage: "Boa! Voce filtrou apenas os clientes de Sao Paulo.",
  },
  {
    title: "Ordenar vendas",
    text: "Mostre pedidos do maior para o menor total.",
    tag: "ORDER BY",
    starter: "SELECT id, status, total\nFROM pedidos\nORDER BY total DESC;",
    hint: "A coluna total precisa ser ordenada em ordem decrescente.",
    expectedResult: {
      columns: ["id", "status", "total"],
      rows: [
        [1066, "pago", 1490],
        [1061, "pago", 1120],
        [1052, "pago", 980],
        [1042, "pago", 820],
        [1062, "enviado", 735],
        [1059, "pago", 690],
        [1048, "enviado", 560],
        [1068, "pendente", 480],
        [1051, "pago", 310],
        [1064, "pago", 260],
        [1070, "pago", 210],
        [1057, "cancelado", 120],
        [1069, "cancelado", 88],
      ],
    },
    successMessage: "Perfeito. Os pedidos estao ordenados pelo maior valor.",
  },
  {
    title: "Juntar tabelas",
    text: "Exiba nome do cliente ao lado do pedido.",
    tag: "JOIN",
    starter: "SELECT p.id, c.nome, p.total\nFROM pedidos p\nINNER JOIN clientes c ON c.id = p.cliente_id\nORDER BY p.id ASC;",
    hint: "Relacione pedidos.cliente_id com clientes.id.",
    expectedResult: {
      columns: ["id", "nome", "total"],
      rows: [
        [1042, "Ana Lima", 820],
        [1048, "Joao Pedro", 560],
        [1051, "Bia Rocha", 310],
        [1052, "Marina Costa", 980],
        [1057, "Ana Lima", 120],
        [1059, "Luiza Martins", 690],
        [1061, "Camila Torres", 1120],
        [1062, "Pedro Araujo", 735],
        [1064, "Sofia Mendes", 260],
        [1066, "Diego Ramos", 1490],
        [1068, "Helena Freitas", 480],
        [1069, "Camila Torres", 88],
        [1070, "Tiago Barros", 210],
      ],
    },
    successMessage: "Mandou bem. O JOIN trouxe pedidos com seus clientes.",
  },
  {
    title: "Agrupar metricas",
    text: "Calcule total de clientes por cidade.",
    tag: "GROUP BY",
    starter: "SELECT cidade, COUNT(*) AS total_clientes\nFROM clientes\nGROUP BY cidade\nORDER BY total_clientes DESC, cidade ASC;",
    hint: "Use COUNT(*) e agrupe pela coluna cidade.",
    expectedResult: {
      columns: ["cidade", "total_clientes"],
      rows: [
        ["Sao Paulo", 4],
        ["Belo Horizonte", 2],
        ["Curitiba", 2],
        ["Florianopolis", 1],
        ["Porto Alegre", 1],
        ["Recife", 1],
        ["Rio de Janeiro", 1],
      ],
    },
    successMessage: "Certo. A consulta agrupou clientes por cidade.",
  },
  {
    title: "Filtrar agregados",
    text: "Mostre clientes com receita acima de 500.",
    tag: "HAVING",
    starter: "SELECT c.nome, SUM(p.total) AS receita\nFROM clientes c\nINNER JOIN pedidos p ON p.cliente_id = c.id\nGROUP BY c.nome\nHAVING SUM(p.total) > 500\nORDER BY receita DESC;",
    hint: "Depois do GROUP BY, use HAVING para filtrar a soma dos pedidos.",
    expectedResult: {
      columns: ["nome", "receita"],
      rows: [
        ["Diego Ramos", 1490],
        ["Camila Torres", 1208],
        ["Marina Costa", 980],
        ["Ana Lima", 940],
        ["Pedro Araujo", 735],
        ["Luiza Martins", 690],
        ["Joao Pedro", 560],
      ],
    },
    successMessage: "Excelente. Voce filtrou uma metrica agregada com HAVING.",
  },
];

export const practices: Practice[] = [
  {
    title: "Nomeie bem os aliases",
    text: "Aliases devem explicar a metrica ou entidade com clareza.",
    bad: "SELECT COUNT(*) AS x FROM clientes;",
    good: "SELECT COUNT(*) AS total_clientes FROM clientes;",
  },
  {
    title: "Filtre cedo",
    text: "Use WHERE antes de agregar para reduzir dados processados.",
    bad: "GROUP BY cidade HAVING cidade = 'Sao Paulo'",
    good: "WHERE cidade = 'Sao Paulo' GROUP BY cidade",
  },
  {
    title: "Proteja updates",
    text: "Antes de UPDATE ou DELETE, valide o mesmo filtro com SELECT.",
    bad: "DELETE FROM pedidos;",
    good: "SELECT * FROM pedidos WHERE status = 'cancelado';",
  },
  {
    title: "Leia joins com calma",
    text: "Todo JOIN precisa comunicar qual relacao esta sendo usada.",
    bad: "FROM pedidos p JOIN clientes c",
    good: "FROM pedidos p JOIN clientes c ON c.id = p.cliente_id",
  },
];

export const databaseSeed = `
CREATE TABLE clientes (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  cidade TEXT NOT NULL,
  segmento TEXT NOT NULL,
  criado_em TEXT NOT NULL
);

CREATE TABLE pedidos (
  id INTEGER PRIMARY KEY,
  cliente_id INTEGER NOT NULL,
  status TEXT NOT NULL,
  total REAL NOT NULL,
  criado_em TEXT NOT NULL,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

CREATE TABLE produtos (
  id INTEGER PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  preco REAL NOT NULL
);

CREATE TABLE itens_pedido (
  pedido_id INTEGER NOT NULL,
  produto_id INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  preco_unitario REAL NOT NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
  FOREIGN KEY (produto_id) REFERENCES produtos(id)
);

INSERT INTO clientes VALUES
  (1, 'Ana Lima', 'Sao Paulo', 'B2C', '2026-01-12'),
  (2, 'Joao Pedro', 'Curitiba', 'B2B', '2026-01-17'),
  (3, 'Bia Rocha', 'Rio de Janeiro', 'B2C', '2026-02-03'),
  (4, 'Marina Costa', 'Sao Paulo', 'B2B', '2026-02-12'),
  (5, 'Rafael Nunes', 'Belo Horizonte', 'B2C', '2026-03-02'),
  (6, 'Luiza Martins', 'Recife', 'B2C', '2026-03-08'),
  (7, 'Camila Torres', 'Sao Paulo', 'B2C', '2026-03-14'),
  (8, 'Pedro Araujo', 'Belo Horizonte', 'B2B', '2026-03-19'),
  (9, 'Sofia Mendes', 'Porto Alegre', 'B2C', '2026-03-23'),
  (10, 'Diego Ramos', 'Curitiba', 'B2B', '2026-03-28'),
  (11, 'Helena Freitas', 'Florianopolis', 'B2C', '2026-04-01'),
  (12, 'Tiago Barros', 'Sao Paulo', 'B2B', '2026-04-04');

INSERT INTO pedidos VALUES
  (1042, 1, 'pago', 820.00, '2026-04-02'),
  (1048, 2, 'enviado', 560.00, '2026-04-05'),
  (1051, 3, 'pago', 310.00, '2026-04-09'),
  (1052, 4, 'pago', 980.00, '2026-04-11'),
  (1057, 1, 'cancelado', 120.00, '2026-04-15'),
  (1059, 6, 'pago', 690.00, '2026-04-18'),
  (1061, 7, 'pago', 1120.00, '2026-04-20'),
  (1062, 8, 'enviado', 735.00, '2026-04-22'),
  (1064, 9, 'pago', 260.00, '2026-04-24'),
  (1066, 10, 'pago', 1490.00, '2026-04-26'),
  (1068, 11, 'pendente', 480.00, '2026-04-29'),
  (1069, 7, 'cancelado', 88.00, '2026-05-01'),
  (1070, 12, 'pago', 210.00, '2026-05-03');

INSERT INTO produtos VALUES
  (10, 'Curso SQL Essencial', 'Cursos', 220.00),
  (11, 'Livro Modelagem de Dados', 'Livros', 94.00),
  (12, 'Template Dashboard', 'Acessorios', 180.00),
  (13, 'Mentoria Dados', 'Cursos', 450.00),
  (14, 'Workshop Power BI', 'Cursos', 320.00),
  (15, 'Pacote Queries Prontas', 'Acessorios', 150.00),
  (16, 'Livro SQL Performance', 'Livros', 120.00),
  (17, 'Auditoria de Dashboard', 'Servicos', 580.00),
  (18, 'Template CRM Analytics', 'Acessorios', 260.00),
  (19, 'Curso Window Functions', 'Cursos', 390.00),
  (20, 'Checklist Data Quality', 'Acessorios', 88.00);

INSERT INTO itens_pedido VALUES
  (1042, 10, 2, 220.00),
  (1042, 12, 1, 180.00),
  (1048, 13, 1, 450.00),
  (1048, 11, 1, 94.00),
  (1051, 11, 2, 94.00),
  (1052, 12, 3, 180.00),
  (1052, 13, 1, 450.00),
  (1057, 11, 1, 94.00),
  (1059, 14, 1, 320.00),
  (1059, 15, 2, 150.00),
  (1061, 17, 1, 580.00),
  (1061, 19, 1, 390.00),
  (1061, 15, 1, 150.00),
  (1062, 14, 1, 320.00),
  (1062, 18, 1, 260.00),
  (1062, 20, 1, 88.00),
  (1064, 18, 1, 260.00),
  (1066, 17, 2, 580.00),
  (1066, 16, 1, 120.00),
  (1066, 20, 2, 88.00),
  (1068, 19, 1, 390.00),
  (1068, 20, 1, 88.00),
  (1069, 20, 1, 88.00),
  (1070, 15, 1, 150.00),
  (1070, 20, 1, 88.00);
`;
