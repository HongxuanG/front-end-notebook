
import { defaultToString } from "../utils/util";
export default class HashTable {
  table = {}
  constructor(public toStrFn = defaultToString) {
    this.toStrFn = toStrFn
    this.table = {}
  }
}
