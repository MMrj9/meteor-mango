import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { onPageLoad } from 'meteor/server-render';
import { StaticRouter } from "react-router-dom/server";
import { Helmet } from 'react-helmet';
import { renderToString } from 'react-dom/server';

import '/server/publish'
import Routes from '../imports/Routes';
import appReducer from '/imports/redux/reducers';



onPageLoad((sink: any) => {
  const store = createStore(appReducer, {}, applyMiddleware(thunk));

  const App = (props: { location: string }) => (
    <Provider store={store}>
      <StaticRouter location={props.location}>
        <Routes />
      </StaticRouter>
    </Provider>
  );

  const preloadedState = store.getState();

  sink.renderIntoElementById('app', renderToString(<App location={sink.request.url} />));

  const helmet = Helmet.renderStatic();
  sink.appendToHead(helmet.meta.toString());
  sink.appendToHead(helmet.title.toString());
  sink.appendToBody(`
    <script>
      window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
    </script>
  `);
});
