import { existsSync } from 'fs'
import { Vault } from 'node-credentials'
import { join } from 'path'

export const getCredentials = (env: string) => {
  try {
    const basePath = process.cwd()
    const sourcePath = join(basePath, 'src', 'credentials')
    const distPath = join(basePath, 'dist', 'credentials')

    const credentialsFilePath = existsSync(join(distPath, `${env}.yaml`))
      ? join(distPath, `${env}.yaml`)
      : join(sourcePath, `${env}.yaml`)

    const vault = new Vault({ credentialsFilePath })
    return vault.credentials
  } catch (e) {
    console.error(`Error retrieving credentials: ${e.message}`)
    return {}
  }
}