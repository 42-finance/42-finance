import { NativeStackScreenProps } from '@react-navigation/native-stack'

import { RootStackParamList } from './root-stack-params'

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>
