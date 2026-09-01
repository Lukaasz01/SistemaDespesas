# Rastreador de Despesas

API REST em **Spring Boot** com autenticação JWT para controle de despesas pessoais, acompanhada de um front-end em **Angular**. Projeto construído para aprender o ecossistema Spring aplicando padrões de uma aplicação real: camadas separadas, DTOs, tratamento global de erros e segurança baseada em token.

## Funcionalidades

- **Autenticação com JWT** — login, geração de token e *logout* com revogação
- **Despesas** — cadastro, listagem, consulta por id e exclusão
- **Categorias** — CRUD completo para classificar as despesas
- **Rotas protegidas** — filtro valida o token a cada requisição
- **Validação de entrada** — Bean Validation nos dados recebidos
- **Erros padronizados** — respostas de erro consistentes em toda a API

## Endpoints

### Autenticação
| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/login` | Cadastra um usuário |
| `POST` | `/login/auth` | Autentica e devolve o token JWT |
| `POST` | `/login/logout` | Revoga o token atual |
| `DELETE` | `/login` | Remove o usuário |

### Despesas
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/despesas` | Lista as despesas |
| `GET` | `/despesas/{id}` | Busca uma despesa |
| `POST` | `/despesas` | Cria uma despesa |
| `DELETE` | `/despesas/{id}` | Remove uma despesa |

### Categorias
| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/categorias` | Lista as categorias |
| `GET` | `/categorias/{id}` | Busca uma categoria |
| `POST` | `/categorias` | Cria uma categoria |
| `PUT` | `/categorias/{id}` | Atualiza uma categoria |
| `DELETE` | `/categorias/{id}` | Remove uma categoria |

## Arquitetura

```
demoSpring/                     API — Spring Boot
  config/SecurityConfig         configuração do Spring Security
  filter/JwtFilter              valida o token em cada requisição
  controller/                   camada HTTP
  service/                      regras de negócio
  repository/                   acesso a dados (Spring Data JPA)
  model/                        entidades JPA
  dto/                          contratos de resposta
  exception/                    GlobalExceptionHandler e exceções próprias

rastreador-frontend/            SPA — Angular
```

## Stack

Java · Spring Boot · Spring Security · Spring Data JPA · Bean Validation · [java-jwt](https://github.com/auth0/java-jwt) (Auth0) · H2 · Maven · Angular · TypeScript

## Como rodar

**Pré-requisitos:** JDK 17+ e Node.js 18+. Não é preciso instalar banco de dados — o H2 roda em memória.

### API

```bash
cd demoSpring
./mvnw spring-boot:run
```

Disponível em `http://localhost:9000`. O console do H2 fica em `http://localhost:9000/h2-console` (JDBC URL `jdbc:h2:mem:testdb`, usuário `sa`, senha em branco).

> **Em produção**, defina a variável `JWT_SECRET` com um segredo forte. O valor padrão em `application.properties` serve apenas para desenvolvimento local.

```bash
export JWT_SECRET=um-segredo-longo-e-aleatorio
```

### Front-end

```bash
cd rastreador-frontend
npm install
npm start
```

Abre em `http://localhost:4200`.

## Decisões técnicas

- **DTOs de resposta** — as entidades JPA nunca são devolvidas diretamente, o que evita expor campos internos (como a senha do usuário) e desacopla o contrato da API do modelo do banco.
- **`GlobalExceptionHandler`** — centraliza o tratamento de erros com `@ControllerAdvice`, então os controllers não repetem `try/catch` e o cliente sempre recebe o mesmo formato de erro.
- **Revogação de token em memória** — como o JWT é *stateless*, ele valeria até expirar mesmo após o logout. Uma lista de tokens revogados (`ConcurrentHashMap`) resolve isso; em produção o lugar natural dessa lista seria um Redis.
- **H2 em memória** — qualquer pessoa consegue rodar o projeto sem instalar banco, o que era o objetivo para um projeto de estudo.
- **Segredo do JWT por variável de ambiente** — o mesmo build roda em qualquer ambiente sem recompilar.

## Melhorias mapeadas

- [ ] Testes unitários dos services e de integração dos controllers
- [ ] Migrar de H2 para PostgreSQL com Flyway
- [ ] Docker Compose para subir API, banco e front juntos
- [ ] Paginação nas listagens
- [ ] Relatórios de gastos por período e por categoria

## Licença

[MIT](LICENSE)
