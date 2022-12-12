const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const { atRule } = require('postcss');
const {dialog, shell} = require('electron');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// var remote = window.require('electron').remote;
// var electronFs = remote.require('fs');
// var electronDialog = remote.dialog;

function createWindow() {
    /*
    * 넓이 1920에 높이 1080의 FHD 풀스크린 앱을 실행시킵니다.
    * */
   console.log(path.join(app.getAppPath(), 'preload.js'));
   console.log(path.join(__dirname, '/../build/Logo.png'));
    const win = new BrowserWindow({
        width:1024,
        height:768,
        icon: path.join(__dirname, '/assets/png/256x256.png'),
        webPreferences: {
            // preload: path.join(app.getAppPath(), 'preload.js'),
            contextIsolation: false,
            nodeIntegration: true, // <--- flag
            nodeIntegrationInWorker: true // <---  for web workers
        }
    });
    console.log(process.env.NODE_ENV + " mode");
    if(process.env.NODE_ENV.toString() != "dev"){
        win.setMenu(null);
    }
    const isWindows = process.platform === 'win32';
  let needsFocusFix = false;
  let triggeringProgrammaticBlur = false;

  win.on('blur', (event) => {
    if(!triggeringProgrammaticBlur) {
      needsFocusFix = true;
    }
  })

  win.on('focus', (event) => {
    if(isWindows && needsFocusFix) {
      needsFocusFix = false;
      triggeringProgrammaticBlur = true;
      setTimeout(function () {
        win.blur();
        win.focus();
        setTimeout(function () {
          triggeringProgrammaticBlur = false;
        }, 100);
      }, 100);
    }
  })

    /*
    * ELECTRON_START_URL을 직접 제공할경우 해당 URL을 로드합니다.
    * 만일 URL을 따로 지정하지 않을경우 (프로덕션빌드) React 앱이
    * 빌드되는 build 폴더의 index.html 파일을 로드합니다.
    * */
    const startUrl = process.env.ELECTRON_START_URL || url.format({
        pathname: path.join(__dirname, '/../build/index.html'),
        protocol: 'file:',
        slashes: true
    });
    // const iconUrl = url.format({
    //     pathname: path.join(__dirname, '/../build/Logo.png'),
    //     protocol: 'file:',
    //     slashes: true
    //   })

    /*
    * startUrl에 배정되는 url을 맨 위에서 생성한 BrowserWindow에서 실행시킵니다.
    * */
    win.loadURL(startUrl);

}

app.on('ready', createWindow);

ipcMain.on('createWallet', (event, arg) =>{
    console.log(arg.wallet);
    console.log("got at ipcMain");
    const walletBuffer = fs.readFileSync('./wallet.json');
    const walletJson = walletBuffer.toString();
    const walletData = JSON.parse(walletJson);
    if(arg.chain == "ETH"){
        walletData.ethWallet.push(arg.wallet);
        walletData.ethPassword = arg.password;
        walletData.infuraCode = arg.infuraCode;
        event.sender.send('getWallet-reply', arg.wallet);
    }else if(arg.chain == "KLAY"){
        walletData.klayWallet.push(arg.wallet);
        walletData.klayPassword = arg.password
        event.sender.send('getWallet-reply', arg.wallet);
    }
    fs.writeFileSync('./wallet.json', JSON.stringify(walletData));
    event.sender.send('createWallet-reply', arg.wallet);

})

ipcMain.on('checkWallet', (event, arg) =>{
    let ethWallet = 0;
    let klayWallet = 0;
    if(fs.existsSync( './wallet.json' )){
        const walletBuffer = fs.readFileSync('./wallet.json');
        const walletJson = walletBuffer.toString();
        const walletData = JSON.parse(walletJson);
        if(walletData.ethWallet.length > 0){
            ethWallet = 1;
        }
        if(walletData.klayWallet.length > 0){
            klayWallet = 1;
        }

    }else{
        const walletEmptyData = {
            "ethWallet": [],
            "klayWallet": [],
            "ethPassword": "",
            "klayPassword": "",
            "infuraCode": ""
        }
        fs.writeFileSync('./wallet.json', JSON.stringify(walletEmptyData));

    }
    event.sender.send('checkWallet-reply', {
        "klayWallet" : klayWallet,
        "ethWallet" : ethWallet
    });

});

