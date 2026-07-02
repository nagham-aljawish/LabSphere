<?php

namespace App\Http\Controllers;

use App\Models\TubeType;
use Illuminate\Http\JsonResponse;

class TubeTypeController extends Controller
{
    public function index(): JsonResponse
    {
        $tubeTypes = TubeType::where('is_active', true)
            ->orderBy('sort_order')
            ->orderBy('name')
            ->get();

        return $this->successResponse($tubeTypes);
    }
}
