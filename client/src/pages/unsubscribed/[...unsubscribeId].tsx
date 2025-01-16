/* eslint-disable filenames-simple/naming-convention */
import { Router } from '@reach/router';
import { withPrefix } from 'gatsby';
import React from 'react';

import ShowUnsubscribed from '../../client-only-routes/show-unsubscribed';
import RedirectHome from '../../components/redirect-home';

function Unsubscribed(props: {
  params: {
    unsubscribeId: string;
  };
}): JSX.Element {
  const { unsubscribeId } = props.params;

  if (unsubscribeId) {
    return (
      <Router basepath='/unsubscribed'>
        <ShowUnsubscribed path={withPrefix('/:unsubscribeId')} />
        <RedirectHome default />
      </Router>
    );
  }

  return (
    <Router basepath='/unsubscribed'>
      <ShowUnsubscribed path={withPrefix('/')} />
      <RedirectHome default />
    </Router>
  );
}

Unsubscribed.displayName = 'Unsubscribed';

export default Unsubscribed;
