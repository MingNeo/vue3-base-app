import type { storageKeys } from '~/config'

function parseValue(value?: string | null): any {
  let result = value
  try {
    result = JSON.parse(value as string)
  }
  catch (error) { }
  return result
}

type StorageType = 'localStorage' | 'sessionStorage'

function generateGet(type: StorageType) {
  return function (key: keyof typeof storageKeys) {
    return parseValue(window[type].getItem(key))
  }
}

function generateSet(type: StorageType) {
  return function (key: keyof typeof storageKeys, value: any) {
    window[type].setItem(key, JSON.stringify(value))
  }
}

function generateRemove(type: StorageType) {
  return function (key: keyof typeof storageKeys) {
    window[type].removeItem(key)
  }
}

function generateClear(type: StorageType) {
  return window[type].clear
}

const storage = {
  local: {
    get: generateGet('localStorage'),
    set: generateSet('localStorage'),
    remove: generateRemove('localStorage'),
    clear: generateClear('localStorage'),
  },
  session: {
    get: generateGet('sessionStorage'),
    set: generateSet('sessionStorage'),
    remove: generateRemove('sessionStorage'),
    clear: generateClear('sessionStorage'),
  },
}

export default storage
