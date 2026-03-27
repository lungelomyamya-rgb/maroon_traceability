# MIGRATION MAP - components/ to src/features/

## 🎯 Migration Overview
This document maps every component folder to its target feature location in the new feature-based architecture.

## 📋 Migration Assignments

### ✅ **Already Completed**
- `components/inspector/thirdPartyVerification/` → `components/inspector/thirdPartyVerification/` (Already refactored in place)

### 🔄 **Ready for Migration**

#### **1. UI Components (Lowest Risk)**
- `components/ui/` → `src/features/shared/ui/`
  - **Reason**: Shared UI components used across all features
  - **Files**: 16 items including Button, Input, Card, etc.
  - **Risk**: LOW - No business logic, pure UI components

#### **2. Authentication**
- `components/auth/` → `src/features/auth/components/`
  - **Reason**: Authentication-specific components
  - **Files**: 4 items
  - **Risk**: LOW - Clear feature boundary

#### **3. Marketplace**
- `components/marketplace/` → `src/features/marketplace/components/`
  - **Reason**: Marketplace-specific components
  - **Files**: 11 items
  - **Risk**: MEDIUM - Some business logic

#### **4. Logistics**
- `components/logistics/` → `src/features/logistics/components/`
  - **Reason**: Logistics-specific components
  - **Files**: 36 items
  - **Risk**: MEDIUM - Complex business logic

#### **5. Packaging**
- `components/packaging/` → `src/features/packaging/components/`
  - **Reason**: Packaging-specific components
  - **Files**: 16 items
  - **Risk**: MEDIUM - Business logic present

#### **6. Retailers**
- `components/retailers/` → `src/features/retailers/components/`
  - **Reason**: Retailer-specific components
  - **Files**: 62 items (LARGEST)
  - **Risk**: HIGH - Most complex feature

#### **7. Inspector**
- `components/inspector/` (excluding thirdPartyVerification) → `src/features/inspector/components/`
  - **Reason**: Inspector-specific components
  - **Files**: 14 items (1 already refactored)
  - **Risk**: MEDIUM - Some business logic

### ⚠️ **Special Cases - Need Analysis**

#### **8. Farmer Components**
- `components/farmer/` → `src/features/farmer/components/`
  - **Status**: 🚨 **NEW FEATURE REQUIRED** - `src/features/farmer/` does not exist
  - **Files**: 16 items
  - **Action**: Create feature scaffold first

#### **9. Layout Components**
- `components/layout/` → `src/features/shared/layout/`
  - **Reason**: Shared layout components
  - **Files**: 3 items
  - **Risk**: LOW - Layout components

#### **10. Dashboard Components**
- `components/dashboard/` → `src/features/shared/dashboard/`
  - **Reason**: Shared dashboard components
  - **Files**: 3 items
  - **Risk**: LOW - Dashboard components

#### **11. Root Components**
- `components/index.tsx` → `src/features/index.ts` (Update barrel)
- `components/main-index.ts` → `src/features/shared/index.ts`

#### **12. Standalone Components**
- `components/clientOnly.tsx` → `src/features/shared/clientOnly.tsx`
- `components/errorBoundary.tsx` → `src/features/shared/errorBoundary.tsx`
- `components/roleSelector.tsx` → `src/features/shared/roleSelector.tsx`
- `components/productForm.tsx` → `src/features/shared/productForm.tsx`

#### **13. Other Components**
- `components/cards/` → `src/features/shared/cards/`
- `components/events/` → `src/features/shared/events/`
- `components/photos/` → `src/features/shared/photos/`
- `components/products/` → `src/features/shared/products/`
- `components/qr/` → `src/features/shared/qr/`
- `components/shared/` → `src/features/shared/shared/`

#### **14. Empty Folders (Delete)**
- `components/forms/` → DELETE (empty)
- `components/productForm/` → DELETE (empty)
- `components/performance/` → DELETE (empty)
- `components/retailer/` → DELETE (empty)
- `components/roleSelectorModular/` → DELETE (empty)
- `components/saps/` → DELETE (empty)
- `components/service-worker-registration.tsx` → DELETE (legacy)

## 🚨 **Missing Feature Scaffolds Required**

### **Need Creation Before Migration:**
1. `src/features/farmer/` - For farmer components (16 items)
2. `src/features/inspector/` - For inspector components (14 items)
3. `src/features/retailers/` - For retailer components (62 items)

### **Scaffold Structure:**
```
src/features/[feature]/
├── components/
├── hooks/
├── services/
├── types/
└── index.ts
```

## 📊 **Migration Statistics**

| Category | Folders | Files | Risk Level |
|----------|---------|-------|-----------|
| **Already Done** | 1 | 6 | ✅ Complete |
| **Low Risk** | 4 | ~25 | 🟢 Safe |
| **Medium Risk** | 4 | ~77 | 🟡 Moderate |
| **High Risk** | 1 | 62 | 🔴 Complex |
| **Special Cases** | 13 | ~50 | ⚠️ Analysis |
| **Empty/Delete** | 7 | 0 | 🗑️ Cleanup |

**Total**: 30 folders, ~220+ files

## 🎯 **Migration Priority Order**

1. **shared/ui** (Lowest risk, no dependencies)
2. **auth** (Low risk, clear boundaries)
3. **marketplace** (Medium risk, existing feature)
4. **logistics** (Medium risk, existing feature)
5. **packaging** (Medium risk, existing feature)
6. **retailers** (High risk, needs scaffold)
7. **inspector** (Medium risk, needs scaffold)
8. **farmer** (Medium risk, needs scaffold)
9. **shared/** components (Special cases)
10. **Cleanup** empty folders

## 🔧 **Pre-Migration Requirements**

### **Before Starting:**
1. ✅ Create missing feature scaffolds
2. ✅ Verify current build is green
3. ✅ Create backup commit
4. ✅ Update barrel exports in target features

### **During Migration:**
1. ✅ Copy first, verify build green
2. ✅ Fix internal imports
3. ✅ Update barrel exports
4. ✅ Verify no broken imports

### **After Migration:**
1. ✅ Update all consumer imports
2. ✅ Run full build verification
3. ✅ Delete legacy components/
4. ✅ Final build verification

---

**Status**: 📋 Ready for migration execution
**Next Step**: Create missing feature scaffolds
