import { Controller, Get, Req, Request, UseGuards } from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { AuthGuard } from '../guards/auth.guard';

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
}
