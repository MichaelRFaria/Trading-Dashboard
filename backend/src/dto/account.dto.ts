import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class AccountDto {
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

export class RegisterAccountDto extends AccountDto {}

// this is fine, but will cause problems for existing accounts, if the account rules change
export class LoginAccountDto extends AccountDto {}

export class LoginResultDto {
  success: boolean;
}

export class LoginSuccessDto extends LoginResultDto {
  success = true;
  access_token: string;
}

export class LoginFailureDto extends LoginResultDto {
  success = false;
  message: string;
}

export class RegisterResultDto {
  success: boolean;
  message: string;
}

export class RegisterSuccessDto extends RegisterResultDto {
  success = true;
}

export class RegisterFailureDto extends RegisterResultDto {
  success = false;
}
