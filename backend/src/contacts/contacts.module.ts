import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { Contact } from './contact.model';
import { RecaptchaService } from './recaptcha.service';

@Module({
  imports: [SequelizeModule.forFeature([Contact])],
  controllers: [ContactsController],
  providers: [ContactsService, RecaptchaService],
})
export class ContactsModule {}
