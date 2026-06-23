<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'LabSphere API',
        'version' => '1.0.0',
        'docs' => '/docs/api.md',
    ]);
});
