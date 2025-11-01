/**
 * 작명 플로우 상태 관리 (Zustand)
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type NamingMethod = 'TRADITIONAL' | 'MODERN' | 'HYBRID'
export type Gender = 'MALE' | 'FEMALE' | 'NEUTRAL'

export interface BabyInfo {
  familyName: string
  gender: Gender | null
  birthDate: Date | null
  birthTime: string | null // HH:mm format
  isLunar: boolean
}

export interface Preferences {
  meaningKeywords: string[] // 원하는 의미
  preferredHanja: string[] // 선호하는 한자
  avoidChars: string[] // 피하고 싶은 글자
  nameLength: 2 | 3 | null // 글자 수
  specialRequests: string // 특별 요청
}

export interface NamingFlowState {
  // Current step
  currentStep: number

  // Form data
  babyInfo: BabyInfo
  method: NamingMethod | null
  preferences: Preferences

  // Request status
  requestId: string | null
  isProcessing: boolean
  error: string | null

  // Actions
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void

  setBabyInfo: (info: Partial<BabyInfo>) => void
  setMethod: (method: NamingMethod) => void
  setPreferences: (prefs: Partial<Preferences>) => void

  setRequestId: (id: string) => void
  setProcessing: (processing: boolean) => void
  setError: (error: string | null) => void

  reset: () => void
}

const initialBabyInfo: BabyInfo = {
  familyName: '',
  gender: null,
  birthDate: null,
  birthTime: null,
  isLunar: false,
}

const initialPreferences: Preferences = {
  meaningKeywords: [],
  preferredHanja: [],
  avoidChars: [],
  nameLength: null,
  specialRequests: '',
}

export const useNamingFlowStore = create<NamingFlowState>()(
  persist(
    (set) => ({
      // Initial state
      currentStep: 1,
      babyInfo: initialBabyInfo,
      method: null,
      preferences: initialPreferences,
      requestId: null,
      isProcessing: false,
      error: null,

      // Step navigation
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),
      prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

      // Form data updates
      setBabyInfo: (info) =>
        set((state) => ({
          babyInfo: { ...state.babyInfo, ...info },
        })),

      setMethod: (method) => set({ method }),

      setPreferences: (prefs) =>
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        })),

      // Request status
      setRequestId: (requestId) => set({ requestId }),
      setProcessing: (isProcessing) => set({ isProcessing }),
      setError: (error) => set({ error }),

      // Reset
      reset: () =>
        set({
          currentStep: 1,
          babyInfo: initialBabyInfo,
          method: null,
          preferences: initialPreferences,
          requestId: null,
          isProcessing: false,
          error: null,
        }),
    }),
    {
      name: 'naming-flow-storage', // LocalStorage key
      partialize: (state) => ({
        // Only persist form data, not request status
        currentStep: state.currentStep,
        babyInfo: state.babyInfo,
        method: state.method,
        preferences: state.preferences,
      }),
    }
  )
)
