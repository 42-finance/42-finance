export const debounce = <F extends (...params: any[]) => void>(func: F, timeout = 300) => {
  let timer: ReturnType<typeof setTimeout>
  return (...args: []) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}
