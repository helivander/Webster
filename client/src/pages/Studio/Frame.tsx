import React, { useEffect } from 'react';
import Konva from 'konva';
import { Box } from '@chakra-ui/react';
import { Stage, Layer, Transformer, Image as KonvaImage } from 'react-konva';
import { useAppSelector } from '~/hooks/use-app-selector';
import TextObject from './objects/TextObject/TextObject';
import { KonvaEventObject } from 'konva/lib/Node';
import ImageObject from './objects/ImageObject/ImageObject';
import ShapeObject from './objects/ShapeObject/ShapeObject';
import useStageObject from '~/hooks/use-stage-object';
import { StageObject, StageObjectType, StageTextObjectData } from '~/types/stage-object';
import useTransformer from '~/hooks/use-transformer';
import useObjectSelect from '~/hooks/use-object-select';
import { loadGoogleFontsDefaultVariants } from '~/utils/load-google-fonts-default-variants';
import useHotkeySetup from '~/hooks/use-hotkey-setup';
import useStageResize from '~/hooks/use-stage-resize';
import useImage from '~/hooks/use-image';
import { useDispatch } from 'react-redux';
import { setSize } from '~/store/slices/frame-slice';

type IProps = {
  stageRef: React.RefObject<Konva.Stage> | null;
};

const Frame = ({ stageRef }: IProps) => {
  const { stageObjects, resetAll, replaceAll } = useStageObject();
  const { transformer: imageTransformer, onTransformerEnd: onImageTransformerEnd } = useTransformer({ stageRef });
  const { transformer: textTransformer, onTransformerEnd: onTextTransformerEnd } = useTransformer({ stageRef });
  const { transformer: multiTransformer, onTransformerEnd: onMultiTransformerEnd } = useTransformer({ stageRef });
  const dispatch = useDispatch();

  const transformers = { imageTransformer, textTransformer, multiTransformer };

  const { onObjectSelect, resetObjectSelect } = useObjectSelect(transformers);

  useHotkeySetup(transformers);

  const { width, height, scale, stage } = useAppSelector((state) => state.frame);
  const { boxWidth, boxHeight, handleZoom, handleDragMoveStage } = useStageResize({ stageRef });

  // Carrega a imagem de fundo
  const [backgroundImage, backgroundStatus] = useImage(stage.background || '', 'background');

  // Atualiza o background quando ele for removido
  useEffect(() => {
    if (!stage.background) {
      // Força a atualização do background quando ele for removido
      const stageInstance = stageRef?.current;
      if (stageInstance) {
        const layer = stageInstance.findOne('Layer') as Konva.Layer;
        if (layer) {
          layer.batchDraw();
        }
      }
      // Restaura o tamanho padrão do canvas
      dispatch(setSize({ width: 1080, height: 1080 }));
    }
  }, [stage.background, stageRef]);

  // Ajusta o tamanho do canvas quando a imagem de fundo é carregada
  useEffect(() => {
    if (backgroundStatus === 'loaded' && backgroundImage) {
      // Obtém as dimensões da imagem
      const imgWidth = backgroundImage.width;
      const imgHeight = backgroundImage.height;

      // Calcula a proporção para manter o aspecto da imagem
      const maxWidth = 1920; // Largura máxima permitida
      const maxHeight = 1920; // Altura máxima permitida
      let newWidth = imgWidth;
      let newHeight = imgHeight;

      // Se a imagem for maior que o tamanho máximo, redimensiona mantendo a proporção
      if (imgWidth > maxWidth || imgHeight > maxHeight) {
        const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
        newWidth = Math.floor(imgWidth * ratio);
        newHeight = Math.floor(imgHeight * ratio);
      }

      // Atualiza o tamanho do canvas
      dispatch(setSize({ width: newWidth, height: newHeight }));
    }
  }, [backgroundStatus, backgroundImage]);

  useEffect(() => {
    const fontsToLoad = stageObjects
      .filter((obj) => obj.data.type === StageObjectType.TEXT && obj.data.webFont)
      .map((obj) => obj.data.fontFamily);

    if (fontsToLoad.length) loadGoogleFontsDefaultVariants(fontsToLoad);

    resetObjectSelect();
  }, []);

  useEffect(() => {
    const content = stage.content;
    resetObjectSelect();
    if (JSON.stringify(content) === JSON.stringify(stageObjects)) {
      return;
    }
    if (content === null || content === undefined || content === '""' || !content.length) {
      resetAll();
      return;
    }

    replaceAll(content as StageObject[]);
  }, [stage.id, stage.content]);

  const checkDeselect = (e: KonvaEventObject<MouseEvent> | KonvaEventObject<TouchEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      resetObjectSelect();
    }
  };

  const sortStageObject = () => {
    return stageObjects.sort((obj1, obj2) => {
      if (obj1.data.z_index === obj2.data.z_index) {
        if (obj1.data.z_index < 0) {
          return obj2.data.updatedAt - obj1.data.updatedAt;
        }
        return obj1.data.updatedAt - obj2.data.updatedAt;
      }
      return obj1.data.z_index - obj2.data.z_index;
    });
  };

  const renderStageObject = (obj: StageObject) => {
    const data = obj.data;
    switch (data.type) {
      case StageObjectType.IMAGE:
        return <ImageObject onSelect={onObjectSelect} obj={obj} />;
      case StageObjectType.TEXT:
        return <TextObject onSelect={onObjectSelect} shapeProps={obj as StageTextObjectData} />;
      case StageObjectType.SHAPE:
        return <ShapeObject onSelect={onObjectSelect} obj={obj} />;
      default:
        return null;
    }
  };

  return (
    <Box overflow="hidden" maxW={boxWidth} maxH={boxHeight}>
      <Stage
        width={width * scale}
        height={height * scale}
        style={{ backgroundColor: 'white' }}
        scaleX={scale}
        scaleY={scale}
        draggable={true}
        ref={stageRef}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
        onWheel={handleZoom}
        onDragMove={handleDragMoveStage}
      >
        <Layer>
          {/* Renderiza o background se estiver carregado */}
          {backgroundStatus === 'loaded' && backgroundImage && (
            <KonvaImage
              image={backgroundImage}
              width={width}
              height={height}
              listening={false}
            />
          )}
          {sortStageObject().map((obj) => (
            <React.Fragment key={obj.id}>{renderStageObject(obj)}</React.Fragment>
          ))}
          <Transformer 
            ref={imageTransformer} 
            onTransformEnd={onImageTransformerEnd} 
            ignoreStroke={true}
            keepRatio={true}
          />
          <Transformer
            ref={textTransformer}
            onTransformEnd={onTextTransformerEnd}
            rotationSnaps={[0, 90, 180, 270]}
            rotateEnabled={true}
            enabledAnchors={['middle-left', 'middle-right']}
            boundBoxFunc={(_oldBox, newBox) => {
              newBox.width = Math.max(30, newBox.width);
              return newBox;
            }}
          />
          <Transformer
            ref={multiTransformer}
            onTransformEnd={onMultiTransformerEnd}
            enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
            boundBoxFunc={(oldBox, newBox) => {
              const node = multiTransformer.current?.getNode();
              if (node && node.attrs.name?.startsWith('logo-')) {
                const ratio = oldBox.width / oldBox.height;
                newBox.width = Math.max(30, newBox.width);
                newBox.height = newBox.width / ratio;
              } else {
                newBox.width = Math.max(30, newBox.width);
              }
              return newBox;
            }}
            ignoreStroke={true}
          />
        </Layer>
      </Stage>
    </Box>
  );
};

export default Frame;
