<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTestRequest;
use App\Models\Test;
use Illuminate\Http\JsonResponse;

class AdminTestController extends Controller
{
    public function index(): JsonResponse
    {
        $tests = Test::orderBy('name')->paginate(20);

        return $this->successResponse($tests);
    }

    public function store(StoreTestRequest $request): JsonResponse
    {
        $test = Test::create($request->validated());

        return $this->successResponse($test, 'Test created successfully', 201);
    }

    public function update(StoreTestRequest $request, Test $test): JsonResponse
    {
        $test->update($request->validated());

        return $this->successResponse($test, 'Test updated successfully');
    }

    public function destroy(Test $test): JsonResponse
    {
        $test->delete();

        return $this->successResponse(null, 'Test deleted successfully');
    }
}
