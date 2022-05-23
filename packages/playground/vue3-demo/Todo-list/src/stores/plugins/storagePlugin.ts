// pinia持久化存储

import { PiniaPluginContext } from 'pinia'
import { toRaw } from 'vue'
import { getStorage, setStorage } from '../../utils'
// 需求：
// 1. 可以根据不同的storeId进行指定的持久化存储
// 2. 避免存储到sessionStorage的时候key污染

type Options = {
  key: string
  needKeepIds: string[]
}
export default function storagePiniaPlugin(options: Options) {
  const { key, needKeepIds = [] } = options
  return function (context: PiniaPluginContext) {
    const { store } = context
    console.log(`${key ?? 'pinia'}-${store.$id}`)
    const data = getStorage(`${key ?? 'pinia'}-${store.$id}`)
    if (needKeepIds.length === 0) {
      store.$subscribe(() => {
        setStorage(`${key ?? 'pinia'}-${store.$id}`, toRaw(store.$state))
      })
    } else {
      needKeepIds.includes(store.$id) &&
        store.$subscribe(() => {
          setStorage(`${key ?? 'pinia'}-${store.$id}`, toRaw(store.$state))
        })
    }

    return {
      ...data,
    }
  }
}
