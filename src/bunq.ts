import BunqJSClient from '@bunq-community/bunq-js-client'
import JSONFileStore from '@bunq-community/bunq-js-client/dist/Stores/JSONFileStore'
import LoggerInterface from '@bunq-community/bunq-js-client/dist/Interfaces/LoggerInterface'

import config from './config'
import { noop } from '@babel/types'

// Singleton
let bunqJSClient

function doNothing(value: any) {}

export default async function getClient(): Promise<BunqJSClient> {
  if (!bunqJSClient) {
    const storageInstance = JSONFileStore(config.bunq.clientDataFile)
    const logger: LoggerInterface = {
      log: doNothing,
      info: doNothing,
      error: console.error.bind(console),
      debug: doNothing,
      trace: doNothing,
      warn: console.warn.bind(console),
    }
    bunqJSClient = new BunqJSClient(storageInstance, logger)

    // Setup and register client
    await bunqJSClient.run(
      config.bunq.apiKey,
      config.bunq.permittedIPs,
      config.bunq.environment,
      config.bunq.encryptionKey,
    )
    await bunqJSClient.install()
    await bunqJSClient.registerDevice(config.bunq.deviceName)
    await bunqJSClient.registerSession()
  }

  return bunqJSClient
}
