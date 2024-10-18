import { TagColor } from 'frontend-types'

export const mapTagColor = (color: TagColor) => {
  switch (color) {
    case TagColor.White:
      return 'White'
    case TagColor.Black:
      return 'Black'
    case TagColor.Grey:
      return 'Grey'
    case TagColor.Brown:
      return 'Brown'
    case TagColor.Red:
      return 'Red'
    case TagColor.Orange:
      return 'Orange'
    case TagColor.Yellow:
      return 'Yellow'
    case TagColor.Green:
      return 'Green'
    case TagColor.Teal:
      return 'Teal'
    case TagColor.Blue:
      return 'Blue'
    case TagColor.Indigo:
      return 'Indigo'
    case TagColor.Violet:
      return 'Violet'
    case TagColor.Purple:
      return 'Purple'
    case TagColor.Pink:
      return 'Pink'

    default:
      return color
  }
}
