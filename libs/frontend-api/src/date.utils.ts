export const convertDateStringsToDate = (object: any) => {
  for (const key in object) {
    if (typeof object[key] === 'string') {
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(object[key])) {
        object[key] = new Date(object[key])
      }
    } else if (typeof object[key] === 'object') {
      convertDateStringsToDate(object[key])
    }
  }
}
