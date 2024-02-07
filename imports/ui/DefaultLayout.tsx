import React from 'react'
import { Flex } from '@chakra-ui/react'

const DefaultLayout: React.FC = (props: any) => {
  return <Flex>{props.children}</Flex>
}

export default DefaultLayout
