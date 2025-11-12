import {
  Body,
  Controller,
  Ip,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { RecaptchaService } from './recaptcha.service';

@Controller('contacts')
export class ContactsController {
  constructor(
    private readonly contactsService: ContactsService,
    private readonly recaptchaService: RecaptchaService,
  ) {}

@Post()
async submit(@Body() dto: CreateContactDto, @Ip() ip: string) {
  console.log("Petición recibida en POST /contacts");
  console.log("DTO recibido:", dto);

  // Validar recaptcha
  if (!dto.recaptchaToken) {
    throw new BadRequestException('reCAPTCHA token is required');
  }

  const ok = await this.recaptchaService.validateToken(
    dto.recaptchaToken,
    ip,
  );

  if (!ok) {
    throw new BadRequestException('reCAPTCHA validation failed');
  }

  // Guardar en BD
  const saved = await this.contactsService.create(dto);
  console.log("Guardado correctamente:", saved);

  return { success: true, id: saved.id };
}
}
