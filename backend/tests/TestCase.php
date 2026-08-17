<?php

namespace Tests;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Tests\Support\InteractsWithLabSphere;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;
    use InteractsWithLabSphere;
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedRolesAndTubeTypes();
    }
}
