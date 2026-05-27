import { useEffect, useMemo, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import initSqlJs, { type Database as SqlDatabase } from "sql.js";
import { BookOpen, CheckCircle2, Copy, Lightbulb, Play, Search, Sparkles } from "lucide-react";
import {
  challenges,
  commands,
  commandOutputs,
  databaseSeed,
  datasetMetrics,
  examples,
  levels,
  practices,
  schemaTables,
  type CommandGuide,
  type ViewId,
  views,
} from "./data";

type QueryResult = {
  columns: string[];
  rows: Array<Array<string | number | null>>;
};

type ChallengeFeedback = {
  tone: "success" | "error" | "info";
  text: string;
};

const emptyResult: QueryResult = {
  columns: ["status"],
  rows: [["Execute uma consulta para ver os dados."]],
};

function App() {
  const [activeView, setActiveView] = useState<ViewId>("dashboard");
  const [activeCommand, setActiveCommand] = useState<CommandGuide>(commands[0]);
  const [search, setSearch] = useState("");
  const [groupFilter, setGroupFilter] = useState("Todos");
  const [levelFilter, setLevelFilter] = useState<(typeof levels)[number]>("Todos");
  const [query, setQuery] = useState(examples[0].query);
  const [result, setResult] = useState<QueryResult>(emptyResult);
  const [db, setDb] = useState<SqlDatabase | null>(null);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [activeChallenge, setActiveChallenge] = useState(0);
  const [challengeQueries, setChallengeQueries] = useState(() => challenges.map((challenge) => challenge.starter));
  const [challengeResults, setChallengeResults] = useState<Record<number, QueryResult>>({});
  const [challengeFeedback, setChallengeFeedback] = useState<Record<number, ChallengeFeedback>>({});

  const filteredCommands = useMemo(() => {
    const term = search.trim().toLowerCase();
    return commands.filter((command) => {
      const matchesSearch = `${command.name} ${command.group} ${command.level}`.toLowerCase().includes(term);
      const matchesGroup = groupFilter === "Todos" || command.group === groupFilter;
      const matchesLevel = levelFilter === "Todos" || command.level === levelFilter;
      return matchesSearch && matchesGroup && matchesLevel;
    });
  }, [groupFilter, levelFilter, search]);

  const commandGroups = useMemo(() => ["Todos", ...Array.from(new Set(commands.map((command) => command.group))).sort()], []);

  useEffect(() => {
    let mounted = true;

    async function bootDatabase() {
      const SQL = await initSqlJs({
        locateFile: () => "/sql-wasm.wasm",
      });
      const database = new SQL.Database();
      database.run(databaseSeed);

      if (mounted) {
        setDb(database);
        executeQuery(examples[0].query, database);
      }
    }

    bootDatabase().catch((err: unknown) => {
      setError(err instanceof Error ? err.message : "Nao foi possivel iniciar o banco SQLite.");
    });

    return () => {
      mounted = false;
    };
  }, []);

  function runSql(nextQuery: string, database = db): QueryResult {
    if (!database) {
      throw new Error("Banco ainda esta carregando.");
    }

    const [firstResult] = database.exec(nextQuery);
    return firstResult
      ? {
          columns: firstResult.columns,
          rows: firstResult.values as QueryResult["rows"],
        }
      : {
          columns: ["status"],
          rows: [["Consulta executada sem retorno."]],
        };
  }

  function executeQuery(nextQuery = query, database = db) {
    try {
      const nextResult = runSql(nextQuery, database);
      setError("");
      setResult(nextResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao executar consulta.");
    }
  }

  function loadExample(index: number) {
    const nextQuery = examples[index].query;
    setQuery(nextQuery);
    executeQuery(nextQuery);
  }

  function openExample(index: number) {
    setActiveView("playground");
    loadExample(index);
  }

  function runCommandExample(command: CommandGuide) {
    setActiveView("playground");
    setQuery(command.example);
    if (/^\s*(select|with|explain)\b/i.test(command.example)) {
      executeQuery(command.example);
      return;
    }

    setError("");
    setResult({
      columns: ["status"],
      rows: [["Exemplo carregado no editor. Revise antes de executar, pois este comando altera dados ou estrutura."]],
    });
  }

  function loadChallenge(index: number) {
    setActiveChallenge(index);
    setChallengeQueries((current) => current.map((value, currentIndex) => (currentIndex === index ? challenges[index].starter : value)));
    setChallengeFeedback((current) => ({
      ...current,
      [index]: {
        tone: "info",
        text: "Exemplo inicial carregado. Execute e valide quando estiver satisfeito.",
      },
    }));
  }

  function updateChallengeQuery(index: number, nextQuery: string) {
    setChallengeQueries((current) => current.map((value, currentIndex) => (currentIndex === index ? nextQuery : value)));
  }

  function executeChallenge(index: number) {
    try {
      const nextResult = runSql(challengeQueries[index]);
      setChallengeResults((current) => ({ ...current, [index]: nextResult }));
      setChallengeFeedback((current) => ({
        ...current,
        [index]: {
          tone: "info",
          text: "Consulta executada. Confira a tabela e clique em Validar.",
        },
      }));
      return nextResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro ao executar desafio.";
      setChallengeFeedback((current) => ({
        ...current,
        [index]: {
          tone: "error",
          text: message,
        },
      }));
      return null;
    }
  }

  function validateChallenge(index: number) {
    const currentResult = executeChallenge(index);
    if (!currentResult) return;

    if (resultsMatch(currentResult, challenges[index].expectedResult)) {
      setCompleted((current) => new Set(current).add(index));
      setChallengeFeedback((current) => ({
        ...current,
        [index]: {
          tone: "success",
          text: challenges[index].successMessage,
        },
      }));
      return;
    }

    setChallengeFeedback((current) => ({
      ...current,
      [index]: {
        tone: "error",
        text: "Ainda nao bateu com a saida esperada. Compare colunas, filtros, ordem e agregacoes.",
      },
    }));
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Navegacao principal">
        <div className="brand">
          <div className="brand-mark">QL</div>
          <div>
            <strong>QueryLab</strong>
            <span>SQL</span>
          </div>
        </div>

        <nav className="main-nav">
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <button
                className={`nav-item ${activeView === view.id ? "active" : ""}`}
                key={view.id}
                onClick={() => setActiveView(view.id)}
                type="button"
              >
                <Icon size={18} />
                {view.label}
              </button>
            );
          })}
        </nav>

        <div className="schema-card">
          <p className="eyebrow">Schema</p>
          <h2>loja_online</h2>
          <div className="schema-list">
            {schemaTables.map((table) => {
              const Icon = table.icon;
              return (
                <details key={table.name}>
                  <summary>
                    <Icon size={16} />
                    {table.name}
                  </summary>
                  <p>{table.columns.join(", ")}</p>
                </details>
              );
            })}
          </div>
        </div>
      </aside>

      <main className="content">
        <section className="topbar">
          <div>
            <p className="eyebrow">Portfolio project</p>
            <h1>QueryLab SQL</h1>
          </div>
          <div className="status-pill">
            <Sparkles size={16} />
            SQLite no navegador
          </div>
        </section>

        {activeView === "dashboard" && (
          <section>
            <div className="dashboard-hero">
              <div>
                <p className="eyebrow">Visao geral</p>
                <h2>Laboratorio interativo para aprender SQL na pratica</h2>
                <p>
                  Explore comandos, rode consultas reais em SQLite, resolva desafios e consulte boas praticas em uma base
                  ficticia de loja online.
                </p>
              </div>
              <div className="hero-actions">
                <button className="ghost-button" onClick={() => setActiveView("playground")} type="button">
                  <Play size={16} />
                  Abrir playground
                </button>
                <button className="subtle-button" onClick={() => setActiveView("guide")} type="button">
                  <BookOpen size={16} />
                  Ver guia
                </button>
              </div>
            </div>

            <div className="metric-grid">
              {datasetMetrics.map((metric) => (
                <article className="metric-card" key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <p>{metric.detail}</p>
                </article>
              ))}
            </div>

            <div className="dashboard-grid">
              <article className="dashboard-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Progresso</p>
                    <h3>Desafios SQL</h3>
                  </div>
                  <span className="count-pill">{completed.size}/{challenges.length}</span>
                </div>
                <div className="progress-track" aria-label="Progresso dos desafios">
                  <span style={{ width: `${(completed.size / challenges.length) * 100}%` }} />
                </div>
                <p>Complete desafios com validacao por resultado real, nao apenas por palavra-chave.</p>
                <button className="subtle-button" onClick={() => setActiveView("challenges")} type="button">
                  <CheckCircle2 size={16} />
                  Continuar desafios
                </button>
              </article>

              <article className="dashboard-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Schema</p>
                    <h3>loja_online</h3>
                  </div>
                  <span className="count-pill">{schemaTables.length} tabelas</span>
                </div>
                <div className="schema-mini-grid">
                  {schemaTables.map((table) => (
                    <div key={table.name}>
                      <strong>{table.name}</strong>
                      <span>{table.columns.length} colunas</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="dashboard-panel wide-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">Consultas rapidas</p>
                    <h3>Comece por um exemplo</h3>
                  </div>
                </div>
                <div className="quick-query-grid">
                  {examples.map((example, index) => (
                    <button key={example.label} onClick={() => openExample(index)} type="button">
                      <span>{example.label}</span>
                      <code>{example.query.split("\n")[0]}</code>
                    </button>
                  ))}
                </div>
              </article>
            </div>
          </section>
        )}

        {activeView === "guide" && (
          <section>
            <div className="section-header">
              <div>
                <p className="eyebrow">Comandos</p>
                <h2>Aprenda SQL por consulta</h2>
              </div>
              <div className="guide-tools">
                <span className="count-pill">{filteredCommands.length}/{commands.length} comandos</span>
                <select aria-label="Filtrar por categoria" value={groupFilter} onChange={(event) => setGroupFilter(event.target.value)}>
                  {commandGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
                <select
                  aria-label="Filtrar por nivel"
                  value={levelFilter}
                  onChange={(event) => setLevelFilter(event.target.value as (typeof levels)[number])}
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <label className="search-box">
                  <Search size={18} />
                  <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar comando" />
                </label>
              </div>
            </div>

            <div className="guide-layout">
              <div className="command-list">
                {filteredCommands.length ? (
                  filteredCommands.map((command) => (
                    <button
                      className={`command-button ${activeCommand.name === command.name ? "active" : ""}`}
                      key={command.name}
                      onClick={() => setActiveCommand(command)}
                      type="button"
                    >
                      <span>
                        <strong>{command.name}</strong>
                        <small>{command.group}</small>
                      </span>
                      <span className="level-tag">{command.level}</span>
                    </button>
                  ))
                ) : (
                  <div className="empty-state">Nenhum comando encontrado para estes filtros.</div>
                )}
              </div>

              <article className="command-panel">
                <div className="command-title-row">
                  <div>
                    <p className="eyebrow">{activeCommand.group}</p>
                    <h2>{activeCommand.name}</h2>
                  </div>
                  <button className="ghost-button" onClick={() => runCommandExample(activeCommand)} type="button">
                    <Play size={16} />
                    Testar exemplo
                  </button>
                </div>
                <p>{activeCommand.description}</p>
                <pre>{activeCommand.syntax}</pre>
                <h3>Exemplo</h3>
                <pre>{activeCommand.example}</pre>
                <h3>Saida esperada</h3>
                <CommandOutputPreview output={commandOutputs[activeCommand.name]} />
                <div className="tip-row">
                  <div className="mini-panel">
                    <strong>Boa pratica</strong>
                    <p>{activeCommand.best}</p>
                  </div>
                  <div className="mini-panel">
                    <strong>Atencao</strong>
                    <p>{activeCommand.avoid}</p>
                  </div>
                </div>
              </article>
            </div>
          </section>
        )}

        {activeView === "playground" && (
          <section>
            <div className="section-header">
              <div>
                <p className="eyebrow">Editor</p>
                <h2>Execute SQL real</h2>
              </div>
              <select aria-label="Escolher exemplo" onChange={(event) => loadExample(Number(event.target.value))}>
                {examples.map((example, index) => (
                  <option key={example.label} value={index}>
                    {example.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="playground-grid">
              <div className="editor-panel">
                <div className="panel-toolbar">
                  <span>query.sql</span>
                  <button className="ghost-button" onClick={() => executeQuery()} type="button">
                    <Play size={16} />
                    Executar
                  </button>
                </div>
                <CodeMirror
                  basicSetup={{ lineNumbers: true, foldGutter: false }}
                  extensions={[sql()]}
                  height="430px"
                  onChange={setQuery}
                  theme="dark"
                  value={query}
                />
              </div>

              <div className="result-panel">
                <div className="panel-toolbar">
                  <span>Resultado</span>
                  <span>{result.rows.length} linhas</span>
                </div>
                {error ? (
                  <div className="error-box">{error}</div>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          {result.columns.map((column) => (
                            <th key={column}>{column}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows.map((row, rowIndex) => (
                          <tr key={`${row.join("-")}-${rowIndex}`}>
                            {row.map((cell, cellIndex) => (
                              <td key={`${String(cell)}-${cellIndex}`}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {activeView === "challenges" && (
          <section>
            <div className="section-header">
              <div>
                <p className="eyebrow">Pratica</p>
                <h2>Desafios com validacao real</h2>
              </div>
              <div className="progress">{completed.size}/{challenges.length}</div>
            </div>

            <div className="challenge-workspace">
              <div className="challenge-list">
                {challenges.map((challenge, index) => (
                  <button
                    className={`challenge-card ${activeChallenge === index ? "active" : ""} ${completed.has(index) ? "done" : ""}`}
                    key={challenge.title}
                    onClick={() => setActiveChallenge(index)}
                    type="button"
                  >
                    <span className="level-tag">{challenge.tag}</span>
                    <h3>{challenge.title}</h3>
                    <p>{challenge.text}</p>
                    {completed.has(index) && (
                      <span className="done-label">
                        <CheckCircle2 size={15} />
                        Concluido
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="challenge-lab">
                <div className="challenge-brief">
                  <div>
                    <span className="level-tag">{challenges[activeChallenge].tag}</span>
                    <h3>{challenges[activeChallenge].title}</h3>
                    <p>{challenges[activeChallenge].text}</p>
                  </div>
                  <div className="hint-box">
                    <Lightbulb size={17} />
                    {challenges[activeChallenge].hint}
                  </div>
                </div>

                <div className="playground-grid challenge-editor-grid">
                  <div className="editor-panel">
                    <div className="panel-toolbar">
                      <span>desafio.sql</span>
                      <div className="toolbar-actions">
                        <button className="subtle-button" onClick={() => loadChallenge(activeChallenge)} type="button">
                          <Copy size={16} />
                          Resetar
                        </button>
                        <button className="ghost-button" onClick={() => executeChallenge(activeChallenge)} type="button">
                          <Play size={16} />
                          Executar
                        </button>
                        <button className="ghost-button success-button" onClick={() => validateChallenge(activeChallenge)} type="button">
                          <CheckCircle2 size={16} />
                          Validar
                        </button>
                      </div>
                    </div>
                    <CodeMirror
                      basicSetup={{ lineNumbers: true, foldGutter: false }}
                      extensions={[sql()]}
                      height="340px"
                      onChange={(value) => updateChallengeQuery(activeChallenge, value)}
                      theme="dark"
                      value={challengeQueries[activeChallenge]}
                    />
                  </div>

                  <div className="result-panel">
                    <div className="panel-toolbar">
                      <span>Resultado do desafio</span>
                      <span>{(challengeResults[activeChallenge] ?? emptyResult).rows.length} linhas</span>
                    </div>
                    {challengeFeedback[activeChallenge] && (
                      <div className={`feedback-box ${challengeFeedback[activeChallenge].tone}`}>
                        {challengeFeedback[activeChallenge].text}
                      </div>
                    )}
                    <div className="table-wrap compact-table-wrap">
                      <ResultTable result={challengeResults[activeChallenge] ?? emptyResult} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeView === "practices" && (
          <section>
            <div className="section-header">
              <div>
                <p className="eyebrow">Qualidade</p>
                <h2>Boas praticas para queries</h2>
              </div>
            </div>
            <div className="practice-grid">
              {practices.map((practice) => (
                <article className="practice-card" key={practice.title}>
                  <h3>{practice.title}</h3>
                  <p>{practice.text}</p>
                  <div className="compare">
                    <code>{practice.bad}</code>
                    <code>{practice.good}</code>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function CommandOutputPreview({ output }: { output: (typeof commandOutputs)[string] | undefined }) {
  if (!output) {
    return <div className="output-message">Este exemplo nao possui saida cadastrada.</div>;
  }

  if (output.kind === "message") {
    return <div className="output-message">{output.text}</div>;
  }

  return (
    <div className="output-table-wrap">
      <table className="output-table">
        <thead>
          <tr>
            {output.columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {output.rows.length ? (
            output.rows.map((row, rowIndex) => (
              <tr key={`${row.join("-")}-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${String(cell)}-${cellIndex}`}>{cell === "" ? "NULL" : cell}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={output.columns.length}>Nenhuma linha retornada.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function ResultTable({ result }: { result: QueryResult }) {
  return (
    <table>
      <thead>
        <tr>
          {result.columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {result.rows.map((row, rowIndex) => (
          <tr key={`${row.join("-")}-${rowIndex}`}>
            {row.map((cell, cellIndex) => (
              <td key={`${String(cell)}-${cellIndex}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function resultsMatch(current: QueryResult, expected: QueryResult) {
  return normalizeResult(current) === normalizeResult(expected);
}

function normalizeResult(result: QueryResult) {
  return JSON.stringify({
    columns: result.columns.map((column) => column.trim().toLowerCase()),
    rows: result.rows.map((row) =>
      row.map((cell) => {
        if (typeof cell === "number") return Number(cell.toFixed(6));
        if (cell === null) return null;
        return String(cell).trim();
      }),
    ),
  });
}

export default App;
