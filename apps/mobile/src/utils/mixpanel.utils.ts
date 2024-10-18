import { Mixpanel } from 'mixpanel-react-native'

import { config } from '../common/config'

export const mixpanel = new Mixpanel(config.mixPanelKey, true, false)
