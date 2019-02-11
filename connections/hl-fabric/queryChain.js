// =====================
//     REQUIREMENTS
// =====================
var Fabric_Client = require('fabric-client');
var path = require('path');
var fs = require('fs');


// =====================
//    GLOBAL SETTINGS
// =====================
let channel = 'mychannel'
let peer_address = 'grpc://localhost:7051';
let store_path = path.join(__dirname, 'hfc-key-store');


// =====================
//         SETUP
// =====================
// Setup network to query against
let fabric_client = new Fabric_Client();
let channel = fabric_client.newChannel(channel);
let peer = fabric_client.newPeer(peer_address);
channel.addPeer(peer);

// Set user and certificates for query
let store_path = path.join(__dirname, 'hfc-key-store');
let json_path = __dirname;

// Set export file
let exportFile = {
    blocks: []
 };


// =====================
//       FUNCTIONS
// =====================
async function init(){
    console.clear();
    let state_store = await Fabric_Client.newDefaultKeyValueStore({ path: store_path});
    fabric_client.setStateStore(state_store);

    // Set Credentials for user
    let crypto_suite = Fabric_Client.newCryptoSuite();
    let crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
	crypto_suite.setCryptoKeyStore(crypto_store);
    fabric_client.setCryptoSuite(crypto_suite);
    
    let user = await fabric_client.getUserContext('user1', true);
    if (user && user.isEnrolled()) {
        console.log('%c loaded user1 as user', 'color: #00ff00');
        console.log('%c starting to query now...', 'color: #00ff00');
        //query();
        queryBlocks();
	} else {
		throw new Error('Failed to get user1.... run registerUser.js');
    }
}

async function queryBlocks(){
    let query_response = await channel.queryInfo();
    //console.log("Result", query_response);
    console.log("Blockchain is : ", query_response.height.toString() , " long");
    let latestBlockNumber = parseInt(query_response.height.toString());

    for(let i=1; i < latestBlockNumber; i++){
        let _block = await channel.queryBlock(i, peer, false, false);
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



