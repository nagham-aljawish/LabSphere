<?php

namespace App\Http\Controllers;

use App\Models\Test;
use Illuminate\Http\JsonResponse;

class TestController extends Controller
{
    public function index(): JsonResponse
    {
        $tests = Test::where('is_active', true)->orderBy('name')->get();

        return $this->successResponse($tests);
    }

    public function show(Test $test): JsonResponse
    {
        if (! $test->is_active) {
            return $this->errorResponse('Test not found', [], 404);
        }

        return $this->successResponse($test);
    }
}
