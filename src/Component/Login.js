import react, {Component, useEffect, useState} from 'react';
import * as React from 'react';
import {TextField, Button} from "@mui/material"
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Card from '@mui/material/Card';
import ethers from 'ethers';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Logo from '../Logo.png';
const ipcRenderer = window.require('electron').ipcRenderer;
const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));


export default function Login(props) {
    
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");
    const [chain, setChain] = useState('ETH');
    const [network, setNetwork] = useState('Main');
    const [infuraCode, setInfuraCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [newPass, setNewPass] = useState('');
    const [newPass2, setNewPass2] = useState('');
    const [passwordComment, setPasswordComment] = useState("Password must contain at least 1 Capital letter, 1 Symbol.");
    const [newAccountPage, setNewAccountPage] = useState(false);
    const [makeAcountFlag, setMakeAccountFlag] = useState(true);
    const [checkKlayWallet, setCheckKlayWallet] = useState(false);
    const [checkEthWallet, setCheckEthWallet] = useState(false);
    let passwordArr = [newPass, newPass2];

    useEffect(() => {
        ipcRenderer.send('checkWallet', {
        });

    });
    useEffect(() =>{
      ipcRenderer.on('checkWallet-reply', async (event, data) => { 
          console.log(data);
          if(data.klayWallet == 1){
              setCheckKlayWallet(true);
          }
          if(data.ethWallet == 1){
              setCheckEthWallet(true);
          }
      });
      return () => {
        ipcRenderer.removeAllListeners('checkWallet-reply');
      };
    });

    const handleChange = (e) => {
        setPassword(e.target.value);
    }
    const backToPage = () =>{
        setNewAccountPage(false);

    }
    const newAccountChange = () => {
        setNewAccountPage(true);
    }
    const newPassChange = (e) => {
        setNewPass(e.target.value);
    }
    const newPass2Change = (e) => {
        setNewPass2(e.target.value);
    }
    const infuraChange = (e) =>{
        setInfuraCode(e.target.value);
    }
    useEffect( () => {
        if(newAccountPage){
            checkNewPass();
        }
    }, [passwordArr]);
    const checkNewPass = () => {
        var regExp = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
        if(newPass === newPass2 && regExp.test(newPass)){
            setPasswordComment("Allowed Password!");
            setPassword(newPass);
            setMakeAccountFlag(false);
        }else{
            setMakeAccountFlag(true);
        }
        if(!regExp.test(newPass)){
            setPasswordComment("The password doesn't contain symbol and Capital letter.");
        }else if(newPass !== newPass2){
            setPasswordComment("The passwords aren't matched.");
        }
    }
    const chainChange = (e) => {
        setChain(e.target.value);
        props.changeChain(e.target.value)
    }
    const doLoginFromApp = async () => {
        setLoading(true);
        props.doLogin(chain,password);
        
    }
    const makeAccount = async () => {
        setLoading(true);
        let ret = await props.createWallet(password, infuraCode);
        setLoading(false);
        setNewAccountPage(false);
    }
    const getApiKey = async () => {
        
        ipcRenderer.send('openFaucet', {
            url: "https://infura.io/"
        });
    }


    
    return(
        <div>
        <Card sx={{display: "grid",textAlign: "center", width: "35%", justifyContent: "center", backgroundColor: "white", marginLeft: "35%", marginTop: "10%", textAlign: "left", padding : "10px"}}>
           
            
        {newAccountPage == true ?
            <div style={{display: "gird", justifyContent: "center"}}>
                <img style={{width:"80px", marginLeft:"40%", justifyContent: "center", marginBottom: "10%"}} src={Logo}/>
                <Button onClick={backToPage}>back</Button>
                <span>Chain : {chain}</span>
                <span style={{color: "red"}}>NEVER LOSE YOUR PASSWORD</span>
                <span style={{color: "red"}}>We don't support password restore</span>
                <span>SET PASSWORD</span>
                <TextField style={{width : '100%'}} value={newPass} onChange={(e) => newPassChange(e)} type="password" id="outlined-basic" label="Password" variant="outlined" />
                <span>CONFIRM PASSWORD</span>
                <TextField style={{width : '100%'}} value={newPass2} onChange={(e) => newPass2Change(e)} type="password" id="outlined-basic" label="Password" variant="outlined" />
                {passwordComment}
                {chain == "ETH" ?
                    <>
                        <span>INFURA API KEY</span>
                        <HtmlTooltip
                        title={
                            <React.Fragment>
                                <Typography color="inherit">Infura Api Key</Typography>
                                {"Infura supports blockchain APIs and developer tools and with Api Key, you can connect to blockchain endpoint.\n click to infura website, you need to resgister and create api key."}
                            </React.Fragment>
                            }
                        >
                            <Button onClick={getApiKey}>What is INFURA API KEY?</Button>
                        </HtmlTooltip>
                        <TextField style={{width : '100%'}} value={infuraCode} onChange={(e) => infuraChange(e)} id="outlined-basic" label="API Key" variant="outlined" />
                    </>
                    :
                    <></>
                }
                <Button onClick={makeAccount} disabled={makeAcountFlag} variant="contained">Create Wallet</Button>
            </div>
            :
            <div style={{display: "grid", justifyContent: "center"}}>
                 <img style={{width:"80px", marginLeft:"33%", justifyContent: "center", marginBottom: "10%"}} src={Logo}/>
                <Box sx={{ maxWidth: 220}}>
                    <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">Chain</InputLabel>
                        <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={chain}
                        label="Chain"
                        onChange={chainChange}
                        >
                        <MenuItem value={"ETH"}>Ethereum</MenuItem>
                        <MenuItem value={"KLAY"}>Klaytn</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                <span>PASSWORD</span>
                <TextField style={{width : '100%', color: "white", border: "1px solid white"}} type="password" value={password} onChange={(e) => handleChange(e)} id="outlined-basic" label="Outlined" variant="outlined" />
                {(chain == "KLAY" && checkKlayWallet == 1) || (chain == "ETH" && checkEthWallet == 1) ?
                    <Button style={{marginTop: "10px", borderRadius: "24px"}} onClick={doLoginFromApp} variant="contained">Sign In</Button>
                : 
                    <Button style={{marginTop: "10px", borderRadius: "24px"}} onClick={newAccountChange} variant="contained">New Account</Button>
                }
            </div>
        }
        </Card>
        </div>
    );
}