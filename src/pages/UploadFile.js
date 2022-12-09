import react, {Component, useEffect, useState} from 'react';
import {TextField, Button} from "@mui/material"
import axios from 'axios';
import { DataGrid, getDataGridUtilityClass } from '@mui/x-data-grid';
import CsvDownload from 'react-json-to-csv';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Loading from '../Component/Loading.js';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';

import ListItemText from '@mui/material/ListItemText';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
const ipcRenderer = window.require('electron').ipcRenderer;
// import '../bootstrap.min.css';


const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));


export default function UploadFile(props) {
    
    const [apiKey, setApiKey] = useState("");
    const [secretKey, setSecretKey] = useState("");
    const [bucketName, setBucketName] = useState("");
    const [region, setRegion] = useState("");
    const [jsonList, setJsonList] = useState([]);
    const [jsonNameList, setJsonNameList] = useState([]);
    const [imageList, setImageList] = useState([]);
    const [imageNameList, setImageNameList] = useState([]);
    const [imageExtension, setImageExtension] = useState("");
    const [loading, setLoading] = useState(false);
    const [jsonNum, setJsonNum] = useState(0);
    const [imageNum, setImageNum] = useState(0);
    
    useEffect(() => {
        ipcRenderer.on('uploadFile-reply', async(event, data) => {
            if(data.type == "json"){
                setJsonNum(data.fileNum);
            }else if(data.type == "image"){
                setImageNum(data.fileNum);
            }
        })
        return () => {
        ipcRenderer.removeAllListeners('uploadFile-reply');
        };
    });

    useEffect(() => {
        ipcRenderer.once('getFile-reply', async (event, data) => { 
        let tempArr = new Array();
        for(let i = 0;i< data.fileList.length;i++){
            let temp = data.fileList[i].split("\\");
            tempArr.push(temp[temp.length-1]);
        }
        if(data.fileType == "json"){
            setJsonNameList(tempArr);
            setJsonList(data.fileList);
        }else if(data.fileType == "image"){
            setImageNameList(tempArr);
            setImageList(data.fileList);
            setImageExtension(data.imageExtension);
        }
        })
        return () => {
        ipcRenderer.removeAllListeners('getFile-reply');
        };
    });
  
    useEffect(() => {
        ipcRenderer.once('saveApiKey-reply', async (event, data) => { 
            alert("api saved!")
        })
        return () => {
        ipcRenderer.removeAllListeners('saveApiKey-reply');
        };
    });
    
    useEffect(() => {
        ipcRenderer.once('loadApiKey-reply', async (event, data) => { 
            setApiKey(data.attribute.apiKey);
            setSecretKey(data.attribute.secretKey);
            setBucketName(data.attribute.bucketName);
            setRegion(data.attribute.region);
        })
        return () => {
        ipcRenderer.removeAllListeners('loadApiKey-reply');
        };
    });

    const apiKeyChange = (e) => {
        setApiKey(e.target.value);
    }
    const secretKeyChange = (e) => {
        setSecretKey(e.target.value);
    }
    const bucketNameChange = (e) => {
        setBucketName(e.target.value);
    }
    const regionChange = (e) => {
        setRegion(e.target.value);
    }
    const getJsonFileList = async () => {
        let ret = await ipcRenderer.send('getFile', {
            fileType: "json"
        });

    }
    const getImgFileList = async () => {
        let ret = await ipcRenderer.send('getFile', {
            fileType: "image"
        });

    }
    const uploadJsonFiles = async () => {
        let confirmState = "Upload " + jsonList.length + " files of json?"
        if(window.confirm(confirmState)){
            let ret = await ipcRenderer.send('uploadFile', {
                fileType: "json",
                apiKey: apiKey,
                secretKey: secretKey,
                region: region,
                bucketName: bucketName,
                fileList: jsonList
            });
        }
        
    }
    const saveApiKey = async() => {
        let confirmState = "Save api key?"
        if(window.confirm(confirmState)){
            let ret = await ipcRenderer.send('saveApiKey', {
                apiKey: apiKey,
                secretKey: secretKey,
                region: region,
                bucketName: bucketName
            });
        }
    }
    const uploadImgFiles = async () => {
        let confirmState = "Upload " + imageList.length + " files of image?"
        if(window.confirm(confirmState)){
            let ret = await ipcRenderer.send('uploadFile', {
                fileType: "image",
                apiKey: apiKey,
                secretKey: secretKey,
                region: region,
                bucketName: bucketName,
                fileList: imageList,
                imageExtension: imageExtension
            });

        }
        
    }
    useEffect( () => {
        ipcRenderer.send('loadApiKey', {
        });
    },[]);
    const useStyles = makeStyles({
      card: {
        borderRadius: "20px",
        marginBottom: "10px",
        border: '3px solid white',
        backgroundColor: "transparent"
  
      },
    });
    const classes = useStyles();

    return(
        <div>
            <Typography sx={{ mt: 1, mb: 2 }} variant="h6" component="div">
                Upload to AWS S3
            </Typography>
            <Card sx={{ width: "700px", backgroundColor: "transparent", marginLeft: "20px",marginTop:"5px", textAlign: "left", padding : "10px", fontSize: "20px"}} className={classes.card}>
                <span style={{width : '100px', color: "white"}}>Api Key</span>
                <TextField style={{marginLeft: "70px", width : '35%'}} value={apiKey} onChange={(e) => apiKeyChange(e)} size="small" id="outlined-basic" label="api key" variant="outlined" /><br/>     
                <span style={{width : '100px', color: "white"}}>Secret Key</span>
                <TextField style={{marginLeft: "45px",width : '35%'}} value={secretKey} onChange={(e) => secretKeyChange(e)} size="small" id="outlined-basic" label="secret key" variant="outlined" /><br/>   
                <span style={{width : '100px', color: "white"}}>Bucket Name</span>
                <TextField style={{marginLeft: "18px",width : '35%'}} value={bucketName} onChange={(e) => bucketNameChange(e)} size="small" id="outlined-basic" label="bucket name" variant="outlined" /><br/>   
                <span style={{width : '100px', color: "white"}}>Region</span>
                <TextField style={{marginLeft: "76px",width : '35%'}} value={region} onChange={(e) => regionChange(e)} size="small" id="outlined-basic" label="region" variant="outlined" />
                <Button onClick={saveApiKey} style={{marginLeft: "10px"}} variant="contained">Save Api Key</Button><br/> 
                    
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                    <Typography sx={{ mt: 2, mb: 2,color: "white" }} variant="h6" component="div">
                        JSON LIST
                        {jsonNum > 0 ?
                            <span style={{marginLeft: "10px"}}>{jsonNum} Files uploaded</span>
                        :
                        <></>
                        }
                    </Typography>
                    <Demo>
                        <List dense={1} style={{maxHeight: "200px", minHeight: "200px", overflow: "scroll"}}>
                            {jsonNameList.map(fileName => (
                                <ListItem>
                                    <ListItemText key={fileName}
                                        primary={fileName}
                                    />
                                </ListItem>
                            )
                            )}
                        </List>
                    </Demo>
                    <Button onClick={getJsonFileList} sx={{margin:"10px"}} variant="contained">Choose File</Button>     
                    <Button onClick={uploadJsonFiles} variant="contained">Upload</Button>     
                    </Grid>
                    <Grid item xs={12} md={6}>
                    <Typography sx={{ mt: 2, mb: 2,color: "white" }} variant="h6" component="div">
                        IMAGE LIST
                        {imageNum > 0 ?
                            <span style={{marginLeft: "10px"}}>{imageNum} Files uploaded</span>
                        :
                        <></>
                        }
                    </Typography>
                    <Demo>
                        <List dense={1} style={{maxHeight: "200px", minHeight: "200px", overflow: "scroll"}}>
                            {imageNameList.map(fileName => (
                                <ListItem>
                                    <ListItemText key={fileName}
                                        primary={fileName}
                                    />
                                </ListItem>
                            )
                            )}
                        </List>
                    </Demo>
                    <Button onClick={getImgFileList} sx={{margin:"10px"}} variant="contained">Choose File</Button>     
                    <Button onClick={uploadImgFiles} variant="contained">Upload</Button>     
                    </Grid>
                </Grid>
            </Card>
        </div>
    );
}