// =====================
//     REQUIREMENTS
// =====================
var Fabric_Client = require('fabric-client');
var path = require('path');
var fs = require('fs');


// =====================
//    GLOBAL SETTINGS
// =====================
let network_profile_path = 'config/network-profile.json';
let client_profile_path = 'config/client-profile.json';
let channel_name = 'defaultchannel';


// =====================
//         SETUP
// =====================
// Read config
var networkConfig = path.join(__dirname, network_profile_path)
var clientConfig = path.join(__dirname, client_profile_path);

// Setup network to query against
var fabric_client = Fabric_Client.loadFromConfig(networkConfig);
fabric_client.loadFromConfig(clientConfig);
var channel = fabric_client.getChannel(channel_name);

// Set user and certificates for query
var json_path = __dirname;

// Set export file
var exportFile = {
    blocks: []
 };


// =====================
//       FUNCTIONS
// =====================
async function init(){
    console.clear();
    let init = await fabric_client.initCredentialStores(); 
    let user = await fabric_client.getUserContext('user1', true);
    if (user && user.isEnrolled()) {
        console.log('%c loaded user1 as user', 'color: #00ff00');
        console.log('%c starting to query now...', 'color: #00ff00');
        queryBlocks();
	} else {
		throw new Error('Failed to get user1.... run registerUser.js');
    }
}

async function queryBlocks(){
    let query_response = await channel.queryInfo();
    console.log("Blockchain is : ", query_response.height.toString() , " long");
    let latestBlockNumber = parseInt(query_response.height.toString());

    for(let i=1; i < latestBlockNumber; i++){
        let _block = await channel.queryBlock(i, false, false);
        //console.log("Block " + i, _block.toString());

        console.log("%c -------------", "color: blue");
        console.log("Block " + i,);
        console.log("# of Transactions: ", _block.data.data.length);
        console.log(" tx_id ", _block.data.data[0].payload.header.channel_header.tx_id);
        //let tx = await channel.queryTransaction(_block.data.data[0].payload.header.channel_header.tx_id);
        //console.log("transcation", tx);
        console.log("%c -------------", "color: blue");

        exportFile.blocks.push(_block);
    }
    
    let json = JSON.stringify(exportFile);
    fs.writeFile(json_path + '/data/blocks.json', json, (err) => {  
        // throws an error, you could also catch it here
        if (err) throw err;
    
        // success case, the file was saved
        console.log('All Blocks Saved');
    });
}


// =====================
//        START
// =====================
init();