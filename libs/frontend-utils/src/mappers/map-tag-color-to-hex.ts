import { TagColor } from 'frontend-types'

export const mapTagColorToHex = (color: TagColor) => {
  switch (color) {
    case TagColor.White:
      return '#FFF'
    case TagColor.Black:
      return '#000'
    case TagColor.Grey:
      return '#111827'
    case TagColor.Brown:
      return '#78350f'
    case TagColor.Red:
      return '#dc2626'
    case TagColor.Orange:
      return '#ea580c'
    case TagColor.Yellow:
      return '#eab308'
    case TagColor.Green:
      return '#16a34a'
    case TagColor.Teal:
      return '#0d9488'
    case TagColor.Blue:
      return '#2563eb'
    case TagColor.Indigo:
      return '#4f46e5'
    case TagColor.Violet:
      return '#7c3aed'
    case TagColor.Purple:
      return '#9333ea'
    case TagColor.Pink:
      return '#db2777'
    default:
      return color
  }
}
