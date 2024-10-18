import fs from 'fs'

export const readJsonFile = (path: string) => {
  const json = fs.readFileSync(path)
  return JSON.parse(json.toString())
}
