import React, { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, GridItem } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';


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
]

const App: React.FC = (props: any) => {
  let navigate = useNavigate();

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
        Header
      </GridItem>
      <GridItem pl='2' area={'nav'} bg="blue.50">
        Nav
      </GridItem>
      <GridItem pl='2' area={'main'}>
        {props.children}
      </GridItem>
      <GridItem pl='2' area={'footer'}>
        Footer
      </GridItem>
    </Grid>
  )
}

export default App;