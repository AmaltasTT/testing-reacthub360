"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const FunnelSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
    <Skeleton className="h-3 w-32 mb-4" />
    <div className="flex flex-col sm:flex-row gap-0">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex-1 text-center px-2.5 py-3.5 border border-gray-200 first:rounded-l-xl last:rounded-r-xl">
          <Skeleton className="h-2 w-12 mx-auto mb-2" />
          <Skeleton className="h-6 w-16 mx-auto mb-1" />
          <Skeleton className="h-2 w-24 mx-auto mb-1" />
          <Skeleton className="h-2 w-10 mx-auto" />
        </div>
      ))}
    </div>
  </div>
);

export const PhaseSectionSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
    {/* Ribbon */}
    <Skeleton className="h-10 w-full rounded-lg mb-4" />
    {/* Metric cards row */}
    <div className="flex gap-3 mb-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-16 flex-1 rounded-lg" />
      ))}
    </div>
    {/* Insight panel */}
    <Skeleton className="h-16 w-full rounded-lg mb-4" />
    {/* Chart placeholder */}
    <Skeleton className="h-64 w-full rounded-lg" />
  </div>
);

export const TableSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
    <Skeleton className="h-4 w-40 mb-4" />
    <div className="space-y-3">
      {/* Header row */}
      <div className="flex gap-4 pb-2 border-b border-gray-100">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: 4 }).map((_, row) => (
        <div key={row} className="flex gap-4">
          {Array.from({ length: 6 }).map((_, col) => (
            <Skeleton key={col} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const BudgetPacingSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
    <Skeleton className="h-3 w-32 mb-4" />
    {/* Pacing cards */}
    <div className="grid grid-cols-3 gap-3 mb-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-3 border border-gray-200 rounded-xl">
          <Skeleton className="h-2 w-16 mb-2" />
          <Skeleton className="h-6 w-20 mb-1" />
          <Skeleton className="h-2 w-24" />
        </div>
      ))}
    </div>
    {/* Chart */}
    <Skeleton className="h-48 w-full rounded-lg" />
  </div>
);

export const CrossCampaignSkeleton = () => (
  <div className="bg-white border border-purple-100 rounded-2xl p-4 px-6 mb-5">
    <Skeleton className="h-3 w-64 mb-4" />
    <div className="grid grid-cols-4 gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-3 border border-gray-200 rounded-xl">
          <Skeleton className="h-2 w-12 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-2 w-full" />
        </div>
      ))}
    </div>
  </div>
);

export const RecommendationsSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm border border-gray-100">
    <Skeleton className="h-4 w-40 mb-4" />
    <div className="grid grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-16 mb-2" />
          {Array.from({ length: 2 }).map((_, j) => (
            <Skeleton key={j} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ))}
    </div>
  </div>
);