ipcMain.on('addNewWallet', (event, arg) =>{
    console.log(arg.newWallet);
    const walletBuffer = fs.readFileSync('./wallet.json');
    const walletJson = walletBuffer.toString();
    const walletData = JSON.parse(walletJson);
    let temp = new Array();
    if(arg.chain == "ETH"){
        if(typeof arg.newWallet != undefined){
            walletData.ethWallet.push(arg.newWallet);

        }
        event.sender.send('addWallet-reply', {
            "walletData" : arg.newWallet,
            "password" : walletData.ethPassword,
            "infuraCode" : walletData.infuraCode
        });
    }else if(arg.chain == "KLAY"){
        if(typeof arg.newWallet != undefined){
            walletData.klayWallet.push(arg.newWallet);
        }
        event.sender.send('addWallet-reply', {
            "walletData" : arg.newWallet,
            "password" : walletData.klayPassword
        });
    }
    fs.writeFileSync('./wallet.json', JSON.stringify(walletData));
})

ipcMain.on('getWallet', (event, arg) =>{
    console.log("getWallet IPC");
    console.log(arg);
    const walletBuffer = fs.readFileSync('./wallet.json');
    const walletJson = walletBuffer.toString();
    const walletData = JSON.parse(walletJson);
    if(arg.chain == "ETH"){
        event.sender.send('getWallet-reply', {
            "walletData" : walletData.ethWallet,
            "password" : walletData.ethPassword,
            "infuraCode" : walletData.infuraCode
        });
    }else if(arg.chain == "KLAY"){
        event.sender.send('getWallet-reply', {
            "walletData" : walletData.klayWallet,
            "password": walletData.klayPassword
        });
    }

})
ipcMain.on('updateContract', (event, arg) =>{
    console.log("contractUpdated IPC");
    console.log(arg);
    const contractBuffer = fs.readFileSync('./deployedContracts.json');
    const contractJson = contractBuffer.toString();
    const contractData = JSON.parse(contractJson);
    let contractMainnetList = new Array();
    let contractTestnetList = new Array();

    if(arg.chain == "ETH"){
        if(arg.network == "goerli"){
            for(let i = 0;i<contractData.ETH.goerli.length;i++){
                if(contractData.ETH.goerli[i].contract == arg.contract){
                    if(arg.update == "maxSupply"){
                        contractData.ETH.goerli[i].maxSupply = arg.updateData;
                    }else if(arg.update == "price"){
                        contractData.ETH.goerli[i].price = arg.updateData;
                    }else if(arg.update == "baseURL"){
                        contractData.ETH.goerli[i].baseURL = arg.updateData;
                    }else if(arg.update == "purchaseLimit"){
                        contractData.ETH.goerli[i].purchaseLimit = arg.updateData;
                    }
                }
                contractTestnetList.push(contractData.ETH.goerli[i]);
            }
        }else if(arg.network == "mainnet"){
            for(let i = 0;i<contractData.ETH.mainnet.length;i++){
                if(contractData.ETH.mainnet[i].contract == arg.contract){
                    if(arg.update == "maxSupply"){
                        contractData.ETH.mainnet[i].maxSupply = arg.updateData;
                    }else if(arg.update == "price"){
                        contractData.ETH.mainnet[i].price = arg.updateData;
                    }else if(arg.update == "baseURL"){
                        contractData.ETH.mainnet[i].baseURL = arg.updateData;
                    }else if(arg.update == "purchaseLimit"){
                        contractData.ETH.mainnet[i].purchaseLimit = arg.updateData;
                    }
                }
                contractMainnetList.push(contractData.ETH.mainnet[i]);
            }
        }
    }else if(arg.chain == "KLAY"){
        if(arg.network == "baobab"){
            for(let i = 0;i<contractData.KLAY.baobab.length;i++){
                console.log(contractData.KLAY.baobab[i].contract);
                if(contractData.KLAY.baobab[i].contract == arg.contract){
                    console.log("GOT HERE");
                    if(arg.update == "maxSupply"){
                        contractData.KLAY.baobab[i].maxSupply = arg.updateData;
                    }else if(arg.update == "price"){
                        contractData.KLAY.baobab[i].price = arg.updateData;
                    }else if(arg.update == "baseURL"){
                        contractData.KLAY.baobab[i].baseURL = arg.updateData;
                    }else if(arg.update == "purchaseLimit"){
                        contractData.KLAY.baobab[i].purchaseLimit = arg.updateData;
                    }
                }
                contractTestnetList.push(contractData.KLAY.baobab[i]);
            }
        }else if(arg.network == "mainnet"){
            for(let i = 0;i<contractData.KLAY.mainnet.length;i++){
                if(contractData.KLAY.mainnet[i].contract == arg.contract){
                    if(arg.update == "maxSupply"){
                        contractData.KLAY.mainnet[i].maxSupply = arg.updateData;
                    }else if(arg.update == "price"){
                        contractData.KLAY.mainnet[i].price = arg.updateData;
                    }else if(arg.update == "baseURL"){
                        contractData.KLAY.mainnet[i].baseURL = arg.updateData;
                    }else if(arg.update == "purchaseLimit"){
                        contractData.KLAY.mainnet[i].purchaseLimit = arg.updateData;
                    }
                }
                contractMainnetList.push(contractData.KLAY.mainnet[i]);
            }
        }
    }

    fs.writeFileSync('./deployedContracts.json', JSON.stringify(contractData));
    event.sender.send('getContractList-reply', {
        mainnet: contractMainnetList,
        testnet: contractTestnetList
    });



})
ipcMain.on('contractDeployed', async (event, arg) =>{
    console.log("contractDeployed IPC");
    if(!fs.existsSync( './deployedContracts.json' )){
        const contractEmptyData = {
            "ETH": {
                "goerli": [],
                "mainnet": []
            },
            "KLAY": {
                "baobab": [],
                "mainnet": []
            }
        }
        let ret = await fs.writeFileSync('./deployedContracts.json', JSON.stringify(contractEmptyData));

    }
    const contractBuffer = fs.readFileSync('./deployedContracts.json');
    const contractJson = contractBuffer.toString();
    const contractData = JSON.parse(contractJson);

    if(arg.chain == "ETH"){
        if(arg.network == "goerli"){
            let contractList = contractData.ETH.goerli;
            contractList[contractList.length] = arg.contractInfo;
            contractData.ETH.goerli = contractList;
            console.log("got here");
        }else if(arg.network == "mainnet"){
            let contractList = contractData.ETH.mainnet;
            contractList[contractList.length] = arg.contractInfo;
            contractData.ETH.mainnet = contractList;
        }
    }else if(arg.chain == "KLAY"){
        if(arg.network == "baobab"){
            let contractList = contractData.KLAY.baobab;
            contractList[contractList.length] = arg.contractInfo;
            contractData.KLAY.baobab = contractList;
            console.log("got here");
        }else if(arg.network == "mainnet"){
            let contractList = contractData.KLAY.mainnet;
            contractList[contractList.length] = arg.contractInfo;
            contractData.KLAY.mainnet = contractList;
        }
    }

    fs.writeFileSync('./deployedContracts.json', JSON.stringify(contractData));
    // event.sender.send('getWallet', walletData);
})


