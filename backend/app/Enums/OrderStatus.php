<?php

namespace App\Enums;

enum OrderStatus: string
{
    case Pending = 'pending';
    case SampleCollected = 'sample_collected';
    case Processing = 'processing';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
}
