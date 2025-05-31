import { apiSlice } from './api-slice';
import { Produto, CreateProdutoArg } from '~/types/produto';

interface UpdateProdutoArg extends Partial<CreateProdutoArg> {
  id: string;
}

interface UploadImagemResponse {
  url: string;
  path: string;
}

export const produtoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProduto: builder.mutation<Produto, CreateProdutoArg>({
      query: (produtoData) => ({
        url: '/products',
        method: 'POST',
        body: produtoData,
      }),
      invalidatesTags: [{ type: 'Produto', id: 'LIST' }],
    }),
    getProdutos: builder.query<Produto[], void>({
      query: () => '/products',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Produto' as const, id })),
              { type: 'Produto', id: 'LIST' },
            ]
          : [{ type: 'Produto', id: 'LIST' }],
    }),
    getProduto: builder.query<Produto, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Produto', id }],
    }),
    updateProduto: builder.mutation<Produto, UpdateProdutoArg>({
      query: ({ id, ...produtoData }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: produtoData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Produto', id },
        { type: 'Produto', id: 'LIST' },
      ],
    }),
    deleteProduto: builder.mutation<Produto, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Produto', id },
        { type: 'Produto', id: 'LIST' },
      ],
    }),
    uploadProdutoImagem: builder.mutation<UploadImagemResponse, FormData>({
      query: (formData) => ({
        url: '/upload/produto-imagem',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      // Não invalida tags de 'Produto' aqui, pois o upload é um passo separado.
      // A atualização da URL da imagem na entidade Produto invalidará a tag.
    }),
  }),
});

export const {
  useCreateProdutoMutation,
  useGetProdutosQuery,
  useGetProdutoQuery,
  useUpdateProdutoMutation,
  useDeleteProdutoMutation,
  useUploadProdutoImagemMutation,
} = produtoApiSlice; 