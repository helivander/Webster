import Konva from 'konva';
import { Image } from 'konva/lib/shapes/Image';
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { Image as KonvaImage } from 'react-konva';
import { MAX_IMAGE_HEIGHT, MAX_IMAGE_WIDTH } from '~/consts/images';
import useDragHandlers from '~/hooks/use-drag-handlers';
import useImage from '~/hooks/use-image';
import useStageObject from '~/hooks/use-stage-object';
import { StageImageData, StageObject } from '~/types/stage-object';

type Props = {
  obj: StageObject;
  onSelect: (e: Konva.KonvaEventObject<MouseEvent>) => void;
};

const ImageObject = ({ obj, onSelect }: Props) => {
  const { id, data } = obj;
  const { src, filterNames, filterValues, ...props } = data as StageImageData;
  const [image, load] = useImage(src, id);
  const [size, setSize] = useState({ width: MAX_IMAGE_WIDTH, height: MAX_IMAGE_HEIGHT });
  const imgRef = useRef() as RefObject<Image>;

  const filters = useMemo(() => {
    const validFilters = filterNames
      .map((f) => {
        const filter = Konva.Filters[f];
        return typeof filter === 'function' ? filter : null;
      })
      .filter((f): f is typeof Konva.Filters[keyof typeof Konva.Filters] => f !== null);

    return validFilters.length > 0 ? validFilters : [Konva.Filters.Brighten];
  }, [filterNames]);

  const cacheOptions = { imageSmoothingEnabled: true, width: size.width, height: size.height };

  const { onDragStart, onDragEnd } = useDragHandlers();
  const { updateOne } = useStageObject();

  useEffect(() => {
    if (image && load === 'loaded') {
      const { width, height } = image;
      const ratio = Math.min(MAX_IMAGE_WIDTH / width, MAX_IMAGE_HEIGHT / height);

      const newSize = { width: width * ratio, height: height * ratio };
      setSize(newSize);
      updateOne({ id, data: newSize });
    }
  }, [image]);

  useEffect(() => {
    if (!imgRef.current) return;

    const img = imgRef.current;
    
    // Aplica os valores dos filtros
    if (filterValues.brighten !== undefined) {
      img.brightness(filterValues.brighten);
    }
    if (filterValues.contrast !== undefined) {
      img.contrast(filterValues.contrast);
    }
    if (filterValues.red !== undefined) {
      img.red(filterValues.red);
    }
    if (filterValues.green !== undefined) {
      img.green(filterValues.green);
    }
    if (filterValues.blue !== undefined) {
      img.blue(filterValues.blue);
    }

    // Aplica os filtros booleanos
    img.filters(filters);
    img.cache(cacheOptions);
  }, [image, data, filterValues, filterNames, filters]);

  return (
    <KonvaImage
      id={id}
      ref={imgRef}
      onClick={onSelect}
      image={image}
      onDragStart={onDragStart}
      onDragEnd={(e) => onDragEnd(e, obj)}
      {...props}
      {...size}
    />
  );
};

export default ImageObject;
