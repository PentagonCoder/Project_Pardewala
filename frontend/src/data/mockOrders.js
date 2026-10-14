// Mock orders and scale fulfillment data for Pardewala
export const INITIAL_ORDERS = [
  {
    id: "ORD-9418",
    orderNumber: "PDW-2026-9418",
    date: "2026-10-12",
    customer: {
      name: "Rahul Verma",
      email: "rahul.verma@example.com",
      phone: "+91 98765 43210",
      address: "Flat 402, Greenfield Apts, Indiranagar, Bengaluru, KA - 560038"
    },
    status: "dispatched",
    statusLabel: "Scale Audited & Dispatched",
    estimatedWeightG: 1250.0,
    actualWeightG: 1258.0,
    weightVarianceG: 8.0,
    weightVariancePercent: 0.64,
    scaleId: "SCALE-BLR-04",
    operatorName: "Vikram K. (Certified Weigher)",
    calibratedDate: "2026-10-14 08:00 AM",
    totalPrice: 104.50,
    retailComparisonPrice: 165.00,
    savingsPrice: 60.50,
    trackingNumber: "TRK-PDW-7839210",
    items: [
      {
        productId: "prod-phys-01",
        name: "Classmate Classic Physics Practical Notebook",
        subject: "Physics",
        gsm: 70,
        rulingType: "Single Line (Interleaf)",
        quantity: 2,
        weightPerNotebookG: 333.33,
        totalWeightG: 666.66,
        piecePrice: 26.67,
        totalPrice: 53.33
      },
      {
        productId: "prod-chem-02",
        name: "Classmate Chemistry Lab Record",
        subject: "Chemistry",
        gsm: 75,
        rulingType: "Single Line (Interleaf)",
        quantity: 1,
        weightPerNotebookG: 333.33,
        totalWeightG: 333.33,
        piecePrice: 28.33,
        totalPrice: 28.33
      },
      {
        productId: "prod-graph-05",
        name: "Delta 70 GSM Precision 1mm Graph Notebook",
        subject: "Graph & Engineering",
        gsm: 70,
        rulingType: "10mm & 1mm Dual Coordinate Grid",
        quantity: 1,
        weightPerNotebookG: 250.0,
        totalWeightG: 250.0,
        piecePrice: 23.75,
        totalPrice: 23.75
      }
    ]
  },
  {
    id: "ORD-8924",
    orderNumber: "PDW-2026-8924",
    date: "2026-10-09",
    customer: {
      name: "Ananya Sen",
      email: "ananya.sen@example.com",
      phone: "+91 98451 22334",
      address: "Room 204, Ganga Girls Hostel, Delhi University North Campus, New Delhi - 110007"
    },
    status: "delivered",
    statusLabel: "Delivered & Scale Certified",
    estimatedWeightG: 2200.0,
    actualWeightG: 2215.0,
    weightVarianceG: 15.0,
    weightVariancePercent: 0.68,
    scaleId: "SCALE-DEL-02",
    operatorName: "Amit Sharma (Scale Lead)",
    calibratedDate: "2026-10-09 07:30 AM",
    totalPrice: 178.00,
    retailComparisonPrice: 280.00,
    savingsPrice: 102.00,
    trackingNumber: "TRK-PDW-5519402",
    items: [
      {
        productId: "prod-math-04",
        name: "Sundaram Deluxe Mathematics Register",
        subject: "Mathematics",
        gsm: 70,
        rulingType: "Single Line Long Register",
        quantity: 2,
        weightPerNotebookG: 600.0,
        totalWeightG: 1200.0,
        piecePrice: 45.00,
        totalPrice: 90.00
      },
      {
        productId: "prod-rough-08",
        name: "Camlin Eco Soft Kraft Rough Notebook",
        subject: "Rough & Notes",
        gsm: 60,
        rulingType: "Single Line Recycled Kraft",
        quantity: 2,
        weightPerNotebookG: 500.0,
        totalWeightG: 1000.0,
        piecePrice: 30.00,
        totalPrice: 60.00
      },
      {
        productId: "prod-chem-02",
        name: "Classmate Chemistry Lab Record",
        subject: "Chemistry",
        gsm: 75,
        rulingType: "Single Line (Interleaf)",
        quantity: 1,
        weightPerNotebookG: 333.33,
        totalWeightG: 333.33,
        piecePrice: 28.00,
        totalPrice: 28.00
      }
    ]
  },
  {
    id: "ORD-9931",
    orderNumber: "PDW-2026-9931",
    date: "2026-10-14",
    customer: {
      name: "Pooja Hegde",
      email: "pooja.hegde@example.com",
      phone: "+91 97401 88992",
      address: "House 18, 3rd Cross, Malleshwaram, Bengaluru - 560003"
    },
    status: "pending_weighing",
    statusLabel: "Packed • Awaiting Scale Weighing",
    estimatedWeightG: 1666.66,
    actualWeightG: null,
    weightVarianceG: null,
    weightVariancePercent: null,
    scaleId: null,
    operatorName: null,
    calibratedDate: null,
    totalPrice: 141.67,
    retailComparisonPrice: 225.00,
    savingsPrice: 83.33,
    trackingNumber: "TRK-PDW-9931001",
    items: [
      {
        productId: "prod-bio-03",
        name: "Navneet Botanical & Zoology Lab Record",
        subject: "Biology",
        gsm: 80,
        rulingType: "Ruled + Blank Drawing Cartridge",
        quantity: 2,
        weightPerNotebookG: 400.0,
        totalWeightG: 800.0,
        piecePrice: 36.00,
        totalPrice: 72.00
      },
      {
        productId: "prod-phys-01",
        name: "Classmate Classic Physics Practical Notebook",
        subject: "Physics",
        gsm: 70,
        rulingType: "Single Line (Interleaf)",
        quantity: 2,
        weightPerNotebookG: 333.33,
        totalWeightG: 666.66,
        piecePrice: 26.67,
        totalPrice: 53.33
      },
      {
        productId: "prod-graph-05",
        name: "Delta 70 GSM Precision 1mm Graph Notebook",
        subject: "Graph & Engineering",
        gsm: 70,
        rulingType: "10mm & 1mm Dual Coordinate Grid",
        quantity: 1,
        weightPerNotebookG: 250.0,
        totalWeightG: 250.0,
        piecePrice: 23.75,
        totalPrice: 23.75
      }
    ]
  }
];

