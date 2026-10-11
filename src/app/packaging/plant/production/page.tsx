'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/dashboard';
import { Button, Card } from '@/components/ui';
import { maroonFinishedBatch, maroonGoodsReceipt } from '@/constants/maroonPlant';
import { useUser } from '@/contexts/userContext';

export default function MaroonProductionPage() {
    const { currentUser } = useUser();
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentUser?.role !== 'packaging') {
                router.push('/unauthorized');
            }
        }, 200);
        return () => clearTimeout(timer);
    }, [currentUser, router]);

    if (!currentUser || currentUser.role !== 'packaging') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-600">Checking authentication...</p>
            </div>
        );
    }

    return (
        <DashboardLayout description="Production">
            <div className="flex justify-center">
                <Card className="p-6 space-y-4 w-full max-w-xl">
                    <h1 className="text-2xl font-bold">Production</h1>
                    <p className="text-sm text-gray-600">Canned - nothing is saved yet.</p>
                    <dl className="grid grid-cols-2 gap-3 text-sm">
                        <dt className="text-gray-500">Issued raw lot</dt>
                        <dd>{maroonGoodsReceipt.supplierLot}</dd>
                        <dt className="text-gray-500">Issued qty</dt>
                        <dd>{maroonGoodsReceipt.quantityKg} kg</dd>
                        <dt className="text-gray-500">Waste</dt>
                        <dd>{maroonFinishedBatch.wasteKg} kg</dd>
                        <dt className="text-gray-500">Yield</dt>
                        <dd>{maroonFinishedBatch.yieldPercent}%</dd>
                        <dt className="text-gray-500">Finished batch</dt>
                        <dd>{maroonFinishedBatch.batchId}</dd>
                        <dt className="text-gray-500">Product</dt>
                        <dd>{maroonFinishedBatch.productName}</dd>
                        <dt className="text-gray-500">Units</dt>
                        <dd>{maroonFinishedBatch.units}</dd>
                        <dt className="text-gray-500">Unit cost</dt>
                        <dd>R{maroonFinishedBatch.unitCostRand.toFixed(2)}</dd>
                        <dt className="text-gray-500">Expiry</dt>
                        <dd>{maroonFinishedBatch.expiryDate}</dd>
                    </dl>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={() => router.push('/packaging/plant/grn')}>
                            Back to GRN
                        </Button>
                        <Button onClick={() => router.push('/packaging/plant/dispatch')}>
                            Batch locked - go to dispatch
                        </Button>
                    </div>
                </Card>
            </div>
        </DashboardLayout>
    );
}