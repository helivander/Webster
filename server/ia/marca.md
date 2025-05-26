# Documentação do Módulo de Marca

## Estrutura Implementada

### 1. Repository (marca.repository.ts)
- Responsável pela comunicação direta com o banco de dados
- Implementa operações CRUD básicas
- Utiliza soft delete para exclusão de registros

### 2. Service (marca.service.ts)
- Implementa a lógica de negócio
- Validações e regras específicas
- Tratamento de erros (ex: NotFoundException)

### 3. Controller (marca.controller.ts)
- Expõe os endpoints da API
- Utiliza autenticação via JWT
- Validação de dados via DTOs

### 4. DTO (create-marca.dto.ts)
- Validação dos dados de entrada
- Define campos obrigatórios e opcionais
- Validações específicas para cada campo

## Endpoints Disponíveis

### 1. Criar Marca
```http
POST /marcas
Authorization: Bearer {token}
Content-Type: application/json

{
    "nome": "string",     // Obrigatório, max 100 caracteres
    "logo": "string",     // Opcional, URL válida, max 400 caracteres
    "descricao": "string" // Opcional, max 255 caracteres
}
```

**Códigos de Retorno:**
- 201: Marca criada com sucesso
- 400: Dados inválidos
- 401: Não autorizado
- 422: Erro de validação

**Exemplo de Resposta (201):**
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nome": "Marca Exemplo",
    "logo": "https://exemplo.com/logo.png",
    "descricao": "Descrição da marca exemplo",
    "createdAt": "2024-05-25T18:45:45.000Z",
    "updatedAt": "2024-05-25T18:45:45.000Z",
    "deletedAt": null
}
```

### 2. Listar Todas as Marcas
```http
GET /marcas
Authorization: Bearer {token}
```

**Códigos de Retorno:**
- 200: Sucesso
- 401: Não autorizado

**Exemplo de Resposta (200):**
```json
[
    {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "nome": "Marca 1",
        "logo": "https://exemplo.com/logo1.png",
        "descricao": "Descrição da marca 1",
        "createdAt": "2024-05-25T18:45:45.000Z",
        "updatedAt": "2024-05-25T18:45:45.000Z",
        "deletedAt": null
    },
    {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "nome": "Marca 2",
        "logo": "https://exemplo.com/logo2.png",
        "descricao": "Descrição da marca 2",
        "createdAt": "2024-05-25T18:45:45.000Z",
        "updatedAt": "2024-05-25T18:45:45.000Z",
        "deletedAt": null
    }
]
```

### 3. Buscar Marca por ID
```http
GET /marcas/{id}
Authorization: Bearer {token}
```

**Códigos de Retorno:**
- 200: Sucesso
- 401: Não autorizado
- 404: Marca não encontrada

**Exemplo de Resposta (200):**
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nome": "Marca Exemplo",
    "logo": "https://exemplo.com/logo.png",
    "descricao": "Descrição da marca exemplo",
    "createdAt": "2024-05-25T18:45:45.000Z",
    "updatedAt": "2024-05-25T18:45:45.000Z",
    "deletedAt": null
}
```

### 4. Atualizar Marca
```http
PUT /marcas/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "nome": "string",     // Opcional, max 100 caracteres
    "logo": "string",     // Opcional, URL válida, max 400 caracteres
    "descricao": "string" // Opcional, max 255 caracteres
}
```

**Códigos de Retorno:**
- 200: Marca atualizada com sucesso
- 400: Dados inválidos
- 401: Não autorizado
- 404: Marca não encontrada
- 422: Erro de validação

**Exemplo de Resposta (200):**
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nome": "Marca Atualizada",
    "logo": "https://exemplo.com/novo-logo.png",
    "descricao": "Nova descrição da marca",
    "createdAt": "2024-05-25T18:45:45.000Z",
    "updatedAt": "2024-05-25T19:00:00.000Z",
    "deletedAt": null
}
```

### 5. Deletar Marca (Soft Delete)
```http
DELETE /marcas/{id}
Authorization: Bearer {token}
```

**Códigos de Retorno:**
- 200: Marca deletada com sucesso
- 401: Não autorizado
- 404: Marca não encontrada

**Exemplo de Resposta (200):**
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nome": "Marca Deletada",
    "logo": "https://exemplo.com/logo.png",
    "descricao": "Descrição da marca",
    "createdAt": "2024-05-25T18:45:45.000Z",
    "updatedAt": "2024-05-25T19:15:00.000Z",
    "deletedAt": "2024-05-25T19:15:00.000Z"
}
```

## Campos do Modelo

| Campo     | Tipo    | Descrição                    | Obrigatório | Validação                  |
|-----------|---------|------------------------------|-------------|----------------------------|
| id        | UUID    | Identificador único          | Sim        | Gerado automaticamente     |
| nome      | String  | Nome da marca               | Sim        | Max 100 caracteres         |
| logo      | String  | URL/path do logo            | Não        | URL válida, max 400 chars  |
| descricao | String  | Descrição da marca          | Não        | Max 255 caracteres         |
| createdAt | Date    | Data de criação             | Auto       | Gerado automaticamente     |
| updatedAt | Date    | Data de última atualização  | Auto       | Atualizado automaticamente |
| deletedAt | Date    | Data de exclusão (soft)     | Auto       | Null até ser deletado      |

## Relacionamentos

- Uma Marca pode ter vários Produtos (one-to-many)
- Produtos referenciando a Marca através do campo `marcaId`

## Validações

1. **Nome**
   - Campo obrigatório
   - Tipo string
   - Máximo 100 caracteres
   - Mensagem de erro personalizada

2. **Logo**
   - Campo opcional
   - Tipo string
   - URL válida
   - Máximo 400 caracteres
   - Mensagem de erro personalizada

3. **Descrição**
   - Campo opcional
   - Tipo string
   - Máximo 255 caracteres
   - Mensagem de erro personalizada

## Observações

1. Todas as rotas requerem autenticação via JWT
2. Implementado soft delete (registros não são efetivamente excluídos)
3. Timestamps automáticos para criação e atualização
4. Validações implementadas via class-validator com mensagens em português
5. Respostas padronizadas seguindo o padrão REST
6. Tratamento de erros centralizado
7. Documentação atualizada com exemplos e códigos de retorno 