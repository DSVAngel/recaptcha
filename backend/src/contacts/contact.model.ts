import { Column, DataType, Model, Table } from 'sequelize-typescript';

export interface ContactAttributes {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  recaptchaToken?: string | null;
}

export interface ContactCreationAttributes
  extends Omit<ContactAttributes, 'id'> {}

@Table({ tableName: 'contacts', timestamps: true })
export class Contact extends Model<ContactAttributes, ContactCreationAttributes> {
  @Column({ allowNull: false, type: DataType.STRING })
  name!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  email!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  phone!: string;

  @Column({ allowNull: false, type: DataType.STRING })
  subject!: string;

  @Column({ allowNull: false, type: DataType.TEXT })
  message!: string;

  @Column({ allowNull: true, type: DataType.STRING })
  recaptchaToken?: string | null;
}
