import react, { Component, useEffect, useState } from 'react';
import { TextField, Button } from "@mui/material"
import '../bootstrap.min.css';
import { useBalance } from '../hooks';

import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';

const ipcRenderer = window.require('electron').ipcRenderer;


export default function Wallet(props) {

    const [address, setAddress] = useState("");
    const [amount, setAmount] = useState("");
    const [toAddress, setToAddress] = useState("");
    // const [balance, setBalance] = useState(0);
    const [balance, refreshBalance] = useBalance(address);
    const [network, setNetwork] = useState('mainnet');
    const [loading, setLoading] = useState(false);
    const [transferFlag, setTransferFlag] = useState(false);
    const [exportFlag, setExportFlag] = useState(false);
    const [importFlag, setImportFlag] = useState(false);
    const [privateKey, setPrivateKey] = useState("");
    const [password, setPassword] = useState("");

    const transferOn = () => {
        setTransferFlag(true);
    }
    const toAddressChange = (e) => {
        setToAddress(e.target.value);
    }
    const amountChange = (e) => {
        setAmount(e.target.value);
    }
    const passwordChange = (e) => {
        setPassword(e.target.value);
    }
    const privateKeyChange = (e) => {
        setPrivateKey(e.target.value);
    }
    const sendTransfer = async () => {
        let ret = await props.transferEth(address, toAddress, amount);
        // setBalance(props.balance); 
        // 이렇게 한들 , 밸런스가 갱신되는가??
    }
    const makeNewWallet = async () => {
        if (window.confirm("Do you want to make new Wallet address?")) {
            let ret = await props.makeNewWallet();
        }

    }
    const openFaucet = () => {
        if (props.chain == "ETH") {
            ipcRenderer.send('openFaucet', {
                url: "https://goerlifaucet.com/"
            });
        } else if(props.chain == "POLY"){
            ipcRenderer.send('openFaucet', {
                url: "https://mumbaifaucet.com/"
            });

        } else if (props.chain == "KLAY") {
            ipcRenderer.send('openFaucet', {
                url: "https://baobab.wallet.klaytn.foundation/faucet"
            });
        } else if (props.chain == "BSC") {
            ipcRenderer.send('openFaucet', {
                url: "https://testnet.bnbchain.org/faucet-smart"
            });
        }

    }
    useEffect(() => {
        setLoading(false);
        // setBalance(props.balance);
        if (props.accounts.length > 0) {
            setAddress(props.accounts);
        }

    }, []);
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(address);
        } catch (error) {
        }
    }
    const handleExport = async () => {
        setExportFlag(!exportFlag);
    }
    const handleImport = async () => {
        setImportFlag(!importFlag);
    }
    const getPrivateKey = async () => {
        try {
            await navigator.clipboard.writeText(props.privateKey);
            alert("The private key has been copied!");
            setExportFlag(!exportFlag);
            setPassword("");
        } catch (error) {
        }
    }
    const importWallet = async () => {
        props.importWallet(privateKey);
    }

    return (
        <div style={{ display: "flex", width: "100%", marginLeft: "40%", margin: "10px", backgroundColor: "#363940" }}>
            <div style={{ width: "100%", marginLeft: "40%", margin: "10px", backgroundColor: "#363940" }}>
                <span style={{ width: "100%", fontSize: "20px" }}>{address}</span><br />
                <Button onClick={handleCopy}>Copy</Button>
                <Button onClick={handleExport}>Export</Button>
                <Button onClick={handleImport}>Import</Button><br />
                {props.chain == "ETH" ?
                    <span style={{ width: "100%", fontSize: "30px" }}>{balance} ETH</span>
                    :
                    props.chain == "POLY" ?
                    <span style={{ width: "100%", fontSize: "30px" }}>{balance} MATIC</span>                    
                    :
                    props.chain == "BSC" ?
                    <span style={{ width: "100%", fontSize: "30px" }}>{balance} BNB</span>                    
                    :
                    <span style={{ width: "100%", fontSize: "30px" }}>{balance} KLAY</span>
                }
                <IconButton color='primary' aria-label="Refresh" onClick={refreshBalance}>
                    <RefreshIcon />
                </IconButton>
                {exportFlag == true ?
                    <div>
                        <span style={{ width: "100%", fontSize: "20px", marginRight: "10px" }}>Password</span>
                        <TextField style={{ width: '35%' }} value={password} onChange={(e) => passwordChange(e)} type="password" id="outlined-basic" label="Password" variant="outlined" /><br />
                        <Button onClick={getPrivateKey} variant="contained">Get PrivateKey</Button>
                    </div>
                    :
                    <></>
                }
                {importFlag == true ?
                    <div>
                        <span style={{ width: "100%", fontSize: "20px", marginRight: "10px" }}>Private Key</span>
                        <TextField style={{ width: '35%' }} value={privateKey} onChange={(e) => privateKeyChange(e)} id="outlined-basic" label="PrivateKey" variant="outlined" /><br />
                        <Button onClick={importWallet} variant="contained">Import Wallet</Button>
                    </div>
                    :
                    <></>
                }

                {transferFlag == true ?
                    <div>
                        <TextField style={{ width: '35%' }} value={toAddress} onChange={(e) => toAddressChange(e)} id="outlined-basic" label="Address" variant="outlined" /><br />
                        <TextField style={{ width: '35%' }} value={amount} onChange={(e) => amountChange(e)} id="outlined-basic" label="Amount" variant="outlined" /><br />
                        <Button onClick={sendTransfer} variant="contained">Send</Button>
                    </div>
                    :
                    <div>
                        <Button onClick={transferOn} variant="contained">Transfer</Button>
                        <Button onClick={makeNewWallet} style={{ marginLeft: "10px" }} variant="contained">New Wallet</Button>
                        {props.network != "mainnet" ?
                            <Button onClick={openFaucet} style={{ marginLeft: "10px" }} variant="contained">Faucet Test Coin</Button>
                            :
                            <div />
                        }
                    </div>
                }
            </div>
        </div>
    );
}