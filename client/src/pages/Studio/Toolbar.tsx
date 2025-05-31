import { Flex, Icon, Tab, TabList, TabPanel, TabPanels, Tabs, useColorModeValue } from '@chakra-ui/react';
import Konva from 'konva';
import { TOOLBAR_TABS } from '~/consts/components';
import Export from './tools/Export';
import ImageUpload from './tools/ImageUpload/ImageUpload';
import Images from './tools/Images/Images';
import Resize from './tools/Resize';
import Texts from './tools/Text/Texts';
import Models from './tools/Models/Models';
import Marcas from './tools/Marcas/Marcas';
import Produtos from './tools/Produtos/Produtos';

type Props = {
  stageRef: React.RefObject<Konva.Stage>;
};

const Toolbar = ({ stageRef }: Props) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgSidebar = useColorModeValue('gray.100', 'gray.900');
  const tabBg = useColorModeValue('gray.100', 'gray.900');
  const tabSelectedBg = useColorModeValue('white', 'gray.800');
  const tabSelectedColor = useColorModeValue('pink.500', 'pink.300');
  const tabHoverColor = useColorModeValue('pink.500', 'pink.200');
  const tabPanelBg = useColorModeValue('white', 'gray.800');

  return (
    <Flex h="100%" borderRight="2px" borderColor={borderColor}>
      <Tabs
        isLazy
        lazyBehavior="keepMounted"
        orientation="vertical"
        variant="line"
        colorScheme="pink"
        h="100%"
        id="toolbar"
        bgColor={bgSidebar}
      >
        <TabList>
          {TOOLBAR_TABS.map((t, i) => (
            <Tab
              px="4"
              py="4"
              key={i}
              bgColor={tabBg}
              display="flex"
              flexDir="column"
              alignItems="center"
              justifyContent="center"
              fontSize="12px"
              fontWeight="600"
              _selected={{ bgColor: tabSelectedBg, color: tabSelectedColor }}
              _hover={{ color: tabHoverColor }}
            >
              <Icon as={t.icon} boxSize={6} />
              {t.title}
            </Tab>
          ))}
        </TabList>

        <TabPanels minW="350px" maxW="350px" bgColor={tabPanelBg} overflowY="auto">
          <TabPanel>
            <Models />
          </TabPanel>
          <TabPanel>
            <Resize />
          </TabPanel>
          <TabPanel>
            <Export stageRef={stageRef} />
          </TabPanel>
          <TabPanel p="0" h="100%" overflow="hidden">
            <Images />
          </TabPanel>
          <TabPanel>
            <ImageUpload />
          </TabPanel>
          <TabPanel p="0" h="100%" overflow="hidden">
            <Texts />
          </TabPanel>
          <TabPanel p="0" h="100%" overflow="hidden">
            <Marcas />
          </TabPanel>
          <TabPanel p="0" h="100%" overflow="hidden">
            <Produtos />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default Toolbar;
