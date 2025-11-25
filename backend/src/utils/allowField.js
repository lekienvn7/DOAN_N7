export const baseFields = [
  "materialID",
  "name",
  "type",
  "quantity",
  "status",
  "unit",
  "description",
  "maintenanceCycle",
];

export const electricFields = [
  "voltageRange",
  "power",
  "materialInsulation",
  "current",
  "frequency",
  "resistance",
  "phaseType",
  "conductorMaterial",
  "insulationMaterial",
  "fireResistance",
  "cableDiameter",
  "waterproofLevel",
  "operatingTemp",
];

export const chemicalFields = [
  "chemicalFormula",
  "concentration",
  "hazardLevel",
  "storageTemperature",
  "boilingPoint",
  "meltingPoint",
  "molarMass",
  "phLevel",
  "expiryDate",
  "flammability",
  "toxicity",
  "safetyNote",
  "casNumber",
];

export const mechanicalFields = [
  "metalType",
  "hardness",
  "tensileStrength",
  "weight",
  "coating",
  "thickness",
  "size",
  "tolerance",
  "loadCapacity",
  "heatResistance",
  "corrosionResistance",
];

export const iotFields = [
  "sensorType",
  "cpuClock",
  "communicationProtocol",
  "wirelessTech",
  "powerSupply",
  "ioPins",
  "memory",
  "operatingTemp",
  "interface",
  "moduleSize",
  "powerConsumption",
  "accuracy",
  "responseTime",
];

export const technologyFields = [
  "deviceType",
  "capacity",
  "speed",
  "brand",
  "connectorType",
  "powerConsumption",
  "protocol",
  "networkInterface",
  "warranty",
];

export const automotiveFields = [
  "partType",
  "vehicleModel",
  "manufacturer",
  "compatibility",
  "lifespan",
  "material",
  "heatResistance",
  "fluidSpec",
];

export const telecomFields = [
  "signalType",
  "frequency",
  "bandwidth",
  "connectorType",
  "cableType",
  "transmissionRate",
  "range",
  "impedance",
];

export const fashionFields = [
  "fabricType",
  "color",
  "colorType",
  "size",
  "pattern",
  "elasticity",
  "origin",
  "washInstruction",
  "durability",
  "breathability",
  "fabricThickness",
  "colorfastness",
  "wrinkleResistance",
  "SPM",
];

export const allowedMap = {
  electric: [...baseFields, ...electricFields],
  chemical: [...baseFields, ...chemicalFields],
  mechanical: [...baseFields, ...mechanicalFields],
  iot: [...baseFields, ...iotFields],
  technology: [...baseFields, ...technologyFields],
  automotive: [...baseFields, ...automotiveFields],
  telecom: [...baseFields, ...telecomFields],
  fashion: [...baseFields, ...fashionFields],
};

export const filterFields = (data, allowed) => {
  const clean = {};
  for (const key of Object.keys(data)) {
    if (allowed.includes(key)) clean[key] = data[key];
  }
  return clean;
};
