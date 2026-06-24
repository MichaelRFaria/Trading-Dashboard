export class AccountDto {
    email: string;
    password: string;
}

export class RegisterAccountDto extends AccountDto {}

export class LoginAccountDto extends AccountDto {}