ipcMain.on('getContractList', async (event, arg) =>{
    console.log("GetcontractDeployed IPC");
    console.log(arg);
    if(!fs.existsSync( './deployedContracts.json' )){
        const contractEmptyData = {
            "ETH": {
                "goerli": [],
                "mainnet": []
            },
            "KLAY": {
                "baobab": [],
                "mainnet": []
            }
        }
        let ret = await fs.writeFileSync('./deployedContracts.json', JSON.stringify(contractEmptyData));

    }
    const contractBuffer = fs.readFileSync('./deployedContracts.json');
    const contractJson = contractBuffer.toString();
    const contractData = JSON.parse(contractJson);

    let contractMainnetList = new Array();
    let contractTestnetList = new Array();
    
    if(arg.chain == "ETH"){
        if(contractData.ETH){
            for(let i = 0;i<contractData.ETH.goerli.length;i++){
                console.log(contractData.ETH.goerli[i]);
                if(contractData.ETH.goerli[i].owner == arg.account){
                    contractTestnetList.push(contractData.ETH.goerli[i]);
                }
            }
            for(let i = 0;i<contractData.ETH.mainnet.length;i++){
                if(contractData.ETH.mainnet[i].owner == arg.account){
                    contractMainnetList.push(contractData.ETH.mainnet[i]);
                }
            }
        }
    }else if(arg.chain == "KLAY"){
        console.log("BBBBB");
        console.log(contractData.KLAY.contractInfo);
        if(contractData.KLAY){
            console.log("AAAAA");
            for(let i = 0;i<contractData.KLAY.baobab.length;i++){
                console.log(contractData.KLAY.baobab[i].owner == arg.account);
                if(contractData.KLAY.baobab[i].owner == arg.account){
                    contractTestnetList.push(contractData.KLAY.baobab[i]);
                }
            }
            for(let i = 0;i<contractData.KLAY.mainnet.length;i++){
                if(contractData.KLAY.mainnet[i].owner == arg.account){
                    contractMainnetList.push(contractData.KLAY.mainnet[i]);
                }
            }

        }
    }
    event.sender.send('getContractList-reply', {
        mainnet: contractMainnetList,
        testnet: contractTestnetList
    });
})
ipcMain.on('getJsonFile', (event, arg) => {
    dialog.showOpenDialog({properties: ['openFile'] }).then(function (response) {
        if (!response.canceled) {
            // handle fully qualified file name
            console.log(response.filePaths[0]);
            
            const listBuffer = fs.readFileSync(response.filePaths[0]);
            const listJson = listBuffer.toString();
            const listData = JSON.parse(listJson);
            
            event.sender.send('getJsonFile-reply', {
                data: listData
            });
        } else {
            console.log("no file selected");
        }
    });
})

