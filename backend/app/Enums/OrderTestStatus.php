<?php

namespace App\Enums;

enum OrderTestStatus: string
{
    case Pending = 'pending';
    case Processing = 'processing';
    case Completed = 'completed';
}
