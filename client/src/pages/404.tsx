import React from 'react';
import { Router } from '@reach/router';
import { withPrefix } from 'gatsby';

import FourOhFour from '../components/FourOhFour';
/* eslint-disable max-len */
import ShowProfileOrFourOhFour from '../client-only-routes/show-profile-or-four-oh-four';
/* eslint-enable max-len */

function FourOhFourPage(): JSX.Element {
  return (
    <Router>
      {/* Error from installing @types/react-helmet and @types/react-redux */}
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <ShowProfileOrFourOhFour path={withPrefix('/:maybeUser')} />
      {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
      {/* @ts-ignore */}
      <FourOhFour default={true} />
    </Router>
  );
}

FourOhFourPage.displayName = 'FourOhFourPage';

export default FourOhFourPage;
