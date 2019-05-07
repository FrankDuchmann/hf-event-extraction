'use strict';

// =====================
//     REQUIREMENTS
// =====================
let path = require('path');
let fs = require('fs');
let papa = require('papaparse');
let colors = require('colors');


// =====================
//    GLOBAL SETTINGS
// =====================
// file path to blocks.json, examples provided below
let filePathBlocks = path.join(__dirname + "/.." + "/connections/hl-composer/data/vehicle-manufacture-network-blocks.json");
//let filePathBlocks = path.join(__dirname + "/.." + "/connections/hl-fabric/data/blocks.json");
//let filePathBlocks = path.join(__dirname + "/.." + "/connections/ibm-blockchain-platform/data/blocks.json")

// file path to save process-log
let fileNameProcessLog = "process-log-manufacture-vehicle-network.json";
let filePathProcessLog = path.join(__dirname, "data", fileNameProcessLog);

// Concat to existing Log
let concatToLog = false;

// Complex Event Definition
let filePathComplexEventDefinition = path.join(__dirname, "event-definition.csv");

// type can be "composer" or "fabric"
let type = "composer";



// shortenKeys, consider for Ids and Classes only the last part of the key
// for example: Participant:org.acme.vehicle_network.PersonPaul -> PersonPaul
// can be true or false
let shortenKeys = true;
// delimiter for shortening Ids and
let shortenDelimiter = ".";
// keep # of places
let shortenKeep = 1;


// =====================
//         INIT
// =====================
let content = fs.readFileSync(filePathBlocks);
let data = JSON.parse(content);
let eventDefinitionContent = fs.readFileSync(filePathComplexEventDefinition);
let eventDefinitionData = papa.parse(eventDefinitionContent.toString()).data;
let allStructs = [];
let structsId = [];
let processLog = [];
let eventLevel1Ids = [];
let eventLevel2Ids = [];
let eventLevel3Ids = [];

console.time("Total");


// =====================
//       FUNCTIONS
// =====================

// Return the id of an event
function getEventId(_item, _list) {
    if (_list.indexOf(_item) == -1) {
        _list.push(_item);
    }
    return (_list.indexOf(_item) + 1).toString();
}

// Shorten the keys for better readablility
function shortenKey(_item, _delimiter, _keep) {
    if (shortenKeys == true && _item != undefined) {
        _item = _item.split(_delimiter);
        _item = _item.slice(_item.length - _keep, _item.length);
        _item = _item.join(_delimiter);
    }
    return _item;
}

// flatten object for deep comparison
function flattenObject(ob) {
    return Object.keys(ob).reduce(function (toReturn, k) {
        if (Object.prototype.toString.call(ob[k]) === '[object Date]') {
            toReturn[k] = ob[k].toString();
        }
        else if ((typeof ob[k]) === 'object' && ob[k]) {
            var flatObject = flattenObject(ob[k]);
            Object.keys(flatObject).forEach(function (k2) {
                toReturn[k + '.' + k2] = flatObject[k2];
            });
        }
        else {
            toReturn[k] = ob[k];
        }
        return toReturn;
    }, {});
};

