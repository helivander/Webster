import { HStack, Icon, IconButton, Spacer, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { HiOutlineRefresh, HiOutlineReply, HiOutlineTrash, HiOutlineDownload } from 'react-icons/hi';
import { EDITING_TOOLBAR_HEIGHT } from '~/consts/components';
import { KeyType } from '~/consts/keys';
import { useAppSelector } from '~/hooks/use-app-selector';
import useHistory from '~/hooks/use-history';
import useStageResize from '~/hooks/use-stage-resize';
import { stageObjectSelector } from '~/store/slices/stage-object-slice';
import { StageObjectType } from '~/types/stage-object';
import ImageEditing from './ImageEditing/ImageEditing';
import ShapesEditing from './ShapesEditing/ShapesEditing';
import TextEditing from './TextEditing/TextEditing';
import CanvasContentSave from '../canvas-actions/CanvasContentSave';
import useStageObject from '~/hooks/use-stage-object';
import Konva from 'konva';
import React from 'react';

type Props = {
  stageRef: React.RefObject<Konva.Stage>;
};

const EditingToolbar = ({ stageRef }: Props) => {
  const stageObjects = useAppSelector(stageObjectSelector.selectAll);
  const { selected } = useAppSelector((state) => state.selected);
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const { width, height } = useAppSelector((state) => state.frame);
  const { removeOne } = useStageObject();

  const { savePast, goBack, goForward } = useHistory();

  const { setStageSize } = useStageResize({});

  const bgToolbar = useColorModeValue('white', 'gray.250');

  useHotkeys(KeyType.UNDO, (e) => {
    e.preventDefault();
    goBack();
  });

  useHotkeys(KeyType.REDO, (e) => {
    e.preventDefault();
    goForward();
  });

  useHotkeys('delete', (e) => {
    e.preventDefault();
    if (selected.length === 1) {
      handleDelete();
    }
  });

  useEffect(() => {
    savePast(stageObjects);
  }, [stageObjects]);

  const getSelectedObject = () => {
    if (selected.length === 1 && stageObjects) {
      return stageObjects.find((obj) => obj.id === selected[0]);
    }
    return null;
  };

  const selectedObject = getSelectedObject();

  const handleDelete = () => {
    if (selectedObject) {
      removeOne(selectedObject.id);
    }
  };

  const handleExport = () => {
    if (stageRef?.current) {
      const dataURL = stageRef.current.toDataURL({
        x: stageRef.current.attrs.x,
        y: stageRef.current.attrs.y,
        width: width * stageRef.current.scaleX(),
        height: height * stageRef.current.scaleY(),
        pixelRatio: 1 / stageRef.current.attrs.scaleX,
      });
      const link = document.createElement('a');
      link.download = 'webster';
      link.href = dataURL;
      link.click();
    }
  };

  const renderEditing = () => {
    switch (selectedObject?.data.type) {
      case StageObjectType.IMAGE:
        return <ImageEditing selectedObject={selectedObject} />;
      case StageObjectType.SHAPE:
        return <ShapesEditing selectedObject={selectedObject} />;
      case StageObjectType.TEXT:
        return <TextEditing selectedObject={selectedObject} />;
      default:
        return null;
    }
  };

  return (
    <HStack h={`${EDITING_TOOLBAR_HEIGHT}px`} id="editing_toolbar" spacing={2} sx={{ px: 4 }} bgColor={bgToolbar}>
      <Tooltip hasArrow label="Undo Ctrl + Z" placement="bottom" openDelay={500}>
        <IconButton aria-label="Undo" icon={<Icon as={HiOutlineReply} boxSize={5} />} onClick={() => goBack()} />
      </Tooltip>
      <Tooltip hasArrow label="Redo Ctrl + Y" placement="bottom" openDelay={500}>
        <IconButton
          aria-label="Redo"
          icon={<Icon as={HiOutlineReply} transform="scaleX(-1)" boxSize={5} />}
          onClick={() => goForward()}
        />
      </Tooltip>
      <Tooltip hasArrow label="Reset zoom" placement="bottom" openDelay={500}>
        <IconButton
          aria-label="Reset zoom"
          icon={<Icon as={HiOutlineRefresh} boxSize={5} />}
          onClick={() => setStageSize()}
        />
      </Tooltip>
      {renderEditing()}
      {selectedObject && (
        <Tooltip hasArrow label="Excluir elemento (Delete)" placement="bottom" openDelay={500}>
          <IconButton
            aria-label="Excluir elemento"
            icon={<Icon as={HiOutlineTrash} boxSize={5} />}
            onClick={handleDelete}
            colorScheme="red"
            variant="ghost"
          />
        </Tooltip>
      )}
      {isLoggedIn && (
        <>
          <Spacer />
          <CanvasContentSave />
          <Tooltip hasArrow label="Exportar imagem" placement="bottom" openDelay={500}>
            <IconButton
              aria-label="Exportar imagem"
              icon={<Icon as={HiOutlineDownload} boxSize={5} />}
              onClick={handleExport}
              colorScheme="pink"
            />
          </Tooltip>
        </>
      )}
    </HStack>
  );
};

export default EditingToolbar;
