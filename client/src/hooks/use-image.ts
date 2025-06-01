import { useLayoutEffect, useRef, useState } from 'react';
import useStageObject from './use-stage-object';

type StatusType = 'loading' | 'loaded' | 'failed';

// Função para formatar a URL da imagem
const getImageUrl = (path: string) => {
  if (!path) return '';
  
  // Se já for uma URL completa
  if (path.startsWith('http')) return path;
  
  // Se começar com /public, adiciona apenas a base URL
  if (path.startsWith('/public/')) {
    return `${import.meta.env.VITE_API_URL}${path}`;
  }
  
  // Se começar com /uploads, adiciona /public antes
  if (path.startsWith('/uploads/')) {
    return `${import.meta.env.VITE_API_URL}/public${path}`;
  }
  
  // Se for apenas o nome do arquivo, constrói o caminho completo
  return `${import.meta.env.VITE_API_URL}/public/uploads/backgrounds/${path}`;
};

const useImage = (url: string, id: string) => {
  const [, setStateToken] = useState(0);
  const [status, setStatus] = useState<StatusType>('loading');
  const imageRef = useRef() as any;
  const { removeOne } = useStageObject();

  useLayoutEffect(() => {
    if (!url) return;
    const img = document.createElement('img');

    img.addEventListener('load', () => {
      setStatus('loaded');
      imageRef.current = img;
      setStateToken(Math.random());
    });

    img.addEventListener('error', (e) => {
      console.error('Erro ao carregar imagem:', e);
      setStatus('failed');
      imageRef.current = undefined;
      setStateToken(Math.random());
      if (id !== 'background') { // Não remove o background em caso de erro
        removeOne(id);
      }
    });

    img.crossOrigin = 'anonymous';
    img.src = getImageUrl(url);
  }, [url]);

  return [imageRef.current, status];
};

export default useImage;
