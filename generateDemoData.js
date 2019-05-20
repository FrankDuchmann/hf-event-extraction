// =====================
//     REQUIREMENTS
// =====================
let request = require('request');
let colors = require('colors');


// =====================
//      CONFIG
// =====================
let createErrors = true;


// =====================
//      DATA SETS
// =====================

let orders = [{
  "$class": "org.acme.vehicle_network.PlaceOrder",
  "orderId": "o1",
  "vehicleDetails": {
    "$class": "org.acme.vehicle_network.VehicleDetails",
    "make": "resource:org.acme.vehicle_network.Manufacturer#Morde",
    "modelType": "Cannon",
    "colour": "Blue"
  },
  "options": {
    "$class": "org.acme.vehicle_network.Options",
    "trim": "",
    "interior": "",
    "extras": []
  },
  "orderer": "resource:org.acme.vehicle_network.Person#Andy"
},
{
  "$class": "org.acme.vehicle_network.PlaceOrder",
  "orderId": "o2",
  "vehicleDetails": {
    "$class": "org.acme.vehicle_network.VehicleDetails",
    "make": "resource:org.acme.vehicle_network.Manufacturer#Arium",
    "modelType": "Cannon",
    "colour": "Silver"
  },
  "options": {
    "$class": "org.acme.vehicle_network.Options",
    "trim": "",
    "interior": "",
    "extras": []
  },
  "orderer": "resource:org.acme.vehicle_network.Person#Hanna"
},
{
  "$class": "org.acme.vehicle_network.PlaceOrder",
  "orderId": "o3",
  "vehicleDetails": {
    "$class": "org.acme.vehicle_network.VehicleDetails",
    "make": "resource:org.acme.vehicle_network.Manufacturer#Morde",
    "modelType": "Rancher",
    "colour": "Green"
  },
  "options": {
    "$class": "org.acme.vehicle_network.Options",
    "trim": "",
    "interior": "",
    "extras": []
  },
  "orderer": "resource:org.acme.vehicle_network.Person#Matt"
},
{
  "$class": "org.acme.vehicle_network.PlaceOrder",
  "orderId": "o4",
  "vehicleDetails": {
    "$class": "org.acme.vehicle_network.VehicleDetails",
    "make": "resource:org.acme.vehicle_network.Manufacturer#Ridge",
    "modelType": "Mustang",
    "colour": "Black"
  },
  "options": {
    "$class": "org.acme.vehicle_network.Options",
    "trim": "",
    "interior": "",
    "extras": []
  },
  "orderer": "resource:org.acme.vehicle_network.Person#James"
},
{
  "$class": "org.acme.vehicle_network.PlaceOrder",
  "orderId": "o5",
  "vehicleDetails": {
    "$class": "org.acme.vehicle_network.VehicleDetails",
    "make": "resource:org.acme.vehicle_network.Manufacturer#Morde",
    "modelType": "Rencher",
    "colour": "Silver"
  },
  "options": {
    "$class": "org.acme.vehicle_network.Options",
    "trim": "",
    "interior": "",
    "extras": []
  },
  "orderer": "resource:org.acme.vehicle_network.Person#Kai"
},
{
  "$class": "org.acme.vehicle_network.PlaceOrder",
  "orderId": "o6",
  "vehicleDetails": {
    "$class": "org.acme.vehicle_network.VehicleDetails",
    "make": "resource:org.acme.vehicle_network.Manufacturer#Arium",
    "modelType": "Nebula",
    "colour": "Red"
  },
  "options": {
    "$class": "org.acme.vehicle_network.Options",
    "trim": "",
    "interior": "",
    "extras": []
  },
  "orderer": "resource:org.acme.vehicle_network.Person#Mark"
},
{
  "$class": "org.acme.vehicle_network.PlaceOrder",
  "orderId": "o7",
  "vehicleDetails": {
    "$class": "org.acme.vehicle_network.VehicleDetails",
    "make": "resource:org.acme.vehicle_network.Manufacturer#Arium",
    "modelType": "Rencher",
    "colour": "Blue"
  },
  "options": {
    "$class": "org.acme.vehicle_network.Options",
    "trim": "",
    "interior": "",
    "extras": []
  },
  "orderer": "resource:org.acme.vehicle_network.Person#Rob"
},
{
  "$class": "org.acme.vehicle_network.PlaceOrder",
  "orderId": "o8",
  "vehicleDetails": {
    "$class": "org.acme.vehicle_network.VehicleDetails",
    "make": "resource:org.acme.vehicle_network.Manufacturer#Ridge",
    "modelType": "Chester",
    "colour": "Black"
  },
  "options": {
    "$class": "org.acme.vehicle_network.Options",
    "trim": "",
    "interior": "",
    "extras": []
  },
  "orderer": "resource:org.acme.vehicle_network.Person#Hanna"
},
{
  "$class": "org.acme.vehicle_network.PlaceOrder",
  "orderId": "o9",
  "vehicleDetails": {
    "$class": "org.acme.vehicle_network.VehicleDetails",
    "make": "resource:org.acme.vehicle_network.Manufacturer#Morde",
    "modelType": "Cannon",
    "colour": "White"
  },
  "options": {
    "$class": "org.acme.vehicle_network.Options",
    "trim": "",
    "interior": "",
    "extras": []
  },
  "orderer": "resource:org.acme.vehicle_network.Person#Hanna"
},
{
  "$class": "org.acme.vehicle_network.PlaceOrder",
  "orderId": "o10",
  "vehicleDetails": {
    "$class": "org.acme.vehicle_network.VehicleDetails",
    "make": "resource:org.acme.vehicle_network.Manufacturer#Ridge",
    "modelType": "Nebula",
    "colour": "Blue"
  },
  "options": {
    "$class": "org.acme.vehicle_network.Options",
    "trim": "",
    "interior": "",
    "extras": []
  },
  "orderer": "resource:org.acme.vehicle_network.Person#Paul"
},
{
  "$class": "org.acme.vehicle_network.PlaceOrder",
  "orderId": "o11",
  "vehicleDetails": {
    "$class": "org.acme.vehicle_network.VehicleDetails",
    "make": "resource:org.acme.vehicle_network.Manufacturer#Arium",
    "modelType": "Putt",
    "colour": "Red"
  },
  "options": {
    "$class": "org.acme.vehicle_network.Options",
    "trim": "",
    "interior": "",
    "extras": []
  },
  "orderer": "resource:org.acme.vehicle_network.Person#Caroline"
},

]

