export function getStorage(keyId: string){
  const stringifyValue = sessionStorage.getItem(keyId) || ''
  
  return stringifyValue ? JSON.parse(stringifyValue) : {}
}
export function setStorage(keyId: string, value: any){
  const stringifyValue = JSON.stringify(value)
  return sessionStorage.setItem(keyId, stringifyValue)
}
