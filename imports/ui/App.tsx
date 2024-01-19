import React, { ReactElement } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Grid, GridItem, Button, Flex, Spacer, Text } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Meteor } from 'meteor/meteor';

interface MenuItem {
  label: string;
  icon: ReactElement;
  path: string;
}

const MenuItems: MenuItem[] = [
  {
    label: "Main",
    icon: <HamburgerIcon />,
    path: "/"
  }
];

const App: React.FC = (props: any) => {
  const navigate = useNavigate();
  const isLoggedIn = !!Meteor.userId(); // Check if there is a logged-in user
  const username = Meteor.user()?.username; // Get the username if available

  const handleLogout = () => {
    Meteor.logout(() => {
      navigate('/login');
    });
  };

  return (
    <Grid
      templateAreas={`"header header"
                  "nav main"
                  "nav footer"`}
      gridTemplateRows={'50px 1fr 30px'}
      gridTemplateColumns={'150px 1fr'}
      h='200px'
      gap='1'
      fontWeight='bold'
      bg={"white"}
    >
      <GridItem pl='2' area={'header'}>
        <Flex align="center" justify="flex-end">
          <Flex></Flex>
          <Spacer />
          <Flex alignItems={'center'}>
            {isLoggedIn ? (
              <>
                <Text mr="2">Welcome, {username}</Text>
                <Button onClick={handleLogout} colorScheme="teal" variant="outline" ml="2">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button as={RouterLink} to="/login" colorScheme="teal" variant="outline" mr="1">
                  Login
                </Button>
                <Button as={RouterLink} to="/register" colorScheme="teal" ml="1">
                  Register
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </GridItem>
      <GridItem pl='2' area={'main'}>
        {props.children}
      </GridItem>
      <GridItem pl='2' area={'footer'}>
        Footer
      </GridItem>
    </Grid>
  );
};

export default App;