// detect Complex Events defined in "eventDefinition.csv"
function detectComplexEvents(_oldStructure, _newStructure) {
    console.log(" detect complex events ...".gray);
    let result = [];
    for (let i = 1; i < eventDefinitionData.length; i++) {
        console.log(("  Definition" + i).gray);
        let eventLevel = eventDefinitionData[i][0];
        let eventLabel = eventDefinitionData[i][1];
        let eventDefinition = eventDefinitionData[i][2].replace(/ /g, '');
        let eventDefinitionEval = eventDefinition;
        let parts = eventDefinition.match(/\[(.*?)\]/g);
        // for each part
        for (let j = 0; j < parts.length; j++) {
            let key = parts[j].match(/\[(.*?)=/)[1];
            let oldValue = parts[j].match(/=(.*?)>/)[1];
            let oldValueEval = new RegExp(oldValue, 'g').test(_oldStructure[key]);

            let newValue = parts[j].match(/>(.*?)\]/)[1];
            let newValueEval = new RegExp(newValue, 'g').test(_newStructure[key]);

            let expressionResult;
            if (_oldStructure[key] != _newStructure[key]) {
                expressionResult = oldValueEval && newValueEval;
            }
            else {
                expressionResult = false;
            }
            eventDefinitionEval = eventDefinitionEval.replace(parts[j], expressionResult);
        }
        console.log(("  " + eventLabel + ": " + eval(eventDefinitionEval)).gray);
        // console.log(eventLevel, eventLabel, eventDefinition);
        // console.log(eventDefinition);
        // console.log(eventDefinitionEval);
        // console.log(eval(eventDefinitionEval));

        if (eval(eventDefinitionEval)) {
            result.push({
                "eventLevel": eventLevel,
                "eventLabel": eventLabel
            });
            console.log(("  emmit complex event: " + eventLabel).cyan);
        }
    }

    console.log(" detect complex events ...".gray + " [done]".green);
    return result;
}

// save process-log as json file
function save_process_log() {
    let json = JSON.stringify(processLog);
    console.log("");
    console.log('Save Process Log ...'.white.bold)
    console.time("File Saved in");
    if (concatToLog == true) {
        // concat 
        let old_content = fs.readFileSync(filePathProcessLog);
        let old_data = JSON.parse(old_content);
        let complete_data = old_data.concat(processLog);
        let json = JSON.stringify(complete_data);

        fs.writeFileSync(filePathProcessLog, json, (err) => {
            if (err) throw err;
        });
        console.log('Process Log Saved'.green.bold);
    }
    else {
        // just override
        fs.writeFileSync(filePathProcessLog, json, (err) => {
            if (err) throw err;
        });
        console.log('Process Log Saved'.green.bold);
    }
    console.timeEnd("File Saved in");
    console.timeEnd("Total");
}

