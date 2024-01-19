import React from 'react'
import { render } from 'react-dom'
import App from '/imports/ui/App'
import { createStore, applyMiddleware } from 'redux'
import { BrowserRouter } from 'react-router-dom'
import { onPageLoad } from 'meteor/server-render'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import Routes from '../imports/Routes'
import appReducer from '/imports/redux/reducers'
import { extendTheme, ColorModeScript, ChakraProvider } from '@chakra-ui/react'

//@ts-ignore
const preloadedState = window.__PRELOADED_STATE__
//@ts-ignore
delete window.__PRELOADED_STATE__

const store = createStore(appReducer, preloadedState, applyMiddleware(thunk))

const theme = extendTheme({
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
  styles: {
    global: () => ({
      body: {
        bg: '#fff',
        color: '#000',
      },
      input: {
        bg: '#e5e5e5',
      },
    }),
  },
  colors: {
    black: '#000',
    white: '#fff',
    gray: {
      50: '#e5e5e5',
    },
    orange: {
      50: '#fca311',
    },
    blue: {
      50: '#14213d',
    },
  },
})

const app = (
  <Provider store={store}>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        {/*@ts-ignore */}
        <App>
          <Routes />
        </App>
      </BrowserRouter>
    </ChakraProvider>
  </Provider>
)

onPageLoad(() => {
  render(app, document.getElementById('app'))
})
