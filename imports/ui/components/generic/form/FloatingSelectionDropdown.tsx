import React from 'react'
import { Box } from '@chakra-ui/react'

interface FloatingSelectionDropdownProps {
  options: string[]
  onSelect: (username: string) => void
  filter: string
  dropdownRef: React.RefObject<HTMLDivElement>
}

const FloatingSelectionDropdown: React.FC<FloatingSelectionDropdownProps> = ({
  options,
  onSelect,
  filter,
  dropdownRef,
}) => {
  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(filter.toLowerCase()),
  )

  const handleSelect = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    option: string,
  ) => {
    event.preventDefault()
    onSelect(option)
  }

  return (
    <Box
      ref={dropdownRef}
      position="absolute"
      top="0"
      left="0"
      minWidth="150px"
      backgroundColor="#fff"
      border="1px solid #ccc"
      borderRadius="4px"
      boxShadow="0px 2px 4px rgba(0, 0, 0, 0.1)"
      zIndex={999}
    >
      {filteredOptions.map((option, index) => (
        <Box
          key={index}
          padding="8px 12px"
          cursor="pointer"
          backgroundColor="transparent"
          borderBottom={
            index === filteredOptions.length - 1 ? 'none' : '1px solid #ccc'
          }
          _hover={{ backgroundColor: '#f0f0f0' }}
          onClick={(event) => handleSelect(event, option)}
          onKeyDown={() => console.log(option)}
        >
          {option}
        </Box>
      ))}
    </Box>
  )
}

export default FloatingSelectionDropdown
