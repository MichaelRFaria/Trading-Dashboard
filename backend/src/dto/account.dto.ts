export class AccountDto {
    email: string;
    password: string;
}

export class RegisterAccountDto extends AccountDto {
}

export class LoginAccountDto extends AccountDto {
}

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
