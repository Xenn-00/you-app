import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class NotifierService {
  private readonly logger = new Logger(NotifierService.name);

  notifyUser(userId: string, content: string) {
    this.logger.log(`🔔 Notifying user ${userId}: ${content}`);
    // we can simulate email, push notif, etc. but it's too many 3rd party
  }
}
