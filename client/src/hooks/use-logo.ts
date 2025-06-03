import { useAppSelector } from './use-app-selector';
import { stageObjectSelector } from '~/store/slices/stage-object-slice';

export const useLogo = () => {
  const stageObjects = useAppSelector(stageObjectSelector.selectAll);

  const getNextLogoNumber = () => {
    const logos = stageObjects.filter(obj => obj.data.systype?.startsWith('logo'));
    if (!logos.length) return 1;

    const numbers = logos.map(obj => {
      const match = obj.data.systype.match(/logo(\d+)/);
      return match ? parseInt(match[1]) : 0;
    });

    return Math.max(...numbers) + 1;
  };

  const getLogoCount = () => {
    return stageObjects.filter(obj => obj.data.systype?.startsWith('logo')).length;
  };

  return {
    getNextLogoNumber,
    getLogoCount,
  };
};

export default useLogo; 