let updateOrderStatus_scheduled = [
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "SCHEDULED_FOR_MANUFACTURE",
    "order": "resource:org.acme.vehicle_network.Order#o1"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "SCHEDULED_FOR_MANUFACTURE",
    "order": "resource:org.acme.vehicle_network.Order#o2"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "SCHEDULED_FOR_MANUFACTURE",
    "order": "resource:org.acme.vehicle_network.Order#o3"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "SCHEDULED_FOR_MANUFACTURE",
    "order": "resource:org.acme.vehicle_network.Order#o4"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "SCHEDULED_FOR_MANUFACTURE",
    "order": "resource:org.acme.vehicle_network.Order#o5"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "SCHEDULED_FOR_MANUFACTURE",
    "order": "resource:org.acme.vehicle_network.Order#o6"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "SCHEDULED_FOR_MANUFACTURE",
    "order": "resource:org.acme.vehicle_network.Order#o7"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "SCHEDULED_FOR_MANUFACTURE",
    "order": "resource:org.acme.vehicle_network.Order#o8"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "SCHEDULED_FOR_MANUFACTURE",
    "order": "resource:org.acme.vehicle_network.Order#o9"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "SCHEDULED_FOR_MANUFACTURE",
    "order": "resource:org.acme.vehicle_network.Order#o10"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "SCHEDULED_FOR_MANUFACTURE",
    "order": "resource:org.acme.vehicle_network.Order#o11"
  }
];
let updateOrderStatus_scheduled_with_error = [
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "SCHEDULED_FOR_MANUFACTURE",
    "order": "resource:org.acme.vehicle_network.Order#o1"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "SCHEDULED_FOR_MANUFACTURE",
    "order": "resource:org.acme.vehicle_network.Order#o3"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "SCHEDULED_FOR_MANUFACTURE",
    "order": "resource:org.acme.vehicle_network.Order#o5"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "SCHEDULED_FOR_MANUFACTURE",
    "order": "resource:org.acme.vehicle_network.Order#o6"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "SCHEDULED_FOR_MANUFACTURE",
    "order": "resource:org.acme.vehicle_network.Order#o7"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "SCHEDULED_FOR_MANUFACTURE",
    "order": "resource:org.acme.vehicle_network.Order#o8"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "SCHEDULED_FOR_MANUFACTURE",
    "order": "resource:org.acme.vehicle_network.Order#o9"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "SCHEDULED_FOR_MANUFACTURE",
    "order": "resource:org.acme.vehicle_network.Order#o10"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "SCHEDULED_FOR_MANUFACTURE",
    "order": "resource:org.acme.vehicle_network.Order#o11"
  }
];

