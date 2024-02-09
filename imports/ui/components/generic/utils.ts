export const success = (toast: any, message: string, title = 'Success') => {
  toast({
    title: title,
    description: message,
    status: 'success',
    duration: 5000,
    isClosable: true,
  })
}

export const error = (toast: any, message: string, title = 'Error') => {
  toast({
    title: title,
    description: message,
    status: 'error',
    duration: 5000,
    isClosable: true,
  })
}

export const info = (toast: any, message: string, title = 'Info') => {
  toast({
    title: title,
    description: message,
    status: 'info',
    duration: 5000,
    isClosable: true,
  })
}
