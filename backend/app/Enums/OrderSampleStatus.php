<?php

namespace App\Enums;

enum OrderSampleStatus: string
{
    case Pending = 'pending';
    case Received = 'received';
    case Analyzing = 'analyzing';
    case PendingReview = 'pending_review';
    case Approved = 'approved';
    case Rejected = 'rejected';
}
