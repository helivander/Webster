# Documentação do Backend

## Estrutura do Projeto

O backend está estruturado seguindo os princípios do NestJS e Clean Architecture:

### Camadas Principais

1. **Controllers**: Endpoints da API
2. **Services**: Lógica de negócio
3. **Repositories**: Acesso ao banco de dados
4. **DTOs**: Objetos de transferência de dados
5. **Guards**: Proteção de rotas
6. **Decorators**: Utilitários de metadados

### Banco de Dados

- PostgreSQL como banco principal
- Prisma como ORM
- Migrations automáticas
- Soft delete implementado

## Módulos Implementados

1. [Marca](./marca.md)
   - CRUD completo
   - Soft delete
   - Autenticação JWT
   - Validações

2. User (Existente)
   - Autenticação
   - Gestão de usuários
   - Confirmação de email

3. Canvas (Existente)
   - Gestão de canvas
   - Relacionamento com usuários

## Próximos Módulos a Implementar

1. **Produto**
   - Relacionamento com Marca
   - Upload de imagens
   - Gestão de preços

2. **Empresa**
   - Validação de CNPJ
   - Gestão de endereços
   - Relacionamento com usuários

3. **Template**
   - Gestão de layouts
   - Configurações de impressão
   - Preview de documentos

4. **Encarte**
   - Composição de produtos
   - Gestão de promoções
   - Geração de PDF

## Padrões Adotados

1. **Nomenclatura**
   - Controllers: `nome.controller.ts`
   - Services: `nome.service.ts`
   - Repositories: `nome.repository.ts`
   - DTOs: `create-nome.dto.ts`, `update-nome.dto.ts`

2. **Estrutura de Arquivos**
```
src/
  ├── modules/
  │   ├── marca/
  │   │   ├── dto/
  │   │   ├── marca.controller.ts
  │   │   ├── marca.service.ts
  │   │   └── marca.module.ts
  │   └── ...
  ├── shared/
  │   ├── repositories/
  │   ├── guards/
  │   └── services/
  └── ...
```

3. **Validações**
   - class-validator para DTOs
   - Pipes de transformação
   - Guards de autenticação

4. **Respostas**
   - HTTP Status adequados
   - Mensagens de erro padronizadas
   - Formato JSON consistente

## Autenticação

- JWT como método principal
- Guards em todas as rotas protegidas
- Refresh token implementado
- Confirmação de email

## Comandos Úteis

```bash
# Criar nova migração Prisma
npx prisma migrate dev --name nome_da_migracao

# Gerar cliente Prisma
npx prisma generate

# Visualizar banco de dados
npx prisma studio

# Rodar em desenvolvimento
npm run start:dev

# Build para produção
npm run build
```

## Variáveis de Ambiente

```env
DATABASE_URL="postgresql://user:password@localhost:5432/database"
JWT_SECRET="seu_secret_aqui"
JWT_EXPIRATION="24h"
```

## Próximos Passos

1. Implementar demais módulos
2. Adicionar testes automatizados
3. Configurar CI/CD
4. Documentar com Swagger
5. Implementar cache com Redis 