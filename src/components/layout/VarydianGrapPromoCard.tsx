'use client';

import { ArrowRight, FileSpreadsheet } from 'lucide-react';
import { FinanceAppLink } from '@/components/layout/FinanceAppLink';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { isFinanceAppConfigured } from '@/lib/financeAppUrl';

export function VarydianGrapPromoCard() {
  if (!isFinanceAppConfigured()) {
    return null;
  }

  return (
    <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <FileSpreadsheet className="h-8 w-8 text-blue-600" aria-hidden />
          <div>
            <CardTitle>Month-end GRAP reporting</CardTitle>
            <CardDescription>
              Generate GRAP statements, period locks, audit packs, and asset registers in
              Varydian — separate from Maroon traceability.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <FinanceAppLink
          path="/login"
          className="inline-flex items-center justify-center rounded-md bg-blue-600 hover:bg-blue-700 text-white h-10 px-4 py-2 text-sm font-medium transition-colors"
          title="Separate secure app; use your Varydian account."
        >
          Open Varydian financial reporting
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
        </FinanceAppLink>
      </CardContent>
    </Card>
  );
}