export const SAVED_PRESETS = [
  {
    id: "preset-sci-12",
    name: "Class 12 CBSE Science Term Bundle",
    description: "Physics Practical + Chemistry Record + Biology Cartridge + Precision Graph Notebook",
    estimatedWeightKg: "1.42 KG",
    estimatedWeightG: 1416.66,
    estimatedPrice: 115.42,
    retailPrice: 190.00,
    itemsCount: 4,
    items: [
      { productId: "prod-phys-01", quantity: 1 },
      { productId: "prod-chem-02", quantity: 1 },
      { productId: "prod-bio-03", quantity: 1 },
      { productId: "prod-graph-05", quantity: 1 }
    ]
  },
  {
    id: "preset-eng-prep",
    name: "Engineering & Calculus Heavy Semester Pack",
    description: "2 Long Mathematics Registers + 2 Technical Drawing Cartridge Notebooks",
    estimatedWeightKg: "2.20 KG",
    estimatedWeightG: 2200.0,
    estimatedPrice: 200.00,
    retailPrice: 320.00,
    itemsCount: 4,
    items: [
      { productId: "prod-math-04", quantity: 2 },
      { productId: "prod-eng-06", quantity: 2 }
    ]
  }
];

export const INVENTORY_PAPER_ROLLS = [
  { gsm: 60, type: "Recycled Soft Kraft", stockWeightKg: 850, alertThresholdKg: 200 },
  { gsm: 70, type: "Chlorine-Free Single Line", stockWeightKg: 1420, alertThresholdKg: 300 },
  { gsm: 75, type: "Acid-Free Interleaf Cartridge", stockWeightKg: 680, alertThresholdKg: 150 },
  { gsm: 80, type: "Heavy Botanical Opaque Drawing", stockWeightKg: 520, alertThresholdKg: 150 },
  { gsm: 90, type: "Engineering Architectural Sheet", stockWeightKg: 390, alertThresholdKg: 100 }
];
