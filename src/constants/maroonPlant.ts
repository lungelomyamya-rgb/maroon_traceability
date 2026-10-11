export const MAROON_FINISHED_BATCH_ID = 'YNG-24001';

export const maroonGoodsReceipt = {
    supplierName: 'Lowveld Tomato Co-op',
    supplierLot: 'SUP-TOM-8891',
    invoiceNumber: 'INV-4418',
    itemName: 'Tomatoes (processing grade)',
    quantityKg: 420,
    receivedAt: '2026-09-18',
    qaStatus: 'Released' as const,
};

export const maroonFinishedBatch = {
    batchId: MAROON_FINISHED_BATCH_ID,
    productName: 'Tomato relish 340g',
    units: 1100,
    productionDate: '2026-09-19',
    expiryDate: '2027-03-19',
    unitCostRand: 18.4,
    sellPriceRand: 42,
    marginPercent: 56.2,
    wasteKg: 12,
    yieldPercent: 97.1,
};

export const maroonDispatch = {
    customerName: 'FreshMart Durban',
    invoiceLine: 'SO-7781-01',
    quantity: 240,
    dispatchedAt: '2026-09-20',
    pickRule: 'FEFO',
};