let updateOrderStatus_vin_assigned = [
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "VIN_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o1",
    "vin": "vin_1"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "VIN_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o2",
    "vin": "vin_2"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "VIN_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o3",
    "vin": "vin_3"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "VIN_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o4",
    "vin": "vin_4"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "VIN_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o5",
    "vin": "vin_5"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "VIN_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o6",
    "vin": "vin_6"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "VIN_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o7",
    "vin": "vin_7"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "VIN_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o8",
    "vin": "vin_8"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "VIN_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o9",
    "vin": "vin_9"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "VIN_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o10",
    "vin": "vin_10"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "VIN_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o11",
    "vin": "vin_11"
  }
];
let updateOrderStatus_vin_assigned_with_error = [
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "VIN_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o1",
    "vin": "vin_1"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "VIN_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o2",
    "vin": "vin_2"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "VIN_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o3",
    "vin": "vin_3"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "VIN_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o4",
    "vin": "vin_4"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "VIN_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o5",
    "vin": "vin_5"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "VIN_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o6",
    "vin": "vin_6"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "VIN_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o7",
    "vin": "vin_7"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "VIN_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o8",
    "vin": "vin_8"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "VIN_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o9",
    "vin": "vin_9"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o11",
    "vin": "vin_11"
  }
]

let updateOrderStatus_owner_assigned = [
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o1",
    "vin": 'vin_1'
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o2",
    "vin": 'vin_2'
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o3",
    "vin": 'vin_3'
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o4",
    "vin": 'vin_4'
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o5",
    "vin": 'vin_5'
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o1",
    "vin": 'vin_1'
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o6",
    "vin": 'vin_6'
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o7",
    "vin": 'vin_7'
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o8",
    "vin": 'vin_8'
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o9",
    "vin": 'vin_9'
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o10",
    "vin": 'vin_10'
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o11",
    "vin": 'vin_11'
  }
];
let updateOrderStatus_owner_assigned_with_error = [
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o1",
    "vin": 'vin_1'
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o2",
    "vin": 'vin_2'
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o3",
    "vin": 'vin_3'
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o4",
    "vin": 'vin_4'
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o5",
    "vin": 'vin_5'
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o1",
    "vin": 'vin_1'
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o6",
    "vin": 'vin_6'
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o7",
    "vin": 'vin_7'
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o8",
    "vin": 'vin_8'
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "OWNER_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o9",
    "vin": 'vin_9'
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "VIN_ASSIGNED",
    "order": "resource:org.acme.vehicle_network.Order#o11",
    "vin": 'vin_11'
  }
]