ipcMain.on('getFile', (event, arg) => {
    dialog.showOpenDialog({properties: ['openFile', 'multiSelections'] }).then(function (response) {
        if (!response.canceled) {
            // handle fully qualified file name
            console.log(response.filePaths[0]);
            let result = new Array();
            let imageExtension;
            if(arg.fileType == "json"){
                for(let i=0;i<response.filePaths.length;i++){
                    let temp = response.filePaths[i].split(".");
                    if(temp[temp.length-1] == "json"){
                        result.push(response.filePaths[i]);
                    }
                }
            }else if(arg.fileType == "image"){
                for(let i=0;i<response.filePaths.length;i++){
                    let temp = response.filePaths[i].split(".");
                    if(temp[temp.length-1] == "png" || temp[temp.length-1] == "jpg" || temp[temp.length-1] == "jpeg" || temp[temp.length-1] == "mp4" || temp[temp.length-1] == "svg" || temp[temp.length-1] == "glb" || temp[temp.length-1] == "gltf"){
                        result.push(response.filePaths[i]);
                        imageExtension = temp[temp.length-1];
                    }
                }
            }
            event.sender.send('getFile-reply', {
                fileType: arg.fileType,
                fileList: result
            });
        } else {
            console.log("no file selected");
        }
    });
})


ipcMain.on('uploadFile', async (event, arg) => {
    // fileType: "image",
    // apiKey: apiKey,
    // secretKey: secretKey,
    // region: region,
    // bucketName: bucketName,
    // fileList: imageList
    console.log(arg.apiKey);

    let attribute = {
        apiKey: arg.apiKey,
        secretKey: arg.secretKey,
        region: arg.region,
        bucketName: arg.bucketName
    }
    if(arg.fileType == "json"){
        for(let i=0;i<arg.fileList.length;i++){
            console.log(arg.fileList[i]);
            let ret = await awsUpload(arg.fileList[i], "json", attribute); 
            event.sender.send('uploadFile-reply', {
                type: "json",
                fileNum : (i + 1)
            });
        }
    }else if(arg.fileType == "image"){
        for(let i=0;i<arg.fileList.length;i++){
            console.log(arg.fileList[i]);
            let ret = await awsUpload(arg.fileList[i], arg.imageExtension , attribute); 
            event.sender.send('uploadFile-reply', {
                type: "image",
                fileNum : (i + 1)
            });
        }
    }
})


ipcMain.on('openFaucet', async (event, arg) => {
    shell.openExternal(arg.url);

})



