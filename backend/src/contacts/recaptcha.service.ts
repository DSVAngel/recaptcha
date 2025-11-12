import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RecaptchaService {
  private readonly secret = process.env.RECAPTCHA_SECRET;
  private readonly logger = new Logger(RecaptchaService.name);

  async validateToken(token: string, remoteip?: string): Promise<boolean> {
    if (!this.secret) {
      this.logger.warn('RECAPTCHA_SECRET not set — skipping validation (unsafe)');
      return false; // o true en entorno de test? Mejor false y falla el envío.
    }

    try {
      const params = new URLSearchParams();
      params.append('secret', this.secret);
      params.append('response', token);
      if (remoteip) params.append('remoteip', remoteip);

      const res = await axios.post('https://www.google.com/recaptcha/api/siteverify', params.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      return res.data?.success === true;
    } catch (err) {
      this.logger.error('Error validating recaptcha', err);
      return false;
    }
  }
}
