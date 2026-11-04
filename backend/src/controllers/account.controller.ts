import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { AuthGuard } from '../guards/auth.guard';
import {
  AccountDeleteDto,
  AccountUpdateDto,
  DepositBalanceDto,
  TransferBalanceDto,
  WithdrawBalanceDto,
} from '../dto/account.dto';
import type { AuthenticatedRequest } from '../types/misc';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // endpoint to get an account balance
  @UseGuards(AuthGuard)
  @Get('accounts')
  async getAccounts(@Req() request: AuthenticatedRequest) {
    const userId = request.user.sub;

    return this.accountService.getAccounts(Number(userId));
  }

  // endpoint to deposit funds to the user's selected account
  @UseGuards(AuthGuard)
  @Post('deposit')
  @HttpCode(HttpStatus.OK)
  async depositBalance(
    @Body() depositBalanceDto: DepositBalanceDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.sub;

    return this.accountService.deposit(Number(userId), depositBalanceDto);
  }

  // endpoint to withdraw funds from the user's selected account
  @UseGuards(AuthGuard)
  @Post('withdraw')
  @HttpCode(HttpStatus.OK)
  async withdrawBalance(
    @Body() withdrawBalanceDto: WithdrawBalanceDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.sub;

    return this.accountService.withdraw(Number(userId), withdrawBalanceDto);
  }

  // endpoint to transfer funds from the user's selected account to the given account
  @UseGuards(AuthGuard)
  @Post('transfer')
  @HttpCode(HttpStatus.OK)
  async transferBalance(
    @Body() transferBalanceDto: TransferBalanceDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.sub;

    return this.accountService.transfer(Number(userId), transferBalanceDto);
  }

  // endpoint to update the selected account
  @UseGuards(AuthGuard)
  @Put('update')
  async updateAccount(
    @Body() updateAccountDto: AccountUpdateDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.sub;

    return this.accountService.updateSelectedAccount(
      Number(userId),
      updateAccountDto,
    );
  }

  // endpoint to create an account
  @UseGuards(AuthGuard)
  @Post('create')
  async createAccount(@Req() request: AuthenticatedRequest) {
    const userId = request.user.sub;

    return this.accountService.create(Number(userId));
  }

  // endpoint to delete an account
  @UseGuards(AuthGuard)
  @Delete('delete')
  async deleteAccount(
    @Body() deleteAccountDto: AccountDeleteDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const userId = request.user.sub;

    return this.accountService.delete(Number(userId), deleteAccountDto);
  }
}