ipcMain.on('saveApiKey', async (event, arg) => {
    // apiKey: apiKey,
    // secretKey: secretKey,
    // region: region,
    // bucketName: bucketName,
    console.log(arg.apiKey);

    let attribute = {
        apiKey: arg.apiKey,
        secretKey: arg.secretKey,
        region: arg.region,
        bucketName: arg.bucketName
    }
    fs.writeFileSync('./apiKeySaved.json', JSON.stringify(attribute));
    event.sender.send('saveApiKey-reply', {
    });
})

ipcMain.on('loadApiKey', async (event, arg) => {
    const apiBuffer = fs.readFileSync('./apiKeySaved.json');
    const apiJson = apiBuffer.toString();
    const apiData = JSON.parse(apiJson);

    let attribute = {
        apiKey: apiData.apiKey,
        secretKey: apiData.secretKey,
        region: apiData.region,
        bucketName: apiData.bucketName
    }
    console.log(attribute);
    event.sender.send('loadApiKey-reply', {
        attribute: attribute
    });
})


ipcMain.on('changeContractList', (event, arg) =>{
    console.log("ChangecontractChange IPC");
    console.log(arg);
    const contractBuffer = fs.readFileSync('./deployedContracts.json');
    const contractJson = contractBuffer.toString();
    const contractData = JSON.parse(contractJson);

    
    if(arg.chain == "ETH"){
        if(arg.network == "goerli"){
            for(let i = 0;i<contractData.ETH.goerli.length;i++){
                if(contractData.ETH.goerli[i].contract == arg.contractData.contract){
                    contractData.ETH.goerli[i] = arg.contractData;
                }
            }
        }else if(arg.network == "mainnet"){
            for(let i = 0;i<contractData.ETH.mainnet.length;i++){
                if(contractData.ETH.mainnet[i].contract == arg.contractData.contract){
                    contractData.ETH.mainnet[i] = arg.contractData;
                }
            }
        }
    }else if(arg.chain == "KLAY"){
        if(arg.network == "baobab"){
            for(let i = 0;i<contractData.KLAY.baobab.length;i++){
                if(contractData.KLAY.baobab[i].contract == arg.contractData.contract){
                    contractData.KLAY.baobab[i] = arg.contractData;
                }
            }
        }else if(arg.network == "mainnet"){
            for(let i = 0;i<contractData.KLAY.mainnet.length;i++){
                if(contractData.KLAY.mainnet[i].contract == arg.contractData.contract){
                    contractData.KLAY.mainnet[i] = arg.contractData;
                }
            }
        }
    }
})


async function uploadFile(
    s3Client,
    awsS3Bucket,
    filename,
    contentType,
    body
  ){
    const mediaUploadParams = {
      Bucket: awsS3Bucket,
      Key: filename,
      Body: body,
      ACL: 'public-read',
      ContentType: contentType,
    };

    let filename2 = filename.substr(5);
  
    try {
      await s3Client.send(new PutObjectCommand(mediaUploadParams));
      console.log('uploaded filename:', filename);
    } catch (err) {
      console.log('Error', err);
    }
  
    const url = `https://${awsS3Bucket}.s3.amazonaws.com/json/${filename}`;
    console.log('Location:', url);
    return url;
  }

  
async function awsUpload(image, type, attribute) {
  // apiKey: apiKey,
  // secretKey: secretKey,
  // region: region,
  // bucketName: bucketName
    console.log(image);
    const REGION = attribute.region;
    const s3Client = new S3Client({ region: REGION,
      credentials:{
          accessKeyId:attribute.apiKey,
          secretAccessKey: attribute.secretKey
      }
    });
  
    async function uploadMedia(media, type) {
      const mediaPath = media;
      const mediaFileStream = fs.createReadStream(media);
      let tempPath = media.split("\\");
      let tempFileName;

      if(type == "json"){
        tempFileName = "json/" + tempPath[tempPath.length-1];
      }else{
        tempFileName = "image/" + tempPath[tempPath.length-1];
      }

      const mediaUrl = await uploadFile(
        s3Client,
        attribute.bucketName,
        tempFileName,
        type,
        mediaFileStream,
      );
      console.log(mediaUrl);
      return mediaUrl;
    }
    const uriValue = await uploadMedia(image, type);
    return uriValue;
  }
  