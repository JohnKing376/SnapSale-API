import { JobQueue } from '../../infrastructure/queue/interfaces/job.queue.interface';

export interface MailOptions extends JobQueue {
  token?: number;

  subject: string;
}
