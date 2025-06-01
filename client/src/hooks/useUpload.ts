import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '~/store/store';

interface UploadResponse {
  message: string;
  url: string;
  filename: string;
  originalFilename: string;
  mimetype: string;
  size: number;
}

export const useUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const token = useSelector((state: RootState) => state.auth.token);

  const uploadMarcaLogo = async (file: File): Promise<UploadResponse> => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('🚀 Iniciando upload direto...');
      console.log('📁 Arquivo:', file.name, file.type, file.size);
      console.log('🔑 Token:', token ? `Bearer ${token}` : 'Ausente');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload/marca-logo`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      
      console.log('📡 Resposta status:', response.status);
      console.log('📡 Resposta headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na resposta:', errorText);
        throw new Error(errorText || `Erro ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Upload bem-sucedido:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Erro no upload:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadProdutoImagem = async (file: File): Promise<UploadResponse> => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('🚀 Iniciando upload de produto...');
      console.log('📁 Arquivo:', file.name, file.type, file.size);
      console.log('🔑 Token:', token ? `Bearer ${token}` : 'Ausente');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload/produto-imagem`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      
      console.log('📡 Resposta status:', response.status);
      console.log('📡 Resposta headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na resposta:', errorText);
        throw new Error(errorText || `Erro ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Upload de produto bem-sucedido:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Erro no upload de produto:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadBackground = async (file: File): Promise<UploadResponse> => {
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      console.log('🚀 Iniciando upload de background...');
      console.log('📁 Arquivo:', file.name, file.type, file.size);
      console.log('🔑 Token:', token ? `Bearer ${token}` : 'Ausente');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload/background`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      
      console.log('📡 Resposta status:', response.status);
      console.log('📡 Resposta headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na resposta:', errorText);
        throw new Error(errorText || `Erro ${response.status}`);
      }
      
      const result = await response.json();
      console.log('✅ Upload de background bem-sucedido:', result);
      
      return result;
    } catch (error) {
      console.error('❌ Erro no upload de background:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBackground = async (filename: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      console.log('🗑️ Iniciando remoção de background...');
      console.log('📁 Arquivo:', filename);
      console.log('🔑 Token:', token ? `Bearer ${token}` : 'Ausente');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload/background/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });
      
      console.log('📡 Resposta status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro na resposta:', errorText);
        throw new Error(errorText || `Erro ${response.status}`);
      }
      
      console.log('✅ Background removido com sucesso');
    } catch (error) {
      console.error('❌ Erro ao remover background:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadMarcaLogo,
    uploadProdutoImagem,
    uploadBackground,
    deleteBackground,
    isLoading,
  };
}; 