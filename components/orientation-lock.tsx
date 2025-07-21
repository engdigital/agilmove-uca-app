"use client"

import React from 'react'
import { useOrientationLock } from '@/hooks/use-orientation-lock'

interface OrientationLockProps {
  children: React.ReactNode
}

/**
 * Componente que aplica bloqueio de orientação portrait
 */
export function OrientationLock({ children }: OrientationLockProps) {
  useOrientationLock()
  
  return <>{children}</>
}
