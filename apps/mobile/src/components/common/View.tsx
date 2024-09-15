import { View as DefaultView } from 'react-native'

export const View = (props: DefaultView['props']) => {
  const { style, ...otherProps } = props
  return <DefaultView style={[{ backgroundColor: 'transparent' }, style]} {...otherProps} />
}
