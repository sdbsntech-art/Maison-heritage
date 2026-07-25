<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'Maison Heritage API',
        'version' => '1.0',
        'docs' => '/api/health',
    ]);
});
