import React from 'react';
import PropTypes from 'prop-types';

import { Link } from '../../helpers';
import NavLogo from './NavLogo';
import SearchBar from '../../search/searchBar/SearchBar';
import MenuButton from './MenuButton';
import NavLinks from './NavLinks';
import './universalNav.css';

export const UniversalNav = React.forwardRef(
  ({ displayMenu, toggleDisplayMenu }, ref) => {
    const { menuButtonRef, searchBarRef } = ref;
    return (
      <nav
        className={
          'universal-nav nav-padding' + (displayMenu ? ' expand-nav' : '')
        }
        id='universal-nav'
      >
        <div
          className={
            'universal-nav-left' + (displayMenu ? ' display-flex' : '')
          }
        >
          <SearchBar ref={searchBarRef} />
        </div>
        <div className='universal-nav-middle'>
          <Link id='universal-nav-logo' to='/'>
            <NavLogo />
          </Link>
        </div>
        <div className='universal-nav-right main-nav'>
          <NavLinks displayMenu={displayMenu} />
        </div>
        <MenuButton
          displayMenu={displayMenu}
          onClick={toggleDisplayMenu}
          ref={menuButtonRef}
        />
      </nav>
    );
  }
);

UniversalNav.displayName = 'UniversalNav';
export default UniversalNav;

UniversalNav.propTypes = {
  displayMenu: PropTypes.bool,
  menuButtonRef: PropTypes.object,
  toggleDisplayMenu: PropTypes.func
};
