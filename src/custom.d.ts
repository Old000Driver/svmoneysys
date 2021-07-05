type RootState = {
  recordList: RecordItem[],
  tagList: Tag[],
  currentTag?: Tag,
  createRecordError: Error | null,
  createTagError: Error | null,
}
type RecordItem = {  // ts声明类型
  tags: Tag[]
  notes: string
  type: string
  amount: number
  createdAt?: string
}
type Tag = {
  id: string;
  name: string;
}
type TagListModel = { // 定义类型 (<输入类型>), => <输出类型>
  data: Tag[]
  fetch: () => Tag[]
  create: (name: string) => 'success' | 'duplicated' // 联合类型 successes 表示成功 duplicated 表示重复
  update: (id: string, name: string) => 'success' | 'duplicated' | 'not found'
  remove: (id: string) => boolean
  save: () => void
}

interface Window {

}

