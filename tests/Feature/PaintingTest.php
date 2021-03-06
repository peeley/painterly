<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;
use App\Models\Painting;
use App\Models\User;

class PaintingTest extends TestCase
{
    use RefreshDatabase;

    private User $testUser;
    private User $otherUser;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();

        Event::fake();

        $this->testUser = User::factory()->create();
        $this->otherUser = User::factory()->create();
    }

    public function testCreatePainting()
    {
        $painting = $this->testUser->paintings()->create();

        $this->assertTrue($this->testUser->id === $painting->user_id);
        $this->assertTrue($painting->objects === []);
        $this->assertTrue($painting->view_public === false);
        $this->assertTrue($painting->edit_public === false);

        $response = $this->actingAs($this->testUser)
            ->getJson("/api/p/$painting->id");
        $response->assertStatus(200)->assertJson([
            'objects' => [],
            'view_public' => false,
            'edit_public' => false,
            'title' => "Blank painting"
        ]);
    }

    public function testSetTitle()
    {
        $painting = $this->testUser->paintings()->create();
        $test_title = 'New title!';

        $response = $this->actingAs($this->testUser)
            ->postJson("/api/p/$painting->id/title", ['title' => $test_title]);
        $response->assertStatus(200);

        $response = $this->actingAs($this->testUser)
            ->getJson("/api/p/$painting->id");
        $response->assertStatus(200)
            ->assertJson(['title' => $test_title]);
    }

    public function testAddPaintingObjects()
    {
        $painting = $this->testUser->paintings()->create();

        $first_add_json = [
            'action' => 'add',
            'objects' => json_encode([[
                'uuid' => 'test-uuid',
                'data' => 'test-object'
            ]])
        ];
        $first_add_response = $this->actingAs($this->testUser)
            ->putJson("/api/p/$painting->id", $first_add_json);
        $first_add_response->assertStatus(200);

        $second_add_json = [
            'action' => 'add',
            'objects' => json_encode([[
                'uuid' => 'second-test-uuid',
                'data' => 'second test-object'
            ]])
        ];
        $second_add_response = $this->actingAs($this->testUser)
            ->putJson("/api/p/$painting->id", $second_add_json);
        $second_add_response->assertStatus(200);

        $all_objects = [
            [
                'uuid' => 'test-uuid',
                'data' => 'test-object'
            ],
            [
                'uuid' => 'second-test-uuid',
                'data' => 'second test-object'
            ]
        ];
        $get_response = $this->actingAs($this->testUser)
            ->getJson("/api/p/$painting->id");
        $get_response->assertStatus(200)
            ->assertJson(['objects' => $all_objects]);

        $clear_response = $this->actingAs($this->testUser)
            ->putJson("/api/p/$painting->id", ['action' => 'clear']);
        $clear_response->assertStatus(200);

        $get_response = $this->actingAs($this->testUser)
            ->getJson("/api/p/$painting->id");
        $get_response->assertStatus(200)
            ->assertJson(['objects' => []]);
    }

    public function testRemovePaintingObjects()
    {
        $painting = $this->testUser->paintings()->create();

        $first_add_json = [
            'action' => 'add',
            'objects' => json_encode([[
                'uuid' => 'test-uuid',
                'data' => 'test-object'
            ]])
        ];
        $this->actingAs($this->testUser)
            ->putJson("/api/p/$painting->id", $first_add_json);

        $second_add_json = [
            'action' => 'add',
            'objects' => json_encode([[
                'uuid' => 'second-test-uuid',
                'data' => 'second-test-object'
            ]])
        ];
        $this->actingAs($this->testUser)
            ->putJson("/api/p/$painting->id", $second_add_json);

        $delete_json = [
            'action' => 'remove',
            'objects' => json_encode([[
                'uuid' => 'test-uuid'
            ]])
        ];
        $delete_response = $this->actingAs($this->testUser)
            ->putJson("/api/p/$painting->id", $delete_json);
        $delete_response->assertStatus(200);

        $get_response = $this->actingAs($this->testUser)
            ->getJson("/api/p/$painting->id");
        $get_response->assertStatus(200)
            ->assertJson(['objects' => [
                [
                    'uuid' => 'second-test-uuid',
                    'data' => 'second-test-object'
                ]
            ]]);
    }

    public function testModifyPaintingObjects()
    {
        $painting = $this->testUser->paintings()->create();

        $add_json = [
            'action' => 'add',
            'objects' => json_encode([[
                'uuid' => 'test-uuid',
                'data' => 'test-object'
            ]])
        ];
        $this->actingAs($this->testUser)
            ->putJson("/api/p/$painting->id", $add_json);

        $modify_json = [
            'action' => 'modify',
            'objects' => json_encode([[
                'uuid' => 'test-uuid',
                'data' => 'modified-data'
            ]])
        ];
        $modify_response = $this->actingAs($this->testUser)
            ->putJson("/api/p/$painting->id", $modify_json);
        $modify_response->assertStatus(200);

        $get_response = $this->actingAs($this->testUser)
            ->getJson("/api/p/$painting->id");
        $get_response->assertStatus(200)
            ->assertJson(['objects' => [
                [
                    'uuid' => 'test-uuid',
                    'data' => 'modified-data'
                ]
            ]]);
    }

    public function testViewWhilePublicViewEnabled()
    {
        $painting = $this->testUser->paintings()->create();
        $response = $this->actingAs($this->testUser)
            ->getJson("/api/p/$painting->id");
        $response->assertStatus(200);

        $this->assertTrue($painting->view_public === false);

        $unauth_get_response = $this->actingAs($this->otherUser)
            ->getJson("/api/p/$painting->id");
        $unauth_get_response->assertStatus(403);

        $painting->view_public = true;
        $painting->save();
        $auth_get_response = $this->actingAs($this->otherUser)
            ->getJson("/api/p/$painting->id");
        $auth_get_response->assertStatus(200);
    }

    public function testEditWhilePublicEditEnabled()
    {
        $painting = $this->testUser->paintings()->create();
        $this->assertTrue($painting->edit_public === false);

        $unauth_put_response = $this->actingAs($this->otherUser)
            ->putJson("/api/p/$painting->id", [
                'action' => 'add',
                'objects' => json_encode([])
            ]);
        $unauth_put_response->assertStatus(403);

        $painting->edit_public = true;
        $painting->save();
        $auth_put_response = $this->actingAs($this->otherUser)
            ->putJson("/api/p/$painting->id", [
                'action' => 'add',
                'objects' => json_encode([])
            ]);
        $auth_put_response->assertStatus(200);
    }

    public function testDeletePainting()
    {
        $painting = $this->testUser->paintings()->create();

        $response = $this->actingAs($this->testUser)
            ->deleteJson("/api/p/$painting->id");

        $response->assertStatus(200);
        $this->assertTrue(Painting::find($painting->id) === null);

        $response = $this->actingAs($this->testUser)
            ->getJson("/api/p/$painting->id")
            ->assertStatus(404);
    }
}
