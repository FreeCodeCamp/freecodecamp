/* eslint-disable filenames-simple/naming-convention */
import { Router } from '@reach/router';
import { withPrefix } from 'gatsby';
import React from 'react';

import ShowUser from '../../client-only-routes/show-user';
import RedirectHome from '../../components/redirect-home';

function User(): JSX.Element {
  return (
    <Router>
      {/* @ts-expect-error Adding path property breaks username typing */}
      <ShowUser path={withPrefix('/user/:username/report-user')} />

      <RedirectHome default />
    </Router>
  );
}

User.displayName = 'User';

export default User;
