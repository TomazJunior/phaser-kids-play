export default class NotConnectedError extends Error {
  constructor() {
    super('Device is not connected')
    this.name = 'NotConnectedError'
  }
}
