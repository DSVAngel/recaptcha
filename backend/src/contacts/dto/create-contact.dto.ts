import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateContactDto {
  @IsString() @IsNotEmpty() @Length(2, 200)
  name!: string;

  @IsEmail() @IsNotEmpty()
  email!: string;

  @IsString() @IsNotEmpty()
  @Matches(/^\+?[\d\s\-()]{8,}$/, { message: 'Invalid phone format' })
  phone!: string;

  @IsString() @IsNotEmpty() @Length(3, 500)
  subject!: string;

  @IsString() @IsNotEmpty() @Length(10, 1000)
  message!: string;

  @IsString() @IsOptional()
  recaptchaToken?: string| null;
}
