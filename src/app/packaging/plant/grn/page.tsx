'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayoutUnified as DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { maroonGoodsReceipt } from '@/constants/maroonPlant';
import { useUser } from '@/contexts/userContext';

export default function MaroonGrnPage() {
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
        <DashboardLayout description="Goods receipt">
            <div className="flex justify-center">
                <Card className="p-6 space-y-4 max-w-xl">
                    <h1 className="text-2xl font-bold">Goods receipt</h1>
                    <p className="text-sm text-gray-600">Canned - nothing is saved.</p>
                    <dl className="grid grid-cols-2 gap-3 text-sm">
                        <dt className="text-gray-500">Supplier</dt>
                        <dd>{maroonGoodsReceipt.supplierName}</dd>
                        <dt className="text-gray-500">Supplier Lot</dt>
                        <dd>{maroonGoodsReceipt.supplierLot}</dd>
                        <dt className="text-gray-500">Invoice</dt>
                        <dd>{maroonGoodsReceipt.invoiceNumber}</dd>
                        <dt className="text-gray-500">Item</dt>
                        <dd>{maroonGoodsReceipt.itemName}</dd>
                        <dt className="text-gray-500">Quantity</dt>
                        <dd>{maroonGoodsReceipt.quantityKg} kg</dd>
                        <dt className="text-gray-500">QA</dt>
                        <dd>{maroonGoodsReceipt.qaStatus}</dd>
                    </dl>
                    <p className="text-sm">
                        Internal batch <strong>YNG-RAW-8891</strong> · QR label
                    </p>
                    <Button onClick={() => router.push('/packaging/plant/production')}>
                        QA released - start production
                    </Button>
                </Card>
            </div>
        </DashboardLayout>
    );
}