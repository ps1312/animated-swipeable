import data from './data.json'

export interface Memory {
  id: number
  activity: string
  emotion: string
  reaction: string
  createdAt: Date
}

const validateModel = (json: any, index: number) => {
  if (
    typeof json.id !== 'number' ||
    typeof json.activity !== 'string' ||
    typeof json.emotion !== 'string' ||
    typeof json.reaction !== 'string' ||
    typeof json.createdAt !== 'string'
  ) {
    throw new Error(`Invalid JSON at index ${index}: ${JSON.stringify(json)}`)
  }

  const date = new Date(json.createdAt)

  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date at index ${index}: ${JSON.stringify(json)}`)
  }

  return { ...json, createdAt: date } as Memory
}

const getMemories = (): Memory[] => {
  try {
    return data.map(validateModel)
  } catch (e) {
    return []
  }
}

export default getMemories()
