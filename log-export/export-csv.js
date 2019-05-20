'use strict';

// =====================
//       CONFIG
// =====================
let processLogFileName = "vmn_log_error.json";
let eventLogCSVName = "vmn_log_error.csv";
//let timeStampFormat = ""; //default
let timeStampFormat = "DD.MM.YYYY HH.mm.ss"
let sortParameter = ['key', 'timestamp', 'eventLevel1Id'];
let csvEncoding = 'utf8'

// MPM Config
let mpmStyle = true;
let mpmFileSuffix = "_mpm" 
let startEventId = "0";
let startEventName = "Start";
let endEventId = "99999999";
let endEventName = "End"
// ++++++++++++++++++++++++++++++++++


// =====================
//     REQUIREMENTS
// =====================

// Requirements
let path = require('path');
let fs = require('fs');
let stringify = require('csv-stringify');
let arraysort = require('array-sort');
let moment = require('moment');
let DataFrame = require('dataframe-js').DataFrame;

// =====================
//     CONVERT LOG
// =====================
let content = fs.readFileSync(path.join(__dirname + "/.." + "/event-extraction/data/" + processLogFileName));
let data = JSON.parse(content);
console.log("%c file " + processLogFileName + " loaded...", "color: blue");

// Convert Timestamp
data.forEach(element => {
  let date = moment(Date.parse(element.timestamp));
  let dateDisplay = date.format(timeStampFormat);
  element.timestamp = dateDisplay;
});
console.log("%c convert timestamps to " + timeStampFormat + "...", "color: blue")

// Create header
let columns = [];
for(let key in data[0]){
  columns.push(key);
}

// Create DataFrame
let df = new DataFrame(data, columns);
df.sortBy(sortParameter);
console.log("%c create dataframe...", "color: blue");

