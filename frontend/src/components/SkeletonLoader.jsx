import React from 'react'

/**
 * Animated Pulse Skeleton Card for Doctor lists
 */
export const DoctorCardSkeleton = () => {
  return (
    <div className="border border-slate-100 rounded-xl overflow-hidden animate-pulse bg-white">
      <div className="bg-slate-200 h-48 w-full"></div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-slate-200 rounded-full"></div>
          <div className="h-3 bg-slate-200 rounded w-16"></div>
        </div>
        <div className="h-5 bg-slate-200 rounded w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
      </div>
    </div>
  )
}

/**
 * Animated Pulse Skeleton Row for Appointments lists
 */
export const AppointmentRowSkeleton = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border-b border-slate-100 animate-pulse bg-white rounded-xl">
      <div className="bg-slate-200 w-full sm:w-32 h-32 rounded-xl"></div>
      <div className="flex-1 space-y-3 py-1">
        <div className="h-5 bg-slate-200 rounded w-1/3"></div>
        <div className="h-4 bg-slate-200 rounded w-1/4"></div>
        <div className="space-y-2 mt-2">
          <div className="h-3.5 bg-slate-200 rounded w-1/2"></div>
          <div className="h-3.5 bg-slate-200 rounded w-1/3"></div>
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-end items-end w-full sm:w-auto">
        <div className="h-8 bg-slate-200 rounded-lg w-28"></div>
        <div className="h-8 bg-slate-200 rounded-lg w-28"></div>
      </div>
    </div>
  )
}

const SkeletonLoader = {
  DoctorCardSkeleton,
  AppointmentRowSkeleton
}

export default SkeletonLoader
