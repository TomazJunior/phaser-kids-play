const NOT_FOUND_MESSAGE = 'RSA private or public key is null'

export const setInSecureKey = async (key: string, value: any): Promise<string> => {
  if (!window.cordova) {
    return Promise.reject('cordova not found')
  }
  return new Promise((resolve, reject) => {
    window.cordova.plugins.SecureKeyStore.set(
      function (res) {
        resolve(res)
      },
      function (error) {
        console.error(error)
        reject(error)
      },
      key,
      JSON.stringify(value)
    )
  })
}

export const getFromSecureKey = async <T>(key: string, defaulValue: T): Promise<T> => {
  if (!window.cordova) {
    return Promise.reject('cordova not found')
  }

  return new Promise((resolve, reject) => {
    window.cordova.plugins.SecureKeyStore.get(
      function (res) {
        if (!res) {
          resolve(defaulValue)
        } else {
          resolve(JSON.parse(res))
        }
      },
      function (error) {
        if (error.toString().includes(NOT_FOUND_MESSAGE)) {
          return resolve(defaulValue)
        }
        reject(error)
      },
      key
    )
  })
}
