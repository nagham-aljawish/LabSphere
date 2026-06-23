<?php

namespace App\Enums;

enum WalletTransactionType: string
{
    case TopUp = 'top_up';
    case Payment = 'payment';
}
