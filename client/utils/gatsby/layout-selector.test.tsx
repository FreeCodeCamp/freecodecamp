/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import React from 'react';
import { Provider } from 'react-redux';
import ShallowRenderer from 'react-test-renderer/shallow';

import FourOhFourPage from '../../src/pages/404';
import Certification from '../../src/pages/certification/[...name]';
import Learn from '../../src/pages/learn';
import { createStore } from '../../src/redux/create-store';
import layoutSelector from './layout-selector';

jest.mock('../../src/analytics');

const store = createStore();

// TODO: rather than testing which props passed from layoutSelector to the
// component it renders, test that the rendered component has the expected
// features (i.e. has a footer or not, etc.). That should be possible in
// react-testing-library.

interface NameAndProps {
  props: Record<string, unknown>;
  name: string;
}
function getComponentNameAndProps(
  elementType: React.JSXElementConstructor<never>,
  pathname: string,
  pageContext?: { challengeMeta?: { block?: string; superBlock?: string } }
): NameAndProps {
  const utils = ShallowRenderer.createRenderer();
  const LayoutReactComponent = layoutSelector({
    element: { type: elementType, props: {}, key: '' },
    props: {
      location: {
        pathname
      },
      pageContext
    }
  });
  utils.render(<Provider store={store}>{LayoutReactComponent}</Provider>);
  const view = utils.getRenderOutput();
  return {
    props: view.props.children.props as Record<string, unknown>,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    name: view.props.children.type.WrappedComponent.displayName
    // TODO: Revisit this when react-test-renderer is replaced with
    // react-testing-library
  };
}

const challengePageContext = {
  challengeMeta: {
    block: 'Basic HTML and HTML5',
    superBlock: 'responsive-web-design'
  }
};

test('Challenges should have DefaultLayout and no footer', () => {
  const challengePath =
    '/learn/responsive-web-design/basic-html-and-html5/say-hello-to-html-elements';
  const componentObj = getComponentNameAndProps(
    Learn,
    challengePath,
    challengePageContext
  );
  expect(componentObj.name).toEqual('DefaultLayout');
  expect(componentObj.props.showFooter).toEqual(false);
});

test('SuperBlock path should have DefaultLayout and footer', () => {
  const superBlockPath = '/learn/responsive-web-design/';
  const componentObj = getComponentNameAndProps(Learn, superBlockPath);
  expect(componentObj.name).toEqual('DefaultLayout');
  expect(componentObj.props.showFooter).toEqual(true);
});

test('i18n challenge path should have DefaultLayout and no footer', () => {
  const challengePath =
    'espanol/learn/responsive-web-design/basic-html-and-html5/say-hello-to-html-elements/';
  const componentObj = getComponentNameAndProps(
    Learn,
    challengePath,
    challengePageContext
  );
  expect(componentObj.name).toEqual('DefaultLayout');
  expect(componentObj.props.showFooter).toEqual(false);
});

test('i18n superBlock path should have DefaultLayout and footer', () => {
  const superBlockPath = '/learn/responsive-web-design/';
  const componentObj = getComponentNameAndProps(Learn, superBlockPath);
  expect(componentObj.name).toEqual('DefaultLayout');
  expect(componentObj.props.showFooter).toEqual(true);
});

test('404 page should have DefaultLayout and footer', () => {
  const challengePath =
    '/espanol/learn/responsive-web-design/basic-html-and-html5/say-hello-to-html-elements/';
  const componentObj = getComponentNameAndProps(FourOhFourPage, challengePath);
  expect(componentObj.name).toEqual('DefaultLayout');
  expect(componentObj.props.showFooter).toEqual(true);
});

test('Certification path should have CertificationLayout', () => {
  const challengePath =
    '/certification/mot01/javascript-algorithms-and-data-structures/';
  const componentObj = getComponentNameAndProps(Certification, challengePath);
  expect(componentObj.name).toEqual('CertificationLayout');
});
