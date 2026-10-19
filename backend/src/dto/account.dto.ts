import { IsNumber, Min } from 'class-validator';

export class AccountBalanceDto {
  @IsNumber()
  @Min(0.01) // this is the minimum number allowed in the frontend form when buying a stock, and must mirror the value used there
  amount: number;
}

export class DepositBalanceDto extends AccountBalanceDto {}

export class WithdrawBalanceDto extends AccountBalanceDto {}