let UpdateOrderStatus_deliverd = [
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o1"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o2"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o3"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o4"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o5"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o6"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o7"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o8"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o9"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o10"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o11"
  }
];
let UpdateOrderStatus_deliverd_with_error = [
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o1"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o2"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o3"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o4"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o5"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o6"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o7"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o8"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o9"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o10"
  },
  {
    "$class": "org.acme.vehicle_network.UpdateOrderStatus",
    "orderStatus": "DELIVERED",
    "order": "resource:org.acme.vehicle_network.Order#o11"
  }
]

// =====================
//      FUNCTIONS
// =====================

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

async function sendRequests(items, url) {
  items.forEach(function (item) {
    request.post({
      url: url,
      body: item,
      json: true
    }, function (error, response, body) {
      console.log(body.orderStatus);
    });
  })
}

function testConnection() {
  return new Promise(function (resolve, reject) {
    let req = request('http://localhost:3000/api/org.acme.vehicle_network.PlaceOrder', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("Connection was successfull".green.bold);
        resolve(response.statusCode);
      }
      else {
        console.log("Error".red);
        reject(error);
      }
    });
  });
}


async function main() {
  let statusCode = await testConnection();

  if (statusCode == 200) {

    if (createErrors) {
      // Create Dataset with Errors
      console.log("sending orders...".blue);
      sendRequests(orders, 'http://localhost:3000/api/org.acme.vehicle_network.PlaceOrder');
      await sleep(10000);
      console.log("done".green.bold);

      console.log("change status to scheduled...".blue);
      sendRequests(updateOrderStatus_scheduled_with_error, 'http://localhost:3000/api/org.acme.vehicle_network.UpdateOrderStatus');
      await sleep(10000);
      console.log("done".green.bold);

      console.log("change order status to vin assigned".blue);
      sendRequests(updateOrderStatus_vin_assigned_with_error, 'http://localhost:3000/api/org.acme.vehicle_network.UpdateOrderStatus');
      await sleep(10000);
      console.log("done".green.bold);

      console.log("change order status to owner assigned".blue);
      sendRequests(updateOrderStatus_owner_assigned_with_error, 'http://localhost:3000/api/org.acme.vehicle_network.UpdateOrderStatus');
      await sleep(10000);
      console.log("done".green.bold);

      console.log("change order status to delivered".blue);
      sendRequests(UpdateOrderStatus_deliverd_with_error, 'http://localhost:3000/api/org.acme.vehicle_network.UpdateOrderStatus');
      await sleep(10000);
      console.log("done".green.bold);

      console.log("Finished!".blue);
    }
    else {
      // Create Clean Dataset
      console.log("sending orders...".blue);
      sendRequests(orders, 'http://localhost:3000/api/org.acme.vehicle_network.PlaceOrder');
      await sleep(10000);
      console.log("done".green.bold);

      console.log("change status to scheduled...".blue);
      sendRequests(updateOrderStatus_scheduled, 'http://localhost:3000/api/org.acme.vehicle_network.UpdateOrderStatus');
      await sleep(10000);
      console.log("done".green.bold);

      console.log("change order status to vin assigned".blue);
      sendRequests(updateOrderStatus_vin_assigned, 'http://localhost:3000/api/org.acme.vehicle_network.UpdateOrderStatus');
      await sleep(10000);
      console.log("done".green.bold);

      console.log("change order status to owner assigned".blue);
      sendRequests(updateOrderStatus_owner_assigned, 'http://localhost:3000/api/org.acme.vehicle_network.UpdateOrderStatus');
      await sleep(10000);
      console.log("done".green.bold);

      console.log("change order status to delivered".blue);
      sendRequests(UpdateOrderStatus_deliverd, 'http://localhost:3000/api/org.acme.vehicle_network.UpdateOrderStatus');
      await sleep(10000);
      console.log("done".green.bold);

      console.log("Finished!".green.bold);
    }
  }
}


// =====================
//        START
// =====================

main();

let debuggerNotEnd = null;