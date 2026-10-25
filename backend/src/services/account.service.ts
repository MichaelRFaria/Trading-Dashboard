import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import {
  AccountDeleteDto,
  AccountSelectDto,
  DepositBalanceDto,
  WithdrawBalanceDto,
} from '../dto/account.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private readonly prisma: PrismaService) {}

  async getAccounts(userId: number) {
    const data = await this.prisma.account.findMany({
      where: { user_id: userId },
    });

    if (data.length === 0) {
      throw new NotFoundException(`No accounts found`);
    }

    return {
      data: data,
    };
  }

  async getSelectedAccount(userId: number) {
    // findFirst used but unique index means that this account is always unique
    return await this.prisma.account.findFirst({
      where: { user_id: userId, selected: true },
    });
  }

  async deposit(userId: number, dto: DepositBalanceDto) {
    try {
      const account = await this.getSelectedAccount(userId);

      // service logic ensures that the user always has at least one account, this is here for the TS compiler (and as an extra safety measure I suppose)
      if (!account) {
        throw new NotFoundException('No selected account found');
      }

      await this.prisma.account.update({
        where: { id: account.id },
        data: {
          balance: {
            increment: dto.amount,
          },
        },
      });

      return {
        success: true,
        message: `Successfully deposited $${dto.amount}`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error(error);

      throw new InternalServerErrorException(
        'An error occurred, the deposit was not executed',
      );
    }
  }

  async withdraw(userId: number, dto: WithdrawBalanceDto) {
    try {
      const account = await this.getSelectedAccount(userId);

      // service logic ensures that the user always has at least one account, this is here for the TS compiler (and as an extra safety measure I suppose)
      if (!account) {
        throw new NotFoundException(`The selected account no longer exists.`);
      }

      if (account.balance.lt(dto.amount)) {
        throw new BadRequestException(
          `Insufficient amount to withdraw. The account balance is $${account.balance.toString()}, you cannot withdraw $${dto.amount}`,
        );
      }

      await this.prisma.account.update({
        where: { id: account.id },
        data: {
          balance: {
            decrement: dto.amount,
          },
        },
      });

      return {
        success: true,
        message: `Successfully withdrew $${dto.amount}`,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      console.error(error);

      throw new InternalServerErrorException(
        'An error occurred, the withdrawal was not executed',
      );
    }
  }

  async updateSelectedAccount(userId: number, dto: AccountSelectDto) {
    // due to unique index constraint (only 1 account per user can be selected), we must always remove the current selected account before adding a new selected account
    await this.prisma.$transaction(async (tx) => {
      await tx.account.updateMany({
        where: {
          user_id: userId,
          selected: true,
        },
        data: {
          selected: false,
        },
      });

      await tx.account.update({
        where: {
          id: dto.account_id,
          user_id: userId,
        },
        data: {
          selected: true,
        },
      });
    });
    return {
      message: `Successfully updated selected account to account ${dto.account_id}`,
    };
  }

  async create(userId: number) {
    await this.prisma.account.create({
      data: {
        user_id: userId,
      },
    });

    return {
      message: `Successfully created new account`,
    };
  }

  // should not allow selected account to be deleted (this also will make sure the user always has at least one account)
  async delete(userId: number, dto: AccountDeleteDto) {
    // check if the account to delete exists
    const accountToDelete = await this.prisma.account.findUnique({
      where: { user_id: userId, id: dto.account_id },
    });

    if (!accountToDelete) {
      throw new NotFoundException(`Account ${dto.account_id} not found`);
    }

    // check if the user only has one account, if they do, throw bad request exception
    const accounts = await this.prisma.account.findMany({
      where: { user_id: userId },
    });

    if (accounts.length == 1) {
      throw new BadRequestException('You cannot delete your only account');
    }

    // check if the account to delete has remaining balance, if it does, throw bad request exception
    if (accountToDelete.balance.gt(new Prisma.Decimal(0))) {
      throw new BadRequestException(
        'You cannot delete an account that does not have an empty balance',
      );
    }

    // check if the account to delete is the selected account, if it is then throw bad request exception
    if (accountToDelete.selected) {
      throw new BadRequestException('You cannot delete your selected account');
    }

    await this.prisma.account.delete({
      where: { user_id: userId, id: dto.account_id },
    });

    return {
      message: `Successfully deleted account ${dto.account_id}`,
    };
  }
}
