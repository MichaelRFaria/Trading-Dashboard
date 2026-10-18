import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

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
    const account = await this.prisma.account.findFirst({
      where: { user_id: userId, selected: true },
    });

    return {
      account: account,
    };
  }

  // async deposit(userId: number, dto) {}
  //
  // async withdraw(userId: number, dto) {}

  // async updateSelectedAccount(userId: number, dto) {
  //   due to unique index constraint (only 1 account per user can be selected), we must always remove the current selected account before adding a new selected account
  //   await this.prisma.$transaction(async (tx) => {
  //     await tx.account.updateMany({
  //       where: {
  //         user_id: userId,
  //         selected: true,
  //       },
  //       data: {
  //         selected: false,
  //       },
  //     });
  //
  //     await tx.account.update({
  //       where: {
  //         id: accountId,
  //         user_id: userId,
  //       },
  //       data: {
  //         selected: true,
  //       },
  //     });
  //   });
  // }

  // async createAccount(userId: number, dto) {}

  // should not allow selected account to be deleted (this also will make sure the user always has at least one account)
  // async deleteAccount(userId: number, dto) {}
}
