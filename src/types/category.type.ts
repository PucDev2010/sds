export interface Category {
  id: number
  parentId: number | null
  name: string
  deleted: boolean
  image: string
}
