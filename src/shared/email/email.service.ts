import { ISendMailOptions } from '@nestjs-modules/mailer'
import { InjectQueue } from '@nestjs/bull'
import { Injectable, Logger } from '@nestjs/common'
import { Job, Queue } from 'bull' // Updated import to include Job
import { MAIL_QUEUE, SEND_MAIL_JOB } from './email.constants'

@Injectable()
export class EmailService {
  constructor(@InjectQueue(MAIL_QUEUE) private readonly mailQueue: Queue) {}

  private logger = new Logger(EmailService.name)

  async sendMail(options: ISendMailOptions): Promise<boolean | Job> { // Updated return type
    try {
      if (process.env.NODE_ENV === 'test') {
        return true
      }

      const job = await this.mailQueue.add(SEND_MAIL_JOB, options) // Added variable to store the job
      return job // Updated to return the job
    } catch (error) { // Updated variable name to 'error'
      this.logger.error('An error occurred while adding send mail job', error) // Updated error message
      return false
    }
  }
}