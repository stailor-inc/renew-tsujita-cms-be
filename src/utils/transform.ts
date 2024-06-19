import { ClassConstructor, plainToClass } from 'class-transformer'
import * as bcrypt from 'bcryptjs'

export function isPasswordExpired(passwordLastChanged: Date, currentDate: Date): boolean {
  if (!passwordLastChanged) return true
  const expirationPeriod = 90 // days until password expires
  const expirationDate = new Date(passwordLastChanged.getTime() + expirationPeriod * 24 * 60 * 60 * 1000)
  return currentDate > expirationDate
}

export async function hashPassword(password: string, salt: string): Promise<string> {
  return bcrypt.hash(password, salt)
}

export async function comparePassword(password: string, hashedPassword: string, salt: string): Promise<boolean> {
  const hash = await bcrypt.hash(password, salt)
  return hash === hashedPassword
}

export function serialize<T, O>(transformClass: ClassConstructor<T>, plainObject: O) {
  return plainToClass(transformClass, plainObject, { excludeExtraneousValues: true })
}

export function serializeArray<T, O>(transformClass: ClassConstructor<T>, plainArray: O[]) {
  return plainArray.map((object) =>
    plainToClass(transformClass, object, { excludeExtraneousValues: true }),
  )
}