// extract events
function extract_events() {
    let numberOfBlocks = data.blocks.length;
    console.clear();

    console.log(("numberOfBlocks = " + numberOfBlocks).white.bold);
    console.time("Iteration of Blocks");
    for (let i = 0; i < numberOfBlocks; i++) {
        let currentBlock = data.blocks[i]
        let currentBlockNumber = currentBlock.header.number;

        console.log("-------------------------".white.bold);
        console.log(("|        Block " + currentBlockNumber + "       |").white.bold);
        console.log("Inspecting Block " + currentBlockNumber + " [...]".white);

        console.log(currentBlock.data.data.length.toString().red.bold);
        for (let l = 0; l < currentBlock.data.data.length; l++) {
            let currentBlockData = currentBlock.data.data[l];
            let timeStamp = currentBlockData.payload.header.channel_header.timestamp;
            let channelId = currentBlockData.payload.header.channel_header.channel_id;
            let transactionId = currentBlockData.payload.header.channel_header.tx_id;
            try {
                let actions = currentBlockData.payload.data.actions[0].payload.action.proposal_response_payload.extension.results;
                let input = currentBlockData.payload.data.actions[0].payload.chaincode_proposal_payload.input.chaincode_spec.input;
                let endorser = currentBlockData.payload.data.actions[0].payload.action.endorsements[0].endorser.Mspid;
                let creatorMSP = currentBlockData.payload.data.actions[0].header.creator.Mspid;

                for (let j = 0; j < actions.ns_rwset.length; j++) {
                    let currentNSRWSet = actions.ns_rwset[j];
                    let nameSpace = currentNSRWSet.namespace;
                    if (nameSpace != "lscc") {
                        // do anything else
                        let writes = currentNSRWSet.rwset.writes;
                        for (let k = 0; k < writes.length; k++) {
                            let currentWrite = writes[k];
                            // Init Event
                            let eventLevel1 = null;
                            let eventLevel1Id = null;
                            let eventLevel2 = null;
                            let eventLevel2Id = null;
                            let eventLevel3 = null;
                            let eventLevel3Id = null;
                            let composer_registry_type = null;
                            let composer_registry_type_class = null;
                            let skip_entry = false;

                            let id = currentWrite.key.replace(/\0/g, '');
                            let isDelete = currentWrite.is_delete;
                            let value = (currentWrite.value != "") ? JSON.parse(currentWrite.value) : null;

                            // composer specific attributes
                            if (type == "composer") {
                                if (id.includes("Historian") || id.includes("org.hyperledger.composer.system") || id.includes("Transaction") || id.includes("$syscollections") || id.includes("$sysregistries")) {
                                    // do not consider composer system-entries
                                    skip_entry = true;
                                }
                                else {
                                    skip_entry = false;
                                }

                            }
                            else if (type == "fabric") {
                                skip_entry = false;
                            }

                            // Check objects and create events
                            if (skip_entry == false) {
                                console.log((" Check Object with id=" + id).yellow)
                                let complexEvents = [];
                                if (structsId.indexOf(id) != -1) {
                                    // object exists -> UPDATED
                                    let oldStructure = allStructs.find(item => item.id == id).value;
                                    let oldStructureIndex = allStructs.findIndex(item => item.id == id);
                                    let newStructure = value;
                                    let oldStructureFlat = flattenObject(oldStructure);
                                    let newStructureFlat = flattenObject(newStructure);
                                    let eventLevel2Stack = [];
                                    let eventLevel3Stack = [];
                                    for (let key in newStructureFlat) {
                                        if (oldStructureFlat[key] != newStructureFlat[key]) {
                                            // value changed
                                            console.log((" Property " + key + " changed from " + shortenKey(oldStructureFlat[key], shortenDelimiter, shortenKeep) + " to " + shortenKey(newStructureFlat[key], shortenDelimiter, shortenKeep)).magenta);
                                            eventLevel2Stack.push(key);
                                            eventLevel3Stack.push([key, oldStructureFlat[key], newStructureFlat[key]]);
                                        }
                                    }
                                    // Level 1
                                    if (type == "composer") {
                                        composer_registry_type = value.$registryType;
                                        composer_registry_type_class = value.$class;
                                        if (composer_registry_type == "Asset") eventLevel1 = "asset updated";
                                        if (composer_registry_type == "Participant") eventLevel1 = "participant updated";
                                    }
                                    else {
                                        eventLevel1 = "object updated";
                                    }
                                    eventLevel1Id = getEventId(eventLevel1, eventLevel1Ids);
                                    // Level 2
                                    eventLevel2 = eventLevel2Stack.sort().join(', ') + " changed";
                                    eventLevel2Id = getEventId(eventLevel2, eventLevel2Ids);
                                    // Level 3
                                    for (let k = 0; k < eventLevel3Stack.length; k++) {
                                        eventLevel3Stack[k] = eventLevel3Stack[k][0] + ":" + shortenKey(eventLevel3Stack[k][1], shortenDelimiter, shortenKeep) + " > " + shortenKey(eventLevel3Stack[k][2], shortenDelimiter, shortenKeep);
                                    }
                                    eventLevel3 = eventLevel3Stack.sort().join(', ');
                                    eventLevel3Id = getEventId(eventLevel3, eventLevel3Ids);

                                    // detect complex events
                                    let complexEvent = detectComplexEvents(oldStructureFlat, newStructureFlat);
                                    if (complexEvent.length > 0) {
                                        complexEvent.forEach(function (item) {
                                            if (item.eventLevel == "eventLevel1") eventLevel1 = item.eventLabel;
                                            if (item.eventLevel == "eventLevel2") eventLevel2 = item.eventLabel;
                                            if (item.eventLevel == "eventLevel3") eventLevel3 = item.eventLabel;

                                            // Add Event to ProcessLog
                                            processLog.push({
                                                "key": id,
                                                "timestamp": timeStamp,
                                                "eventLevel1": eventLevel1,
                                                "eventLevel1Id": eventLevel1Id,
                                                "eventLevel2": eventLevel2,
                                                "eventLevel2Id": eventLevel2Id,
                                                "eventLevel3": eventLevel3,
                                                "eventLevel3Id": eventLevel3Id,
                                                "tx_id": transactionId,
                                                "chaincode_id": nameSpace,
                                                "block_number": currentBlockNumber,
                                                "endorser": endorser,
                                                "channelId": channelId,
                                                "creatorMSP": creatorMSP,
                                                "registryType": composer_registry_type, // optional
                                                "assetClass": composer_registry_type_class // optional
                                            });
                                        })
                                    }
                                    else {
                                        //no complex Events

                                        // Add Event to ProcessLog
                                        processLog.push({
                                            "key": id,
                                            "timestamp": timeStamp,
                                            "eventLevel1": eventLevel1,
                                            "eventLevel1Id": eventLevel1Id,
                                            "eventLevel2": eventLevel2,
                                            "eventLevel2Id": eventLevel2Id,
                                            "eventLevel3": eventLevel3,
                                            "eventLevel3Id": eventLevel3Id,
                                            "tx_id": transactionId,
                                            "chaincode_id": nameSpace,
                                            "block_number": currentBlockNumber,
                                            "endorser": endorser,
                                            "channelId": channelId,
                                            "creatorMSP": creatorMSP,
                                            "registryType": composer_registry_type, // optional
                                            "assetClass": composer_registry_type_class // optional
                                        });

                                        // Logging to Console
                                        console.log((" EventL1 " + eventLevel1).blue);
                                        console.log((" EventL2 " + eventLevel2).blue);
                                        console.log((" EventL3 " + eventLevel3).blue);
                                    }

                                    // overwrite oldStructure with newStructure
                                    allStructs[oldStructureIndex].value = value;
                                }
                                else {
                                    // object does not exist -> CREATED
                                    // Level 1
                                    if (type == "composer") {
                                        composer_registry_type = value.$registryType;
                                        composer_registry_type_class = value.$class;
                                        if (composer_registry_type == "Asset") eventLevel1 = "asset created";
                                        if (composer_registry_type == "Participant") eventLevel1 = "participant created";
                                    }
                                    else {
                                        eventLevel1 = "object updated";
                                    }
                                    eventLevel1Id = getEventId(eventLevel1, eventLevel1Ids);
                                    // Level 2
                                    if (type == "composer") {
                                        eventLevel2 = shortenKey(composer_registry_type_class, shortenDelimiter, shortenKeep) + " created";
                                    }
                                    else {
                                        eventLevel2 = shortenKey(id, shortenDelimiter, shortenKeep) + " created";
                                    }
                                    eventLevel2Id = getEventId(eventLevel2, eventLevel2Ids);
                                    // Level 3
                                    if (type == "composer") {
                                        if (composer_registry_type == "Asset") eventLevel3 = "asset - " + shortenKey(composer_registry_type_class, shortenDelimiter, shortenKeep) + " created";
                                        if (composer_registry_type == "Participant") eventLevel3 = "participant - " + shortenKey(composer_registry_type_class, shortenDelimiter, shortenKeep) + " created";
                                    }
                                    else {
                                        eventLevel3 = "object created with";
                                    }
                                    eventLevel3Id = getEventId(eventLevel3, eventLevel3Ids);

                                    // add to registry
                                    structsId.push(id);
                                    allStructs.push({
                                        "id": id,
                                        "is_delete": isDelete,
                                        "value": value
                                    });

                                    // Logging to Console
                                    console.log((" EventL1 " + eventLevel1).blue);
                                    console.log((" EventL2 " + eventLevel2).blue);
                                    console.log((" EventL3 " + eventLevel3).blue);

                                }
                            }
                        }
                    }
                    else {
                        // ignore lscc for now
                    }
                }
            }
            catch (error) {
                console.log(" No actions defined".grey);
                console.log(" error", error);
            }

            console.log(("Inspecting Block " + currentBlockNumber).white + " [done]".green.bold);
            console.log("|                       |".white.bold);
            console.log("-------------------------".white.bold);
            console.log("\n");
        }

    }
    console.timeEnd("Iteration of Blocks");
}


// =====================
//        START
// =====================
extract_events();
save_process_log();

let debugger_not_end;