import { Menu, MenuButton, MenuList, MenuItem, Button, Avatar, Text, MenuDivider } from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { useAppSelector } from '~/hooks/use-app-selector';
import { useLogoutMutation } from '~/store/api/auth-slice';
import { useNavigate } from 'react-router-dom';

const ProfileMenu = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        <Avatar size="sm" name={user?.name} src={user?.avatar} mr={2} />
        <Text display={{ base: 'none', md: 'inline' }}>{user?.name}</Text>
      </MenuButton>
      <MenuList>
        <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
        <MenuItem onClick={() => navigate('/settings')}>Settings</MenuItem>
        <MenuDivider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default ProfileMenu;
