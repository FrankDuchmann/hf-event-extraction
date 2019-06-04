# Hyperledger Fabric Event Extraction

This project is developed during my master thesis at the Institute [AIFB](http://www.aifb.kit.edu/web/Hauptseite) of the [KIT](http://www.kit.edu).

## What it does

This project allows to extract meaningful events from a running [Hyperledger Fabric](https://hyperledger-fabric.readthedocs.io/en/release-1.4/) or [Hyperledger Composer](https://hyperledger.github.io/composer/latest/) instance and saves these event logs in process-log like structure to apply [process mining techniques](https://www.win.tue.nl/ieeetfpm/downloads/Process%20Mining%20Manifesto.pdf).

---

## Work in Progress
This project is work in progress and only a proof of concept and will always remain in this state.

## Installation
In order to get started you need a running Hyperledger Fabric or Hyperledger Composer instance running!

download this project to your working directory:
```console
$ git clone https://github.com/FrankDuchmann/hf-event-extraction 
```

install all dependencies with:
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

![Alt text](docs/query_chain_in_action.png?raw=true "query_chain_in_action")

### 2. Event Extraction
In order to run the event extraction, you can optionally configure custom events. Open the *event-extraction/event-definition.csv* file and add your custom definitions. This file is already configured with some sample events.

```csv
eventLevel3; owner assigned; [owner = .* > .*]
eventLevel3; vin assigned to car; [vin = .* > .*]
eventLevel3; vehicleStatus changed to ACTIVE; [vehicleStatus = .* > ACTIVE]
```

edit the *event-extraction/getProcessLog.js* script and set the variables *filePathBlocks*, *fileNameProcessLog* and *filePathComplexEventDefinition*, or leave them as default if you have not done any changes before.

run the script with:
```console
$ node event-extraction/getProcessLog.js
```

if everything works fine you should get an output like below and a json file inside *event-extraction/data*.

![Alt text](docs/get_process_log_in_action.png?raw=true "get_process_log_in_action")

### 3. Event Log Export
The last step is to export the event log as a CSV file. In the configuration part of the */log-export/export-csv.js* script you can set the parameters for sorting order, date format and encoding. Furthermore, the input file and the name of the output file must be set.

run the script with:
```console
$ node log-export/export-csv.js
```

After executing this script, a csv file is created unter */log-export/data/vmn_log.csv*. This event log can then be used for process mining


## Process Mining
It is now possible to apply Process Discovery methods to the Event Log. [The Disco](http://fluxicon.com/disco/) program can be used to derive a process model. 

![disco](docs/disco_fuzzy_model.png?raw=true "disco_fuzzy_model")

Alternatively, [ProM](http://www.promtools.org/doku.php) can be used to detect non-conforming behavior. First a target process model is developed. Then the event log can be applied by token replay. 

![prom](docs/prom_petri_net_token_replay.png?raw=true "prom_petri_net_token_replay")


## Built With

* [Node.js](https://nodejs.org/en/)
* [Hyperledger Composer API](https://hyperledger.github.io/composer/v0.19/api/api-doc-index)
* [Hyperledger Fabric SDK for Node.js](https://fabric-sdk-node.github.io/release-1.4/index.html)

---
## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
