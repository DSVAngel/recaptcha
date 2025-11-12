import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Contact } from './contact.model';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel(Contact)
    private readonly contactModel: typeof Contact,
  ) {}

async create(dto: any) {
  console.log('DTO recibido:', dto);

  try {
    const record = await this.contactModel.create(dto);
    console.log('Guardado correctamente:', record);
    return record;
  } catch (e) {
    console.error('ERROR AL GUARDAR:', e);
    throw e;
  }
}

}
