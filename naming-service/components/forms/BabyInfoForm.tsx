'use client'

/**
 * 아기 기본 정보 입력 폼
 */

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNamingFlowStore, type BabyInfo } from '@/lib/stores/naming-flow'
import { useState } from 'react'

// Zod 스키마
const babyInfoSchema = z.object({
  familyName: z
    .string()
    .min(1, '성씨를 입력해주세요')
    .max(2, '성씨는 최대 2글자입니다')
    .regex(/^[가-힣]+$/, '한글만 입력 가능합니다'),

  gender: z.enum(['MALE', 'FEMALE', 'NEUTRAL'], {
    required_error: '성별을 선택해주세요',
  }),

  birthDate: z.date({
    required_error: '생년월일을 선택해주세요',
  }),

  birthTime: z.string().nullable(),

  isLunar: z.boolean(),
})

type BabyInfoFormData = z.infer<typeof babyInfoSchema>

interface BabyInfoFormProps {
  onNext: () => void
}

export function BabyInfoForm({ onNext }: BabyInfoFormProps) {
  const { babyInfo, setBabyInfo } = useNamingFlowStore()
  const [birthDateInput, setBirthDateInput] = useState(
    babyInfo.birthDate ? babyInfo.birthDate.toISOString().split('T')[0] : ''
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BabyInfoFormData>({
    resolver: zodResolver(babyInfoSchema),
    defaultValues: {
      familyName: babyInfo.familyName,
      gender: babyInfo.gender || undefined,
      birthDate: babyInfo.birthDate || undefined,
      birthTime: babyInfo.birthTime,
      isLunar: babyInfo.isLunar,
    },
  })

  const onSubmit = (data: BabyInfoFormData) => {
    setBabyInfo(data)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6">아기 기본 정보</h2>

        {/* 성씨 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            성씨 <span className="text-red-500">*</span>
          </label>
          <input
            {...register('familyName')}
            type="text"
            placeholder="예: 김, 이, 박"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.familyName && (
            <p className="text-red-500 text-sm mt-1">{errors.familyName.message}</p>
          )}
        </div>

        {/* 성별 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            성별 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'MALE', label: '남자' },
              { value: 'FEMALE', label: '여자' },
              { value: 'NEUTRAL', label: '중성' },
            ].map((option) => (
              <label
                key={option.value}
                className={`
                  flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition
                  ${
                    watch('gender') === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                <input
                  {...register('gender')}
                  type="radio"
                  value={option.value}
                  className="sr-only"
                />
                <span className="font-medium">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.gender && (
            <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
          )}
        </div>

        {/* 양력/음력 선택 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">달력 종류</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: false, label: '양력' },
              { value: true, label: '음력' },
            ].map((option) => (
              <label
                key={option.label}
                className={`
                  flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition
                  ${
                    watch('isLunar') === option.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }
                `}
              >
                <input
                  {...register('isLunar')}
                  type="radio"
                  value={option.value.toString()}
                  onChange={() => setValue('isLunar', option.value)}
                  className="sr-only"
                />
                <span className="font-medium">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 생년월일 */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            생년월일 <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={birthDateInput}
            onChange={(e) => {
              setBirthDateInput(e.target.value)
              if (e.target.value) {
                setValue('birthDate', new Date(e.target.value))
              }
            }}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.birthDate && (
            <p className="text-red-500 text-sm mt-1">{errors.birthDate.message}</p>
          )}
        </div>

        {/* 출생 시간 (선택) */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            출생 시간 <span className="text-gray-400">(선택사항)</span>
          </label>
          <input
            {...register('birthTime')}
            type="time"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            사주팔자 분석을 위해 정확한 출생 시간을 입력하시면 더 좋습니다
          </p>
        </div>
      </Card>

      {/* 다음 버튼 */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" className="px-8">
          다음 단계
        </Button>
      </div>
    </form>
  )
}
