import { apiSlice } from './api-slice';
import { Empresa, CreateEmpresaArg } from '~/types/empresa';

// Interface para o payload da atualização (pode ser similar a CreateEmpresaArg, mas com ID)
interface UpdateEmpresaArg extends CreateEmpresaArg {
  id: string;
}

interface UploadLogoResponse {
  message: string;
  url: string;
  filename: string;
  originalFilename: string;
  mimetype: string;
  size: number;
}

export const empresaApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createEmpresa: builder.mutation<Empresa, CreateEmpresaArg>({
      query: (empresaData) => ({
        url: '/empresas',
        method: 'POST',
        body: empresaData,
      }),
      invalidatesTags: (result, error, arg) => [{ type: 'Empresa', id: 'MINHA' }], // Para refazer a query getMinhaEmpresa
    }),
    getMinhaEmpresa: builder.query<Empresa | null, void>({
      query: () => '/empresas/minha',
      providesTags: (result) => 
        result ? [{ type: 'Empresa', id: 'MINHA' }, { type: 'Empresa', id: result.id }] : [{ type: 'Empresa', id: 'MINHA' }],
    }),
    updateEmpresa: builder.mutation<Empresa, UpdateEmpresaArg>({
      query: ({ id, ...empresaData }) => ({
        url: `/empresas/${id}`,
        method: 'PATCH', // Ou PUT, dependendo da sua preferência de semântica REST
        body: empresaData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Empresa', id }, { type: 'Empresa', id: 'MINHA' }],
    }),
    uploadLogoEmpresa: builder.mutation<UploadLogoResponse, FormData>({
      query: (formData) => ({
        url: '/upload/logo',
        method: 'POST',
        body: formData,
        // RTK Query ajusta o Content-Type para multipart/form-data automaticamente para FormData
      }),
      // Não invalida tags de 'Empresa' aqui, pois o upload é um passo separado.
      // A atualização da URL do logo na entidade Empresa invalidará a tag.
    }),
  }),
});

export const {
  useCreateEmpresaMutation,
  useGetMinhaEmpresaQuery,
  useUpdateEmpresaMutation, // Exportar o novo hook
  useUploadLogoEmpresaMutation, // Exportar o novo hook
} = empresaApiSlice; 