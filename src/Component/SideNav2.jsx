import Nav from "./Nav";
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { Link } from 'react-router-dom';

import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";


function isActive(path) {
  return window.location.pathname.startsWith(path);
}

// function SideNav2() {
//   return (
//     <div >
//       <MenuList>
//         <MenuItem><Link style={{ textDecoration: "none", color: "white" }} to="/" active={isActive("/")}>
//           Wallet
//         </Link><br /></MenuItem>
//         <MenuItem><Link style={{ textDecoration: "none", color: "white" }} to="/EtherContract" active={isActive("/EtherContract")}>
//           Make Contract
//         </Link><br /></MenuItem>
//         <MenuItem><Link style={{ textDecoration: "none", color: "white" }} color="inherit" to="/EtherManage" active={isActive("/EtherManage")}>
//           Manage Contract
//         </Link></MenuItem>
//         <MenuItem><Link style={{ textDecoration: "none", color: "white" }} color="inherit" to="/UploadFile" active={isActive("/UploadFile")}>
//           Upload File to AWS S3
//         </Link></MenuItem>
//         <MenuItem><Link style={{ textDecoration: "none", color: "white" }} color="inherit" to="/Preview" active={isActive("/Preview")}>
//           NFT Preview
//         </Link></MenuItem>
//         <MenuItem><Link style={{ textDecoration: "none", color: "white" }} color="inherit" to="/ManageNFT" active={isActive("/ManageNFT")}>
//           Manage NFTs
//         </Link></MenuItem>
//         <MenuItem><Link style={{ textDecoration: "none", color: "white" }} color="inherit" to="/Scope" active={isActive("/Scope")}>
//           Snapshot
//         </Link></MenuItem>
//       </MenuList>
//     </div>

//   );
// }


export default function SideNav2() {

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <Tabs
      orientation="vertical"
      variant="scrollable"
      value={value}
      onChange={handleChange}
      aria-label="Vertical tabs"
      sx={{ borderRight: 1, borderColor: "divider" }}
    >
      <Tab label='Wallet' to='/' component={Link} />
      <Tab label='Make Contract' to='/EtherContract' component={Link} />
      <Tab label='Manage Contract' to='/EtherManage' component={Link} />
      <Tab label='Upload File to AWS S3' to='/UploadFile' component={Link} />
      <Tab label='NFT Preview' to='/Preview' component={Link} />
      <Tab label='Manage NFTs' to='/ManageNFT' component={Link} />
      <Tab label='Snapshot' to='/Scope' component={Link} />
    </Tabs>

  );
}


{/* <Tabs
  orientation="vertical"
  variant="scrollable"
  value={value}
  onChange={handleChange}
  aria-label="Vertical tabs example"
  sx={{ borderRight: 1, borderColor: "divider" }}
>
  <Tab label='Wallet' to='/' component={Link} />
  <Tab label="Item One" />
  <Tab label="Item Two" />
  <Tab label="Item Three" />
  <Tab label="Item Four" />
  <Tab label="Item Five" />
  <Tab label="Item Six" />
  <Tab label="Item Seven" />
</Tabs> */}