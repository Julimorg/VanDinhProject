export const StatusDevice = {
  activated: "ACTIVATED",
  inventory: "INVENTORY",
}

export const RecordTypes = {
  Text : 0,
  DateTime : 1,
  Number:  2,
}

export const RecordTypesList = [
  { id: RecordTypes.Text, name: "Chữ" },
  { id: RecordTypes.Number, name: "Số" },
  { id: RecordTypes.DateTime, name: "Ngày" },
];

export const GateCommand = {
  UP_FIRMWARE : "UP_FIRMWARE",
  MANUAL_OPEN : "MANUAL_OPEN",
  AUTO : "AUTO",
  MANUAL_CLOSE : "MANUAL_CLOSE",
  RESTART : "RESTART",
  SYNC_CONFIG :"SYNC_CONFIG",
}
