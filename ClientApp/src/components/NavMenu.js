import React, { useState } from 'react';
import { Collapse, Container, Nav, Navbar, NavItem, NavLink, NavbarToggler } from 'reactstrap';
import { NavLink as Link } from 'react-router-dom';
import './NavMenu.css';

export default () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3" light>
      <Container fluid>
        <NavbarToggler onClick={ () => setIsOpen(prev => !prev) } className="mr-2" />
        <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={ isOpen } navbar>
          <Nav className="navbar-nav flex-grow-1">
            <NavItem>
              <NavLink tag={Link} to="/course">Курсы ЦБ</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/rate">Курсы MOEX</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/pif">ПИФы</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/pifer">Пайщики</NavLink>
            </NavItem>
            <NavItem>
              <NavLink tag={Link} to="/counter"> </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

// export class NavMenu extends React.Component {
//   constructor (props) {
//     super(props);

//     this.toggle = this.toggle.bind(this);
//     this.state = {
//       isOpen: false
//     };
//   }
//   toggle = () => (
//     this.setState({ isOpen: !this.state.isOpen })
//   )
//   render = () => (
//     <Navbar className="navbar-expand-sm navbar-toggleable-sm border-bottom box-shadow mb-3" light >
//     <Container fluid>
//       <NavbarToggler onClick={this.toggle} className="mr-2" />
//       <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={this.state.isOpen} navbar>
//         <Nav className="navbar-nav flex-grow-1">
//           <NavItem>
//             <NavLink tag={Link} to="/course">Курсы ЦБ</NavLink>
//           </NavItem>
//           <NavItem>
//             <NavLink tag={Link} to="/rate">Курсы MOEX</NavLink>
//           </NavItem>
//           <NavItem>
//             <NavLink tag={Link} to="/pif">ПИФы</NavLink>
//           </NavItem>
//           <NavItem>
//             <NavLink tag={Link} to="/pifer">Пайщики</NavLink>
//           </NavItem>
//           <NavItem>
//             <NavLink tag={Link} to="/counter"> </NavLink>
//           </NavItem>
//         </Nav>
//       </Collapse>
//     </Container>
//   </Navbar>
//   )
// }
  