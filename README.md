# Hyperledger Fabric Event Extraction

This project is developed during my master thesis at the Institute [AIFB](http://www.aifb.kit.edu/web/Hauptseite) of the [KIT](http://www.kit.edu).

## What it does

This project allows to extract meaningful events from a running Hyperledger Fabric or Hyperledger Composer instance and saves these event logs in process-log like structure to apply [process mining techniques](https://www.win.tue.nl/ieeetfpm/downloads/Process%20Mining%20Manifesto.pdf).

---

## Work in Progress
This project is work in progress and only a proof of concept and will always remain in this state.

## Installation
In order to get started you need a running Hyperledger Fabric or Hyperledger Composer instance running!

download this project to your working directory
```console
$ git clone https://github.com/FrankDuchmann/hf-event-extraction 
```

install all dependencies with
```console
$ npm install
```

## Usage

### 1. Connection 
go to the connection folder and choose the corresponding folder for your environment. Open the queryChain.js script and modify the variables *connectionCard* and *exportFileName* in the global settings section. An example is given below.

```javascript
let connectionCard = "admin@vehicle-manufacture-network";
let exportFileName = "vmn_blocks";
```

run the script with
```console
$ node connections/hl-composer/queryChain.js
```

If everything works fine you should get an output like below and there should be a json file inside *connections/hl-composer/data*

**picture**

### 2. Event Extraction
In order to run the event extraction, you can optionally configure custom events. Open the *event-extraction/event-definition.csv* file and add your custom definitions. This file is already configured with some sample events.

```csv
eventLevel3; owner assigned; [owner = .* > .*]
eventLevel3; vin assigned to car; [vin = .* > .*]
eventLevel3; vehicleStatus changed to ACTIVE; [vehicleStatus = .* > ACTIVE]
```

edit the *event-extraction/getProcessLog.js* script and set the variables *filePathBlocks*, *fileNameProcessLog* and *filePathComplexEventDefinition*, or leave them as default if you have not done any changes before.

run the script with 
```console
$ node event-extraction/getProcessLog.js
```

if everything works fine you should get an output like below and a json file inside *event-extraction/data*.

**picture**


to be continued...


## Built With

* [Node.js](https://nodejs.org/en/)
* [Hyperledger Composer API](https://hyperledger.github.io/composer/v0.19/api/api-doc-index)
* [Hyperledger Fabric SDK for Node.js](https://fabric-sdk-node.github.io/release-1.4/index.html)

---
## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
