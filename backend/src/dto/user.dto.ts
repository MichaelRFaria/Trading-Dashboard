import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class UserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(8, 30)
  @Matches(/[0-9]/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/[^A-Za-z0-9]/, {
    message: 'Password must contain at least one special character',
  })
  password: string;
}

export class RegisterAccountDto extends UserDto {}

export class LoginAccountDto extends UserDto {}
