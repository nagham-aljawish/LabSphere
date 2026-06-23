<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Doctor = 'doctor';
    case Technician = 'technician';
    case Reception = 'reception';
    case Patient = 'patient';
}
