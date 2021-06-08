<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Permission;

class PermissionTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();

        $this->testUser = User::factory()->create();
        $this->otherUser = User::factory()->create();
    }

    public function testGetPermissionsOnNewPainting()
    {
        $painting = $this->testUser->paintings()->create();

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

        $this->actingAs($this->testUser)
            ->postJson("/api/p/$painting->id/perms", [
                'perms' => Permission::PERMISSION_READ_AND_WRITE,
                'email' => $this->otherUser->email,
            ])->assertStatus(200);

        $this->actingAs($this->testUser)
            ->getJson("/api/p/$painting->id/perms")
            ->assertStatus(200)
            ->assertJsonFragment([
                'user_id' => $this->otherUser->id,
                'user_email' => $this->otherUser->email,
                'permissions' => Permission::PERMISSION_READ_AND_WRITE,
            ]);
    }

    public function testEditPermission()
    {
        $painting = $this->testUser->paintings()->create();

        $this->actingAs($this->testUser)
            ->postJson("/api/p/$painting->id/perms", [
                'perms' => Permission::PERMISSION_READ_AND_WRITE,
                'email' => $this->otherUser->email,
            ])
            ->assertStatus(200);

        $this->actingAs($this->testUser)
            ->postJson("/api/p/$painting->id/perms", [
                'perms' => Permission::PERMISSION_READ_ONLY,
                'email' => $this->otherUser->email,
            ])
            ->assertStatus(200);

        $this->actingAs($this->testUser)
            ->getJson("/api/p/$painting->id/perms")
            ->assertStatus(200)
            ->assertJsonFragment([
                'user_id' => $this->otherUser->id,
                'user_email' => $this->otherUser->email,
                'permissions' => Permission::PERMISSION_READ_ONLY,
            ]);
    }

    public function testDeletePermission()
    {
        $painting = $this->testUser->paintings()->create();

        $this->actingAs($this->testUser)
            ->postJson("/api/p/$painting->id/perms", [
                'perms' => Permission::PERMISSION_READ_AND_WRITE,
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

    public function testEditPublicPermissions()
    {
        $painting = $this->testUser->paintings()->create();

        $this->actingAs($this->testUser)
            ->get("/api/p/" . $painting->id)
            ->assertStatus(200)
            ->assertJson([
                'view_public' => false,
                'edit_public' => false,
            ]);

        $this->actingAs($this->testUser)
            ->putJson("/api/p/" . $painting->id . "/perms", [
                'view_public' => true,
                'edit_public' => true,
            ])
            ->assertStatus(200);

        $this->actingAs($this->testUser)
            ->get("/api/p/" . $painting->id)
            ->assertStatus(200)
            ->assertJson([
                'view_public' => true,
                'edit_public' => true,
            ]);
    }
}
