export interface ErrorItem {
  code: number
  name: string
}

export const TypeErrorMap: {
  [K in 'UNKNOWN' | 'EMAIL_ALREADY_EXISTS' | 'INTERNAL_ERROR' | 'BAD_REQUEST']: ErrorItem
} = {
  UNKNOWN: { code: 100, name: 'UNKNOWN' },
  EMAIL_ALREADY_EXISTS: { code: 101, name: 'EMAIL_ALREADY_EXISTS' },
  INTERNAL_ERROR: { code: 102, name: 'INTERNAL_ERROR' },
  BAD_REQUEST: { code: 400, name: 'BAD_REQUEST' },
}

export type TypeErrorName = keyof typeof TypeErrorMap
export type TypeErrorItem = (typeof TypeErrorMap)[TypeErrorName]
