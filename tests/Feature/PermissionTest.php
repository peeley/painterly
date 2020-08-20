<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Permission;
use App\User;

class PermissionTest extends TestCase
{

    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        // TODO make factory for users
        $this->testUser = User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
        ]);
        $this->testUser->save();

        $this->otherUser = User::create([
            'name' => 'Other User',
            'email' => 'test2@example.com',
            'password' => 'password123'
        ]);
        $this->otherUser->save();
    }

    public function testGetPermissionsOnNewPainting()
    {
        $painting = $this->testUser->paintings()->create();
        $painting->save();

        $response = $this->actingAs($this->testUser)
            ->getJson("/api/p/$painting->id/perms");

        $response->assertStatus(200)
            ->assertExactJson([]);
    }

    public function testAddPermission()
    {
        $painting = $this->testUser->paintings()->create();
        $painting->save();

        $add_user_response = $this->actingAs($this->testUser)
            ->postJson("/api/p/$painting->id/perms", [
                'perms' => 'read_write',
                'email' => $this->otherUser->email,
            ]);

        $add_user_response->assertStatus(200);

        $get_perms_response = $this->actingAs($this->testUser)
            ->getJson("/api/p/$painting->id/perms");
        $get_perms_response->assertStatus(200)
            ->assertJsonFragment(['user_email' => $this->otherUser->email, 'permissions' => 'read_write']);
    }
}
