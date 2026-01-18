# Webster - Changelog da Branch Manus

## Resumo das Correções

Esta branch contém uma série de correções e implementações para completar a estrutura do projeto Webster conforme definido no arquivo `.ai-instructions`.

---

## 1. Módulo Upload (NOVO)

O módulo de upload estava sendo importado no `app.module.ts` mas não existia. Foi criado completamente:

### Arquivos Criados:
- `server/src/modules/upload/upload.service.ts` - Serviço com validação de tipos de arquivo, geração de nomes únicos e organização em pastas
- `server/src/modules/upload/upload.controller.ts` - Controller com endpoints para upload de logos, produtos, templates e arquivos gerais
- `server/src/modules/upload/upload.module.ts` - Módulo com configuração do Multer
- `server/src/modules/upload/index.ts` - Exports do módulo

### Funcionalidades:
- Upload de arquivo único e múltiplo
- Validação de tipos MIME (imagens)
- Limite de tamanho de arquivo (5MB)
- Organização em pastas (logos, products, templates, general)
- Deleção de arquivos

---

## 2. Módulo Product (COMPLETADO)

O módulo de produto tinha apenas o controller. Foi completado com:

### Arquivos Criados:
- `server/src/modules/product/product.service.ts` - Serviço com CRUD completo
- `server/src/modules/product/product.module.ts` - Módulo com providers e exports
- `server/src/modules/product/dto/request/create-product.request.dto.ts` - DTO de criação com validações
- `server/src/modules/product/dto/request/update-product.request.dto.ts` - DTO de atualização
- `server/src/modules/product/dto/response/product.response.dto.ts` - DTO de resposta
- `server/src/shared/repositories/product.repository.ts` - Repositório com queries otimizadas

### Arquivos Modificados:
- `server/src/modules/product/product.controller.ts` - Adicionadas rotas de busca por marca e pesquisa

### Funcionalidades:
- CRUD completo de produtos
- Busca por código de barras
- Busca por marca
- Pesquisa textual em nome, descrição, barcode e tags
- Validação de barcode único

---

## 3. Módulo Template (NOVO)

Módulo completamente novo para gerenciamento de templates de encartes:

### Arquivos Criados:
- `server/src/modules/template/template.service.ts` - Serviço com CRUD e validação de permissões
- `server/src/modules/template/template.controller.ts` - Controller com endpoints protegidos
- `server/src/modules/template/template.module.ts` - Módulo
- `server/src/modules/template/dto/request/create-template.request.dto.ts` - DTO com enum TipoMidia
- `server/src/modules/template/dto/request/update-template.request.dto.ts` - DTO de atualização
- `server/src/modules/template/dto/response/template.response.dto.ts` - DTO de resposta
- `server/src/shared/repositories/template.repository.ts` - Repositório

### Funcionalidades:
- CRUD completo de templates
- Busca por autor
- Validação de permissões (apenas autor pode editar/deletar)
- Suporte a conteúdo JSON para layout

---

## 4. Módulo Encarte (NOVO)

Módulo para gerenciamento de encartes (projetos de encarte):

### Arquivos Criados:
- `server/src/modules/encarte/encarte.service.ts` - Serviço com CRUD e gerenciamento de itens
- `server/src/modules/encarte/encarte.controller.ts` - Controller
- `server/src/modules/encarte/encarte.module.ts` - Módulo
- `server/src/modules/encarte/dto/request/create-encarte.request.dto.ts` - DTO com suporte a itens aninhados
- `server/src/modules/encarte/dto/request/update-encarte.request.dto.ts` - DTO de atualização
- `server/src/modules/encarte/dto/response/encarte.response.dto.ts` - DTO com itens e relacionamentos
- `server/src/shared/repositories/encarte.repository.ts` - Repositório com suporte a EncarteItem

### Funcionalidades:
- CRUD completo de encartes
- Gerenciamento de itens do encarte (EncarteItem)
- Busca por usuário e empresa
- Validação de permissões
- Soft delete de itens junto com encarte

---

## 5. Módulo ProdutoUso (NOVO)

Módulo para rastrear o uso de produtos por empresa:

### Arquivos Criados:
- `server/src/modules/produto-uso/produto-uso.service.ts` - Serviço com upsert
- `server/src/modules/produto-uso/produto-uso.controller.ts` - Controller
- `server/src/modules/produto-uso/produto-uso.module.ts` - Módulo
- `server/src/modules/produto-uso/dto/request/create-produto-uso.request.dto.ts` - DTO
- `server/src/modules/produto-uso/dto/request/update-produto-uso.request.dto.ts` - DTO
- `server/src/modules/produto-uso/dto/response/produto-uso.response.dto.ts` - DTO
- `server/src/shared/repositories/produto-uso.repository.ts` - Repositório com upsert