// MPM Style OPTIONAL
if(mpmStyle == true){
  console.log("%c create eventLog according to MPM Style...", "color: blue");

  // Add Counter
  df = df.map((row) => row.set('counter', '1'));
  console.log("%c    add static counter...", "color: grey");

  // Add Event Counter
  let df_tmp = df.select('key', 'eventLevel1Id', 'counter');
  df_tmp = df_tmp.groupBy('key');
  df_tmp = df_tmp.aggregate(group => group.stat.sum('counter')).rename('aggregation', 'eventCounter');
  df = df.innerJoin(df_tmp, ['key']);
  console.log("%c    add event counter...", "color: grey");

  // Add ProcessPath Level 1
  let df_tmp2_1 = df.select('key', 'eventLevel1Id');
  df_tmp2_1 = df_tmp2_1.groupBy('key');
  df_tmp2_1 = df_tmp2_1.aggregate(group => {
    return group.reduceRight((p, n) => n.get('eventLevel1Id') + "-" +  p, endEventId)
  }).rename('aggregation', 'tmp_ProcessPath');
  df_tmp2_1 = df_tmp2_1.map((row) => row.set('ProcessPath1', startEventId + '-' + row.get('tmp_ProcessPath')));
  df_tmp2_1 = df_tmp2_1.drop('tmp_ProcessPath');
  df = df.innerJoin(df_tmp2_1, ['key']);
  console.log("%c    add ProcessPathLevel1...", "color: grey");

  // Add ProcessPath Level 2
  let df_tmp2_2 = df.select('key', 'eventLevel2Id');
  df_tmp2_2 = df_tmp2_2.groupBy('key');
  df_tmp2_2 = df_tmp2_2.aggregate(group => {
    return group.reduceRight((p, n) => n.get('eventLevel2Id') + "-" +  p, endEventId)
  }).rename('aggregation', 'tmp_ProcessPath');
  df_tmp2_2 = df_tmp2_2.map((row) => row.set('ProcessPath2', startEventId + '-' + row.get('tmp_ProcessPath')));
  df_tmp2_2 = df_tmp2_2.drop('tmp_ProcessPath');
  df = df.innerJoin(df_tmp2_2, ['key']);
  console.log("%c    add ProcessPathLevel2...", "color: grey");

    // Add ProcessPath Level 3
    let df_tmp2_3 = df.select('key', 'eventLevel3Id');
    df_tmp2_3 = df_tmp2_3.groupBy('key');
    df_tmp2_3 = df_tmp2_3.aggregate(group => {
      return group.reduceRight((p, n) => n.get('eventLevel3Id') + "-" +  p, endEventId)
    }).rename('aggregation', 'tmp_ProcessPath');
    df_tmp2_3 = df_tmp2_3.map((row) => row.set('ProcessPath3', startEventId + '-' + row.get('tmp_ProcessPath')));
    df_tmp2_3 = df_tmp2_3.drop('tmp_ProcessPath');
    df = df.innerJoin(df_tmp2_3, ['key']);
    console.log("%c    add ProcessPathLevel3...", "color: grey");

  // Add Start and End Event & EdgeID
  let df_tmp3 = df.toCollection();
  let df_tmp3_keys = df.distinct('key').toDict();

  df_tmp3_keys.key.forEach(function(key){
    let df_tmp3_1 = df_tmp3.filter(function(element){
      return element.key == key;
    })
    //Start Event
    df_tmp3.push({
      "key": key,
      "timestamp": df_tmp3_1[0].timestamp,
      "eventLevel1": startEventName,
      "eventLevel1Id": startEventId,
      "eventLevel2": startEventName,
      "eventLevel2Id": startEventId,
      "eventLevel3": startEventName,
      "eventLevel3Id": startEventId,
      "counter": "0",
      "ProcessPath1": df_tmp3_1[0].ProcessPath1,
      "ProcessPath2": df_tmp3_1[0].ProcessPath2,
      "ProcessPath3": df_tmp3_1[0].ProcessPath3,
      "chaincode_id": df_tmp3_1[0].chaincode_id
    })
    // End Event
    df_tmp3.push({
      "key": key,
      "timestamp": df_tmp3_1[df_tmp3_1.length - 1].timestamp,
      "eventLevel1": endEventName,
      "eventLevel1Id": endEventId,
      "eventLevel2": endEventName,
      "eventLevel2Id": endEventId,
      "eventLevel3": endEventName,
      "eventLevel3Id": endEventId,
      "counter": "0",
      "ProcessPath1": df_tmp3_1[df_tmp3_1.length - 1].ProcessPath1,
      "ProcessPath2": df_tmp3_1[df_tmp3_1.length - 1].ProcessPath2,
      "ProcessPath3": df_tmp3_1[df_tmp3_1.length - 1].ProcessPath3,
      "chaincode_id": df_tmp3_1[0].chaincode_id
    })

    // EdgeID
    df_tmp3_1 = df_tmp3.filter(function(element){
      return element.key == key;
    })
    let df_tmp3_1_sort = arraysort(df_tmp3_1, sortParameter);

    df_tmp3_1_sort.forEach(function(element, index){
      let nextElement = df_tmp3_1_sort[index+1];
      if(nextElement){
        element['edgeID1'] = element.eventLevel1Id + '-' + nextElement.eventLevel1Id;
        element['edgeID2'] = element.eventLevel2Id + '-' + nextElement.eventLevel2Id;
        element['edgeID3'] = element.eventLevel3Id + '-' + nextElement.eventLevel3Id;
      }
      else {
        element['edgeID1'] = "-";
        element['edgeID2'] = "-";
        element['edgeID3'] = "-";
      }
    })
  });
  // Create DF and Sort again
  columns = [];
  for(let key in df_tmp3[0]){
    columns.push(key);
  }
  df = new DataFrame(df_tmp3, columns);
  df.sortBy(sortParameter);
  console.log("%c    add start and end event...", "color: grey");
  console.log("%c    add edgeID", "color: grey");
  eventLogCSVName = eventLogCSVName + mpmFileSuffix;
}
else{
  //skip
}

// =====================
//   SAVE PROCESSLOG
// =====================
console.log("%c conversion done", "color: green");
df.toCSV(true, __dirname + '/data/' + eventLogCSVName);
console.log("%c CSV saved successfully to /data/" + eventLogCSVName, "color:#00ff00");

let z = "debugger not end"