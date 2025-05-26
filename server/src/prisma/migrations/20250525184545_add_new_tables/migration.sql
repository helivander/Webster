/*
  Warnings:

  - Made the column `createdAt` on table `Canvas` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Canvas` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "TipoMidia" AS ENUM ('D', 'I', 'V');

-- AlterTable
ALTER TABLE "Canvas" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyId" UUID,
ADD COLUMN     "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMP,
ADD COLUMN     "foto" VARCHAR(500),
ADD COLUMN     "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "Marca" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "logo" VARCHAR(400),
    "descricao" VARCHAR(255),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP,

    CONSTRAINT "Marca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" UUID NOT NULL,
    "marcaId" UUID NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "preco" DECIMAL(10,2) NOT NULL,
    "descricao" VARCHAR(500),
    "tags" VARCHAR(255),
    "adicional" VARCHAR(255),
    "foto1" VARCHAR(400) NOT NULL,
    "foto2" VARCHAR(400),
    "foto3" VARCHAR(400),
    "tipo" VARCHAR(50) NOT NULL,
    "barcode" VARCHAR(50),
    "codsys" VARCHAR(50),
    "descricaocurta" VARCHAR(150),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Template" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "largura" INTEGER NOT NULL,
    "altura" INTEGER NOT NULL,
    "quantImagem" INTEGER NOT NULL DEFAULT 1,
    "imgFundo" VARCHAR(400),
    "fonte" VARCHAR(100),
    "textoCabecalho" VARCHAR(500),
    "textoRodape" VARCHAR(500),
    "midia" "TipoMidia" NOT NULL,
    "dpi" INTEGER,
    "authorId" UUID NOT NULL,
    "description" VARCHAR(255),
    "conteudoJson" JSONB,
    "carimboPreco" VARCHAR(100),
    "carimboTituloProd" VARCHAR(100),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP,

    CONSTRAINT "Template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Empresa" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "cnpj" VARCHAR(14) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "logo" VARCHAR(400),
    "description" VARCHAR(500),
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP,
    "usuarioId" UUID NOT NULL,

    CONSTRAINT "Empresa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encarte" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "modelId" UUID NOT NULL,
    "empresaId" UUID NOT NULL,
    "encarteJson" JSONB,
    "avisosEncarte" TEXT,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP,

    CONSTRAINT "Encarte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EncarteItem" (
    "id" UUID NOT NULL,
    "produtoId" UUID NOT NULL,
    "projetoId" UUID NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "valorPromo" DECIMAL(10,2),
    "valorAntigo" DECIMAL(10,2),
    "regraCompra" VARCHAR(255),
    "validadeProd" DATE,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP,

    CONSTRAINT "EncarteItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdutoUso" (
    "id" UUID NOT NULL,
    "ultimoValor" DECIMAL(10,2) NOT NULL,
    "descPerson" VARCHAR(255),
    "produtoId" UUID NOT NULL,
    "empresaId" UUID NOT NULL,
    "ultimoPreco" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP,

    CONSTRAINT "ProdutoUso_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresa_cnpj_key" ON "Empresa"("cnpj");

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_marcaId_fkey" FOREIGN KEY ("marcaId") REFERENCES "Marca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Template" ADD CONSTRAINT "Template_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Empresa" ADD CONSTRAINT "Empresa_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encarte" ADD CONSTRAINT "Encarte_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encarte" ADD CONSTRAINT "Encarte_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Encarte" ADD CONSTRAINT "Encarte_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EncarteItem" ADD CONSTRAINT "EncarteItem_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EncarteItem" ADD CONSTRAINT "EncarteItem_projetoId_fkey" FOREIGN KEY ("projetoId") REFERENCES "Encarte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoUso" ADD CONSTRAINT "ProdutoUso_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoUso" ADD CONSTRAINT "ProdutoUso_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
