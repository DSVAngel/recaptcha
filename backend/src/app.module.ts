import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContactsModule } from './contacts/contacts.module';
import { config } from 'dotenv';

config();

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      models: [],
      autoLoadModels: true,
      synchronize: false,
      logging: false,
    }),
    ContactsModule,
  ],
})
export class AppModule {}
