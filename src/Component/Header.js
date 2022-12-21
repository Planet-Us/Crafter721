import react, {Component, useEffect, useState} from 'react';
import {TextField, Button} from "@mui/material"
import axios from 'axios';
import { DataGrid, getDataGridUtilityClass } from '@mui/x-data-grid';
import CsvDownload from 'react-json-to-csv';
import Box from '@mui/material/Box';
import contractData from '../Contract';
import Web3 from 'web3';
import Caver from "caver-js";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { makeStyles } from '@mui/styles';
import Checkbox from '@mui/material/Checkbox';
import CircularProgress from '@mui/material/CircularProgress';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import klaytnFunc from '../klaytnFunc';
import ethFunc from '../ethFunc';
import '../bootstrap.min.css';
import { INSPECT_MAX_BYTES } from 'buffer';
import Logo from '../Logo.png'
const ipcRenderer = window.require('electron').ipcRenderer;
let rpcURL = contractData.mainnetRPCURL;
let caver = new Caver(rpcURL);
let web3;
let walletArray = new Array();
let newWallet = new String();


export default function Header(props) {
    
    const [address, setAddress] = useState("");
    const [network, setNetwork] = useState('mainnet');
    const [addressList, setAddressList] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        ipcRenderer.once('addWallet-reply', async (event, walletTmp) => { 
        walletArray = addressList;
        let decryptedWallet;
        console.log(walletTmp);
        if(props.password.length >0){
            if(props.chain == "ETH"){
                web3 = new Web3('https://mainnet.infura.io/v3/' + props.infuraCode);
                decryptedWallet = await web3.eth.accounts.decrypt(walletTmp.walletData, props.password);
            }else if(props.chain == "POLY"){
                web3 = new Web3("https://polygon-mumbai.infura.io/v3/" + props.infuraCode);
                decryptedWallet = await web3.eth.accounts.decrypt(walletTmp.walletData, props.password);
            }else if(props.chain == "KLAY"){
                rpcURL = contractData.baobabRPCURL;
                caver = new Caver(rpcURL);
                decryptedWallet = await caver.klay.accounts.decrypt(walletTmp.walletData, props.password);
            }
            walletArray.push({
                "id" : addressList.length,
                "address" : decryptedWallet.address
                });
            setAddress(walletArray[walletArray.length-1].address);
            setAddressList(walletArray);
            }
        });
    return () => {
        ipcRenderer.removeAllListeners('addWallet-reply');
    };
    });

    const networkChange = (e) => {
        props.changeNetwork(e.target.value);
        setNetwork(e.target.value);
    }
    const addressChange = (e) => {
        props.changeAddress(e.target.value);
        setAddress(e.target.value);
    }
    useEffect( () => {
        setLoading(false);
        if(typeof props.accounts != "undefined"){
            let tempList = new Array();
            let tempcnt = 0;
            for(let i = 0;i<props.accounts.length;i++){
                tempList.push({
                    "id" : tempcnt++,
                    "address" : props.accounts[i].address
                });
            }
            setAddress(props.accounts[0].address);
            setAddressList(tempList);
        }
    },[]);
    const useStyles = makeStyles({
        select: {
          color: "white",
          border: '1px solid white',
        },
      label: {
        color: "white",
        backgroundColor:"transparent",
        height: "20px"
      },
      icon: {
         fill: 'white',
      }
    });
    const classes = useStyles();

    return(
        <div style={{ backgroundColor: "#303136", height: "100px", paddingRight: "20px", marginTop: "-10px"}}>
                <div style={{display: "flex", width: "100%",paddingTop:"15px", margin: "10px", color: "white"}}>
                    
                {props.chain == "ETH" ?
                    <Box sx={{ maxWidth: "20%", width: "20%", color: "white"}}>
                        <FormControl fullWidth sx={{color: "white" }}>
                            {/* <InputLabel id="demo-simple-select-label">Chain</InputLabel> */}
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={network}
                            label="Network"
                            onChange={networkChange}
                            className={classes.select}
                            inputProps={{
                                classes: {
                                    icon: classes.icon,
                                },
                            }}
                            sx={{ backgroundColor: 'transparent', color: "white" }}
                            >
                                <MenuItem value={"mainnet"}>Mainnet</MenuItem>
                                <MenuItem value={"goerli"}>Goerli</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    :
                    props.chain == "POLY" ?
                    
                    <Box sx={{ maxWidth: "20%", width: "20%", color: "white"}}>
                        <FormControl fullWidth sx={{color: "white" }}>
                            {/* <InputLabel id="demo-simple-select-label">Chain</InputLabel> */}
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={network}
                            label="Network"
                            onChange={networkChange}
                            className={classes.select}
                            inputProps={{
                                classes: {
                                    icon: classes.icon,
                                },
                            }}
                            sx={{ backgroundColor: 'transparent', color: "white" }}
                            >
                                <MenuItem value={"mainnet"}>Mainnet</MenuItem>
                                <MenuItem value={"mumbai"}>Mumbai</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    :
                    <Box sx={{ maxWidth: "20%", width: "20%", color: "white"}}>
                        <FormControl fullWidth sx={{color: "white" }}>
                            {/* <InputLabel id="demo-simple-select-label">Chain</InputLabel> */}
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={network}
                            label="Network"
                            onChange={networkChange}
                            className={classes.select}
                            inputProps={{
                                classes: {
                                    icon: classes.icon,
                                },
                            }}
                            sx={{ backgroundColor: 'transparent', color: "white" }}
                            >
                                <MenuItem value={"mainnet"}>Mainnet</MenuItem>
                                <MenuItem value={"baobab"}>Baobab</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    }
                    <span style={{width: "50%", fontSize: "30px", color: "white"}}><img style={{width: "60px"}} src={Logo}/>CRAFTER721</span>
                    <Box sx={{  maxWidth: "30%", width: "30%" }}>
                        <FormControl fullWidth>
                            {/* <InputLabel id="demo-simple-select-label">Address</InputLabel> */}
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={address}
                            label="Address"
                            onChange={addressChange}
                            className={classes.select}
                            inputProps={{
                                classes: {
                                    icon: classes.icon,
                                },
                            }}
                            >
                                
                            {addressList.map(account =>(
                                <MenuItem key={account.id} value={account.address}>{account.address}</MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                    </Box>
                </div>
        </div>
    );
}