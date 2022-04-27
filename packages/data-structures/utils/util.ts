export function defaultEquals(a: unknown, b: unknown) {
  return a === b
}
export function defaultToString(item: any){
  if(item === null){
    return 'NULL'
  } else if(item === undefined){
    return 'UNDEFINED'
  } else if(typeof item === 'string' || item instanceof String){
    return `$item}`
  }
  return item.toString()
}
