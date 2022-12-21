import react, {Component, useEffect, useState} from 'react';
import * as React from 'react';
import {TextField, Button} from "@mui/material"
import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { makeStyles } from '@mui/styles';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import '../App.css';
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


export default function EtherContract(props) {

    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [baseURL, setBaseURL] = useState("");
    const [maxSupply, setMaxSupply] = useState(0);
    const [price, setPrice] = useState(0);
    const [whiteList, setWhiteList] = useState(false);
    const [purchaseLimit, setPurchaseLimit] = useState(0);
    const [purchaseLimitOn, setPurchaseLimitOn] = useState(false);

    const nameChange = (e) => {
        setName(e.target.value);
    }
    const symbolChange = (e) => {
        setSymbol(e.target.value);
    }
    const baseURLChange = (e) => {
        setBaseURL(e.target.value);
    }
    const maxSupplyChange = (e) => {
        setMaxSupply(e.target.value);
    }
    const priceChange = (e) => {
        setPrice(e.target.value);
    }
    const purchaseLimitOnChange = (e) => {
        if(e.target.value == "true"){
            setPurchaseLimitOn(true);
        }else{
            setPurchaseLimitOn(false);
            setPurchaseLimit(0);

        }
    }
    const purchaseLimitChange = (e) => {
        setPurchaseLimit(e.target.value);
    }
    const deployContract = async () => {
        props.deploySmartContract(name, symbol, baseURL, maxSupply, price, whiteList, purchaseLimit);
    }
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
        <div style={{marginLeft: "20%", marginRight: "20%", fontSize: "20px", marginTop: "20px", marginBottom: "20px"}}>
        <Card sx={{ backgroundColor: "transparent", color: "white", border: "1px solid white"}}>
            <div className="row" style={{display: "flex", width: "100%", padding: "20px"}}>
                <span style={{width : '50%'}}>Collection Name</span>
                <HtmlTooltip
                title={
                    <React.Fragment>
                        {"Collection name that represent your NFTs"}
                    </React.Fragment>
                    }
                >
                <TextField style={{width : '50%', border: "1px solid white", borderRadius: "4px"}} value={name} onChange={(e) => nameChange(e)} size="small" id="outlined-basic" label="name" variant="outlined" />
                </HtmlTooltip>
                <span style={{width : '50%'}}>Symbol</span>
                <HtmlTooltip
                title={
                    <React.Fragment>
                        {"The token symbol"}
                    </React.Fragment>
                    }
                >
                <TextField style={{width : '50%', border: "1px solid white", borderRadius: "4px"}} value={symbol} onChange={(e) => symbolChange(e)} size="small" id="outlined-basic" label="symbol" variant="outlined" />
                </HtmlTooltip>
                <span style={{width : '50%'}}>Max Supply</span>
                <HtmlTooltip
                title={
                    <React.Fragment>
                        {"If you set more than 0, the NFTs cannot be minted more than Max Supply.\n Set 0 if you don't want to set Max Supply."}
                    </React.Fragment>
                    }
                >
                <TextField style={{width : '50%', border: "1px solid white", borderRadius: "4px"}} value={maxSupply} onChange={(e) => maxSupplyChange(e)} size="small" id="outlined-basic" variant="outlined" />
                </HtmlTooltip>
                <span style={{width : '50%'}}>Price</span>
                <HtmlTooltip
                title={
                    <React.Fragment>
                        {"Price per 1 NFT mint"}
                    </React.Fragment>
                    }
                >
                <TextField style={{width : '50%', border: "1px solid white", borderRadius: "4px"}} value={price} onChange={(e) => priceChange(e)} size="small" id="outlined-basic" variant="outlined" />
                </HtmlTooltip>
                <span style={{width : '50%'}}>Base URL</span>
                <HtmlTooltip
                title={
                    <React.Fragment>
                        {"Your bucket + folder URL.\nex) https://bucketname.s3.ap-northeast-2.amazonaws.com/json/"}
                    </React.Fragment>
                    }
                >
                <TextField style={{width : '100%', border: "1px solid white", borderRadius: "4px"}} value={baseURL} onChange={(e) => baseURLChange(e)} size="small" id="outlined-basic" label="baseURL" variant="outlined" />
                </HtmlTooltip>
                <HtmlTooltip
                title={
                    <React.Fragment>
                        {"Purchase limit per wallet. If you set 0, it doesn't count the purchasing NFT."}
                    </React.Fragment>
                    }
                >
                <FormControl style={{width : '50%'}}>
                     <FormLabel style={{width : '100%', color: "white"}} id="demo-radio-buttons-group-label">Purchase Limit(per wallet)</FormLabel>
                     <RadioGroup
                         row
                         style={{width : '100%'}}
                         aria-labelledby="demo-radio-buttons-group-label"
                         defaultValue="No"
                         name="radio-buttons-group"
                         value={purchaseLimitOn}
                         onChange={(e) => purchaseLimitOnChange(e)}
                         inputProps={{
                             classes: {
                                 icon: classes.icon,
                             },
                         }}
                         sx={{ backgroundColor: 'transparent', color: "white" }}
                     >
                         <FormControlLabel value={false} control={<Radio />} label="No" />
                         <FormControlLabel value={true} control={<Radio />} label="Yes" />
                     </RadioGroup>
                 <TextField style={{width : '100%', border: "1px solid white", borderRadius: "4px"}} value={purchaseLimit} disabled={!purchaseLimitOn} onChange={(e) => purchaseLimitChange(e)} id="outlined-basic" variant="outlined" />
                 </FormControl>
                </HtmlTooltip>
                <Button onClick={deployContract} variant="contained">Smart Contract Deploy!</Button>
            </div>
            </Card>
        </div>
    );


}