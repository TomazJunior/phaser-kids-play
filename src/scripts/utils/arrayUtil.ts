export const deepCopy = (arr: any[]) => {
  let copy: any[] = []
  arr.forEach((elem) => {
    if (Array.isArray(elem)) {
      copy.push(deepCopy(elem))
    } else {
      if (typeof elem === 'object') {
        copy.push(deepCopyObject(elem))
      } else {
        copy.push(elem)
      }
    }
  })
  return copy
}

export const sortArray = <T>(arr: any[], fieldName: string): Array<T> => {
  return arr.sort((obj1, obj2) => {
    if (obj1[fieldName] > obj2[fieldName]) {
      return 1
    }
    if (obj1[fieldName] < obj2[fieldName]) {
      return -1
    }
    return 0
  })
}

// Helper function to deal with Objects
const deepCopyObject = (obj) => {
  let tempObj = {}
  for (let [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      tempObj[key] = deepCopy(value)
    } else {
      if (typeof value === 'object') {
        tempObj[key] = deepCopyObject(value)
      } else {
        tempObj[key] = value
      }
    }
  }
  return tempObj
}


