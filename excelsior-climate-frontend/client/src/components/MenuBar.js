import React from 'react';
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink
  } from "shards-react";

import logo from '../climate-change-icon.svg';

//logo menu bar with secondary theme
class MenuBar extends React.Component {
    render() {
        return(
          
            <Navbar type="dark" theme="secondary" expand="md" >
        <NavbarBrand href="/"><img src={logo} width="35" height="35" alt="" /></NavbarBrand>
          <Nav navbar>
          <NavItem>
              <NavLink active href="/">
                Home
              </NavLink>
            </NavItem>
          </Nav>
      </Navbar>
        )
    }
}

export default MenuBar
