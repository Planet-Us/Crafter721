import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import { Link } from 'react-router-dom';

function isActive(path) {
  return window.location.pathname.startsWith(path);
}

function SideNav() {
  return (
    <div style={{backgroundColor: "#303136"}}>
    <MenuList>
      <MenuItem><Link style={{textDecoration: "none",color: "white"}} to="/" active={isActive("/")}>
        Wallet
      </Link><br/></MenuItem>
      <MenuItem><Link style={{textDecoration: "none",color: "white"}} to="/EtherContract" active={isActive("/EtherContract")}>
        Make Contract
      </Link><br/></MenuItem>
      <MenuItem><Link style={{textDecoration: "none",color: "white"}} color="inherit" to="/EtherManage" active={isActive("/EtherManage")}>
        Manage Contract
      </Link></MenuItem>
      <MenuItem><Link style={{textDecoration: "none",color: "white"}} color="inherit" to="/UploadFile" active={isActive("/UploadFile")}>
        Upload File to AWS S3
      </Link></MenuItem>
      <MenuItem><Link style={{textDecoration: "none",color: "white"}} color="inherit" to="/Preview" active={isActive("/Preview")}>
        NFT Preview
      </Link></MenuItem>
      <MenuItem><Link style={{textDecoration: "none",color: "white"}} color="inherit" to="/ManageNFT" active={isActive("/ManageNFT")}>
        Manage NFTs
      </Link></MenuItem>
      <MenuItem><Link style={{textDecoration: "none",color: "white"}} color="inherit" to="/Scope" active={isActive("/Scope")}>
        Snapshot
      </Link></MenuItem>
    </MenuList>
    </div>
          
  );
}

export default SideNav;
