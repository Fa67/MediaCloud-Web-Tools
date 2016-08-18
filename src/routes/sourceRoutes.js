import React from 'react';
import Route from 'react-router/lib/Route';
import SourceDetailsContainer from '../components/source/mediaSource/SourceDetailsContainer';
import CollectionDetailsContainer from '../components/source/collection/CollectionDetailsContainer';
import SourceListContainer from '../components/source/SourceListContainer';
import SourceSearchContainer from '../components/source/SourceSearchContainer';
import SourceCollectionListContainer from '../components/source/SourceCollectionListContainer';
import Introduction from '../components/source/Introduction';

import requireAuth from './routes.js';

const sourceRoutes = (
  <Route path="/" >
    <Route path="/home" component={Introduction} onEnter={requireAuth} />
    <Route path="/source" >
      <Route path="search" component={SourceSearchContainer} />
      <Route path="list" component={SourceListContainer} onEnter={requireAuth} />
      <Route path=":sourceId/details" component={SourceDetailsContainer} onEnter={requireAuth} />
    </Route>
    <Route path="/collection" >
      <Route path="list" component={SourceCollectionListContainer} onEnter={requireAuth} />
      <Route path=":collectionId/details" component={CollectionDetailsContainer} onEnter={requireAuth} />
    </Route>
  </Route>
);

export default sourceRoutes;
