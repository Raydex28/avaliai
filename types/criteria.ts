export interface Criteria {
  name: string
  weight: number
  maxPoints?: number
}

export interface CriteriaTemplate {
  id: string
  name: string
  criteria: Criteria[]
  createdAt: string
}
