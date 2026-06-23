<?php

namespace App\Enums;

enum PaymentMethod: string
{
    case Cash = 'cash';
    case SyriatelCash = 'syriatel_cash';
    case BankTransfer = 'bank_transfer';
    case Other = 'other';
    case Wallet = 'wallet';
}
