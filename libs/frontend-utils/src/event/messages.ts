import { eventEmitter } from './event-emitter'

export const clearMessage = () => {
  eventEmitter.emit('onMessage', null)
}

export const setMessage = (message: string | null) => {
  eventEmitter.emit('onMessage', message)
}
