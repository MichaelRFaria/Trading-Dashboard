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
  WithdrawBalanceDto,
} from '../dto/account.dto';

@Controller('account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  // endpoint to get an account balance
  @UseGuards(AuthGuard)
  @Get('accounts')
  async getAccounts(@Req() request) {
    const userId = request.user.sub;

    return this.accountService.getAccounts(userId);
  }

  // endpoint to deposit funds to the user's selected account
  @UseGuards(AuthGuard)
  @Post('deposit')
  @HttpCode(HttpStatus.OK)
  async depositBalance(
    @Body() depositBalanceDto: DepositBalanceDto,
    @Req() request,
  ) {
    const userId = request.user.sub;

    return this.accountService.deposit(userId, depositBalanceDto);
  }

  // endpoint to withdraw funds from the user's selected account
  @UseGuards(AuthGuard)
  @Post('withdraw')
  @HttpCode(HttpStatus.OK)
  async withdrawBalance(
    @Body() withdrawBalanceDto: WithdrawBalanceDto,
    @Req() request,
  ) {
    const userId = request.user.sub;

    return this.accountService.withdraw(userId, withdrawBalanceDto);
  }

  // endpoint to update the selected account
  @UseGuards(AuthGuard)
  @Put('update')
  async updateAccount(
    @Body() updateAccountDto: AccountUpdateDto,
    @Req() request,
  ) {
    const userId = request.user.sub;

    return this.accountService.updateSelectedAccount(userId, updateAccountDto);
  }

  // endpoint to create an account
  @UseGuards(AuthGuard)
  @Post('create')
  async createAccount(@Req() request) {
    const userId = request.user.sub;

    return this.accountService.create(userId);
  }

  // endpoint to delete an account
  @UseGuards(AuthGuard)
  @Delete('delete')
  async deleteAccount(
    @Body() deleteAccountDto: AccountDeleteDto,
    @Req() request,
  ) {
    const userId = request.user.sub;

    return this.accountService.delete(userId, deleteAccountDto);
  }
}
