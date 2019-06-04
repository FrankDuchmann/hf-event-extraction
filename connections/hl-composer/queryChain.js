// =====================
//     REQUIREMENTS
// =====================
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const AdminConnection = require('composer-admin').AdminConnection;
const fs = require('fs');
const colors = require('colors');



// =====================
//    GLOBAL SETTINGS
// =====================
let channel;
let json_path = __dirname;
let connectionCard = "admin@vehicle-manufacture-network";
let exportFileName = "vmn_blocks";


// =====================
//       FUNCTIONS
// =====================

// Establish connection
async function init() {
    let adminConnection = new AdminConnection();
    try {
        await adminConnection.connect(connectionCard);
        console.log("%c conncected ...", "color: green;");

        // Check Composer API
        let businessNetworks = await adminConnection.list();
        businessNetworks.forEach((businessNetwork) => {
            console.log('Deployed business network', businessNetwork);
        });
        console.log("%c Hyperledger Composer API works ", "color: green;");

        // Check Native API
        try{
            const bnc = new BusinessNetworkConnection();
            await bnc.connect(connectionCard);
            let fc = bnc.getNativeAPI();
            channel = fc.getChannel('composerchannel');
            const info = await channel.queryInfo();
            console.log('block height', info.height);
            console.log("%c Hyperledger Fabric API works ", "color: green;");
            queryBlocks();

        }
        catch(error){
            console.log("%c Native API failed", "color: #ff00ff");
            console.log(error);
        }
        
    } catch (error) {
        console.log(error);
    }
}

// query all Blocks
async function queryBlocks() {
    let exportFile = {
        blocks: []
    };
    let query_response = await channel.queryInfo();
    console.log("Blockchain is ", query_response.height.toString() , " blocks long");
    let latestBlockNumber = parseInt(query_response.height.toString());

    for(let i=1; i < latestBlockNumber; i++){
        let _block = await channel.queryBlock(i, false, false);

        console.log("%c -------------", "color: blue");
        console.log("%c Block " + i, "color:blue");
        console.log("# of Transactions: ", _block.data.data.length);
        console.log(" tx_id ", _block.data.data[0].payload.header.channel_header.tx_id);
        console.log("%c -------------", "color: blue");

        exportFile.blocks.push(_block);
    }
    writeBlocks(exportFile);
}

async function writeBlocks(exportFile) {
    var json = JSON.stringify(exportFile);
    fs.writeFile(json_path + '/data/' + exportFileName  + '.json', json, (err) => {  
        // throws an error, you could also catch it here
        if (err) throw err;
    
        // success case, the file was saved
        console.log('All Blocks Saved'.green.bold);
    });
}



// =====================
//        START
// =====================
init();