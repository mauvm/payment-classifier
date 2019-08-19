// See https://github.com/bunqCommunity/bunqJSClient/blob/dc03be4706a9407ba7753a28c55a3393a191d6d8/examples/create_encryption_key.js

import forge from 'node-forge'

/**
 * Example on how to generate a random AES key and re-use it afterwards
 * @param password
 * @returns {{key: the|*, iv: the|*}}
 */
const derivePassword = (password, keySize = 32) => {
  // generate a random iv
  const passwordIv = forge.random.getBytesSync(keySize)

  // amount of pbkdf2 iterations,
  const iterations = 300000

  // derive a 16 bit key from the password and iv
  const derivedBytes = forge.pkcs5.pbkdf2(
    password,
    passwordIv,
    iterations,
    keySize,
  )

  // turn derivedBytes into a readable string
  const encryptionKey = forge.util.bytesToHex(derivedBytes)

  // turn passwordIv into a readable string
  const encryptionIv = forge.util.bytesToHex(passwordIv)

  return {
    key: encryptionKey,
    iv: encryptionIv,
  }
}

/**
 * Basic function just to generate a random AES key
 * @param keySize
 */
const generateRandomKey = keySize => {
  // random bytes
  const key = forge.random.getBytesSync(keySize)

  // straight to hex and return it
  return forge.util.bytesToHex(key)
}

/**
 * Decides the key size
 * 16 for 128 bit AES
 * 24 for 192 bit AES
 * 32 for 256 bit AES
 *
 * @type {number}
 */
const KEY_SIZE = 32

// the password used to derive a key, could be any string
const password = String(process.argv[2])

if (!password) {
  console.error('No password given, provide as first argument')
  process.exit(1)
}

const derivedInfo = derivePassword(password, KEY_SIZE)
// console.log(`Encryption keys (${KEY_SIZE}-bit):`)
console.log('AES Key: ', derivedInfo.key)
// console.log('AES Key IV: ', derivedInfo.iv)

// const aesKey = generateRandomKey(KEY_SIZE)
// console.log('\nRandom AES key: ', aesKey)
