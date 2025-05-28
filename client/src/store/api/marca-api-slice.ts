import { apiSlice } from './api-slice';
import { Marca, CreateMarcaArg, UpdateMarcaArg } from '~/types/marca';

// Interface para resposta do upload
interface UploadLogoResponse {
  message: string;
  url: string;
  filename: string;
  originalFilename: string;
  mimetype: string;
  size: number;
}

export const marcaApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMarca: builder.mutation<Marca, CreateMarcaArg>({
      query: (marcaData) => ({
        url: '/marcas',
        method: 'POST',
        body: marcaData,
      }),
      invalidatesTags: [{ type: 'Marca', id: 'LIST' }],
    }),
    getMarcas: builder.query<Marca[], void>({
      query: () => '/marcas',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Marca' as const, id })),
              { type: 'Marca', id: 'LIST' },
            ]
          : [{ type: 'Marca', id: 'LIST' }],
    }),
    getMarca: builder.query<Marca, string>({
      query: (id) => `/marcas/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Marca', id }],
    }),
    updateMarca: builder.mutation<Marca, UpdateMarcaArg>({
      query: ({ id, ...marcaData }) => ({
        url: `/marcas/${id}`,
        method: 'PUT',
        body: marcaData,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Marca', id },
        { type: 'Marca', id: 'LIST' },
      ],
    }),
    deleteMarca: builder.mutation<Marca, string>({
      query: (id) => ({
        url: `/marcas/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Marca', id },
        { type: 'Marca', id: 'LIST' },
      ],
    }),
    uploadMarcaLogo: builder.mutation<UploadLogoResponse, FormData>({
      query: (formData) => ({
        url: '/upload/marca-logo',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      // Não invalida tags de 'Marca' aqui, pois o upload é um passo separado.
      // A atualização da URL do logo na entidade Marca invalidará a tag.
    }),
  }),
});

export const {
  useCreateMarcaMutation,
  useGetMarcasQuery,
  useGetMarcaQuery,
  useUpdateMarcaMutation,
  useDeleteMarcaMutation,
  useUploadMarcaLogoMutation,
} = marcaApiSlice; 