### Funcionalidades:
- CRUD completo
- Upsert (cria ou atualiza baseado em produto + empresa)
- Busca por empresa
- Lookup por produto e empresa

---

## 6. Correções de Arquitetura

### PrismaService Duplicado
Removido `PrismaService` dos providers dos módulos que já usam o `PrismaModule` global:
- `server/src/modules/canvas/canvas.module.ts`
- `server/src/modules/user/user.module.ts`
- `server/src/modules/marca/marca.module.ts`

### Exports de Repositórios
Atualizado `server/src/shared/repositories/index.ts` para exportar todos os repositórios:
- UserRepository
- CanvasRepository
- MarcaRepository
- ProductRepository
- TemplateRepository
- EncarteRepository
- ProdutoUsoRepository

### Entidade Empresa
Corrigido `server/src/modules/empresa/entities/empresa.entity.ts` para exportar o tipo do Prisma.

### Index de DTOs
Criados arquivos index.ts para DTOs de:
- Empresa
- Marca

### GitIgnore
Atualizado `.gitignore` para não ignorar o módulo `server/src/modules/upload`.

---

## 7. Schema Prisma

### Melhorias:
- Adicionado `@updatedAt` para atualização automática do campo `updatedAt`
- Adicionados índices para otimização de queries:
  - User: email, username
  - Canvas: authorId
  - Marca: nome
  - Produto: marcaId, nome, barcode, tipo
  - Template: authorId, nome
  - Empresa: usuarioId, name, cnpj
  - Encarte: userId, modelId, empresaId
  - EncarteItem: produtoId, projetoId
  - ProdutoUso: produtoId, empresaId

---

## 8. App Module

Atualizado `server/src/app.module.ts` para registrar todos os novos módulos:
- ProductModule
- TemplateModule
- EncarteModule
- ProdutoUsoModule
- UploadModule (já estava importado mas não existia)

---

## Endpoints da API

### Upload (`/upload`)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/upload` | Upload de arquivo genérico |
| POST | `/upload/multiple` | Upload de múltiplos arquivos |
| POST | `/upload/logo` | Upload de logo |
| POST | `/upload/product` | Upload de imagem de produto |
| POST | `/upload/template` | Upload de imagem de template |
| DELETE | `/upload` | Deletar arquivo |

### Products (`/products`)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/products` | Criar produto |
| GET | `/products` | Listar produtos |
| GET | `/products/search?q=` | Buscar produtos |
| GET | `/products/marca/:marcaId` | Produtos por marca |
| GET | `/products/:id` | Obter produto |
| PATCH | `/products/:id` | Atualizar produto |
| DELETE | `/products/:id` | Deletar produto |

### Templates (`/templates`)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/templates` | Criar template |
| GET | `/templates` | Listar templates |
| GET | `/templates/my` | Meus templates |
| GET | `/templates/:id` | Obter template |
| PATCH | `/templates/:id` | Atualizar template |
| DELETE | `/templates/:id` | Deletar template |

### Encartes (`/encartes`)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/encartes` | Criar encarte |
| GET | `/encartes` | Listar encartes |
| GET | `/encartes/my` | Meus encartes |
| GET | `/encartes/empresa/:empresaId` | Encartes por empresa |
| GET | `/encartes/:id` | Obter encarte |
| PATCH | `/encartes/:id` | Atualizar encarte |
| DELETE | `/encartes/:id` | Deletar encarte |

### ProdutoUso (`/produto-uso`)
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/produto-uso` | Criar/atualizar uso |
| GET | `/produto-uso` | Listar todos |
| GET | `/produto-uso/empresa/:empresaId` | Por empresa |
| GET | `/produto-uso/lookup?produtoId=&empresaId=` | Buscar específico |
| GET | `/produto-uso/:id` | Obter por ID |
| PATCH | `/produto-uso/:id` | Atualizar |
| DELETE | `/produto-uso/:id` | Deletar |

---

## Próximos Passos Recomendados

1. **Executar migrações do Prisma** após as alterações no schema:
   ```bash
   cd server
   npx prisma migrate dev --schema ./src/prisma/schema.prisma --name add_indexes
   ```

2. **Instalar dependências** se necessário:
   ```bash
   cd server
   yarn install
   ```

3. **Gerar o Prisma Client**:
   ```bash
   npx prisma generate --schema ./src/prisma/schema.prisma
   ```

4. **Testar a aplicação**:
   ```bash
   yarn dev
   ```

---

## Estatísticas

- **Arquivos criados**: 50+
- **Arquivos modificados**: 8
- **Linhas adicionadas**: ~2500
- **Módulos novos**: 4 (Upload, Template, Encarte, ProdutoUso)
- **Módulos completados**: 1 (Product)
