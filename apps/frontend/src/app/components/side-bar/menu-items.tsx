export type MenuItem = {
  icon: React.ReactNode
  label: string
  to: string
  key: string
  tooltip?: string
  children?: MenuItem[]
  onClick?: () => void
  'data-testid'?: string
}
