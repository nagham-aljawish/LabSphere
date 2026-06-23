<?php

namespace App\Enums;

enum LabResultItemStatus: string
{
    case Normal = 'normal';
    case High = 'high';
    case Low = 'low';
    case Critical = 'critical';
}
