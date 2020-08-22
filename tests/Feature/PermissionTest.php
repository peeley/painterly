<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
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

        $this->actingAs($this->testUser)
            ->getJson("/api/p/$painting->id/perms")
            ->assertStatus(200)
            ->assertExactJson([]);

        $this->actingAs($this->otherUser)
            ->get("/api/p/$painting->id/perms")
            ->assertStatus(403);
    }

    public function testAddPermission()
    {
        $painting = $this->testUser->paintings()->create();
        $painting->save();

        $this->actingAs($this->testUser)
            ->postJson("/api/p/$painting->id/perms", [
                'perms' => 'read_write',
                'email' => $this->otherUser->email,
            ])
            ->assertStatus(200);

        $this->actingAs($this->testUser)
            ->getJson("/api/p/$painting->id/perms")
            ->assertStatus(200)
            ->assertJsonFragment([
                'user_id' => $this->otherUser->id,
                'user_email' => $this->otherUser->email,
                'permissions' => 'read_write',
            ]);
    }

    public function testEditPermission(){
        $painting = $this->testUser->paintings()->create();
        $painting->save();

        $this->actingAs($this->testUser)
            ->postJson("/api/p/$painting->id/perms", [
                'perms' => 'read_write',
                'email' => $this->otherUser->email,
            ])
            ->assertStatus(200);

        $this->actingAs($this->testUser)
            ->postJson("/api/p/$painting->id/perms", [
                'perms' => 'read',
                'email' => $this->otherUser->email,
            ])
            ->assertStatus(200);

        $this->actingAs($this->testUser)
            ->getJson("/api/p/$painting->id/perms")
            ->assertStatus(200)
            ->assertJsonFragment([
                'user_id' => $this->otherUser->id,
                'user_email' => $this->otherUser->email,
                'permissions' => 'read',
            ]);
    }

    public function testDeletePermission()
    {
        $painting = $this->testUser->paintings()->create();
        $painting->save();

        $this->actingAs($this->testUser)
            ->postJson("/api/p/$painting->id/perms", [
                'perms' => 'read_write',
                'email' => $this->otherUser->email,
            ]);

        $this->actingAs($this->testUser)
            ->delete("/api/p/$painting->id/perms/" . $this->otherUser->id)
            ->assertStatus(200);
        $this->actingAs($this->testUser)
            ->getJson("/api/p/$painting->id/perms")
            ->assertStatus(200)
            ->assertExactJson([]);
    }
}
