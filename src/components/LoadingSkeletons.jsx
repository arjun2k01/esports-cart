// src/components/LoadingSkeletons.jsx

// Product Card Skeleton
export const ProductCardSkeleton = () => {
  return (
    <div className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700 animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full h-64 bg-neutral-700"></div>
      
      {/* Content Skeleton */}
      <div className="p-4">
        {/* Title */}
        <div className="h-6 bg-neutral-700 rounded mb-3 w-3/4"></div>
        
        {/* Price */}
        <div className="h-8 bg-neutral-700 rounded mb-3 w-1/2"></div>
        
        {/* Category Badge */}
        <div className="h-6 bg-neutral-700 rounded mb-4 w-1/3"></div>
        
        {/* Buttons */}
        <div className="flex gap-2">
          <div className="flex-1 h-12 bg-neutral-700 rounded"></div>
          <div className="w-12 h-12 bg-neutral-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

// Product Grid Skeleton
export const ProductGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Order Card Skeleton
export const OrderCardSkeleton = () => {
  return (
    <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 animate-pulse">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1 space-y-3">
          {/* Order number */}
          <div className="h-6 bg-neutral-700 rounded w-1/3"></div>
          
          {/* Items preview */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-lg bg-neutral-700"></div>
              <div className="w-10 h-10 rounded-lg bg-neutral-700"></div>
              <div className="w-10 h-10 rounded-lg bg-neutral-700"></div>
            </div>
            <div className="h-4 bg-neutral-700 rounded w-20"></div>
          </div>
          
          {/* Status */}
          <div className="h-8 bg-neutral-700 rounded w-24"></div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="space-y-2">
            <div className="h-4 bg-neutral-700 rounded w-20"></div>
            <div className="h-8 bg-neutral-700 rounded w-28"></div>
          </div>
          <div className="w-32 h-10 bg-neutral-700 rounded"></div>
        </div>
      </div>
    </div>
  );
};

// Order List Skeleton
export const OrderListSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <OrderCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Cart Item Skeleton
export const CartItemSkeleton = () => {
  return (
    <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 animate-pulse">
      <div className="flex gap-4">
        {/* Image */}
        <div className="w-24 h-24 bg-neutral-700 rounded-lg flex-shrink-0"></div>
        
        {/* Content */}
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-neutral-700 rounded w-3/4"></div>
          <div className="h-8 bg-neutral-700 rounded w-1/3"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neutral-700 rounded"></div>
            <div className="w-12 h-8 bg-neutral-700 rounded"></div>
            <div className="w-8 h-8 bg-neutral-700 rounded"></div>
          </div>
        </div>
        
        {/* Remove button */}
        <div className="w-24 h-10 bg-neutral-700 rounded"></div>
      </div>
    </div>
  );
};

// Profile Skeleton
export const ProfileSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sidebar Skeleton */}
      <div className="lg:col-span-1">
        <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 animate-pulse">
          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-neutral-700 rounded-full mb-4"></div>
            <div className="h-6 bg-neutral-700 rounded w-32 mb-2"></div>
            <div className="h-4 bg-neutral-700 rounded w-40"></div>
          </div>
          
          {/* Stats */}
          <div className="space-y-3 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-neutral-900/50 rounded-lg p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-neutral-700 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-700 rounded w-20"></div>
                  <div className="h-6 bg-neutral-700 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Buttons */}
          <div className="space-y-3">
            <div className="h-12 bg-neutral-700 rounded"></div>
            <div className="h-12 bg-neutral-700 rounded"></div>
          </div>
        </div>
      </div>
      
      {/* Form Skeleton */}
      <div className="lg:col-span-2">
        <div className="bg-neutral-800 rounded-lg p-6 border border-neutral-700 animate-pulse">
          <div className="h-8 bg-neutral-700 rounded w-48 mb-6"></div>
          
          <div className="space-y-6">
            {/* Section 1 */}
            <div className="space-y-4">
              <div className="h-6 bg-neutral-700 rounded w-40 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-12 bg-neutral-700 rounded"></div>
                <div className="h-12 bg-neutral-700 rounded"></div>
              </div>
            </div>
            
            {/* Section 2 */}
            <div className="space-y-4">
              <div className="h-6 bg-neutral-700 rounded w-40 mb-4"></div>
              <div className="h-12 bg-neutral-700 rounded"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-12 bg-neutral-700 rounded"></div>
                <div className="h-12 bg-neutral-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Page Loading Spinner
export const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white text-lg">{message}</p>
      </div>
    </div>
  );
};

// Button Loading State
export const ButtonLoader = () => {
  return (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
  );
};

// Text Skeleton
export const TextSkeleton = ({ lines = 3, className = "" }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-neutral-700 rounded animate-pulse"
          style={{ width: `${100 - (index * 10)}%` }}
        ></div>
      ))}
    </div>
  );
};

// Table Skeleton
export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="bg-neutral-800 rounded-lg overflow-hidden border border-neutral-700">
      {/* Header */}
      <div className="border-b border-neutral-700 p-4">
        <div className="grid gap-4 animate-pulse" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, index) => (
            <div key={index} className="h-6 bg-neutral-700 rounded"></div>
          ))}
        </div>
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="border-b border-neutral-700 last:border-0 p-4">
          <div className="grid gap-4 animate-pulse" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div key={colIndex} className="h-6 bg-neutral-700 rounded"></div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default {
  ProductCardSkeleton,
  ProductGridSkeleton,
  OrderCardSkeleton,
  OrderListSkeleton,
  CartItemSkeleton,
  ProfileSkeleton,
  PageLoader,
  ButtonLoader,
  TextSkeleton,
  TableSkeleton,
};
