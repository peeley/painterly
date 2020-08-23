<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;
use App\Painting;
use App\User;
use App\UpdateProtocol;

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

        $this->testUser = factory(User::class)->create();

        $this->otherUser = factory(User::class)->create();
    }

    public function testCreatePainting()
    {
        $painting = $this->testUser->paintings()->create();
        $this->assertTrue($this->testUser->id === $painting->user_id);
        $this->assertTrue($painting->strokes === []);
        $this->assertTrue($painting->view_public === false);
        $this->assertTrue($painting->edit_public === false);
        $response = $this->actingAs($this->testUser)
            ->getJson("/api/p/$painting->id");
        $response->assertStatus(200)->assertJson([
            'strokes' => [],
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
            ->putJson("/api/p/$painting->id", ['title' => $test_title]);
        $response->assertStatus(200);

        $response = $this->actingAs($this->testUser)
            ->getJson("/api/p/$painting->id");
        $response->assertStatus(200)
            ->assertJson(['title' => $test_title]);
    }

    public function testAddStrokes()
    {
        $painting = $this->testUser->paintings()->create();
        $request_json = [
            'action' => 'add',
            'strokes' => json_encode("new stroke!")
        ];

        $first_add_response = $this->actingAs($this->testUser)
            ->putJson("/api/p/$painting->id", $request_json);
        $first_add_response->assertStatus(200);
        $request_json['strokes'] = json_encode("new stroke two!");
        $second_add_response = $this->actingAs($this->testUser)
            ->putJson("/api/p/$painting->id", $request_json);
        $second_add_response->assertStatus(200);

        $get_response = $this->actingAs($this->testUser)
            ->getJson("/api/p/$painting->id");
        $get_response->assertStatus(200)
                 ->assertJson(['strokes' => ["new stroke!", "new stroke two!"]]);

        $undo_response = $this->actingAs($this->testUser)
                         ->putJson("/api/p/$painting->id", ['action' => 'undo']);
        $undo_response->assertStatus(200);

        $get_response = $this->actingAs($this->testUser)
            ->getJson("/api/p/$painting->id");
        $get_response->assertStatus(200)
            ->assertJson(['strokes' => ["new stroke!"]]);

        $clear_response = $this->actingAs($this->testUser)
            ->putJson("/api/p/$painting->id", ['action' => 'clear']);
        $clear_response->assertStatus(200);

        $get_response = $this->actingAs($this->testUser)
            ->getJson("/api/p/$painting->id");
        $get_response->assertStatus(200)
            ->assertJson(['strokes' => []]);
    }

    public function testViewPublicSetting()
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

    public function testEditPublicSetting(){
        $painting = $this->testUser->paintings()->create();
        $this->assertTrue($painting->edit_public === false);

        $unauth_put_response = $this->actingAs($this->otherUser)
            ->putJson("/api/p/$painting->id", [
                'action' => 'add',
                'strokes' => json_encode([])
            ]);
        $unauth_put_response->assertStatus(403);

        $painting->edit_public = true;
        $painting->save();
        $auth_put_response = $this->actingAs($this->otherUser)
            ->putJson("/api/p/$painting->id", [
                'action' => 'add',
                'strokes' => json_encode([])
            ]);
        $auth_put_response->assertStatus(200);
    }

    public function testDeletePainting(){
        $painting = $this->testUser->paintings()->create();

        $response = $this->actingAs($this->testUser)
             ->deleteJson("/api/p/$painting->id");

        $response->assertStatus(200);
        $this->assertTrue(Painting::find($painting->id) === null);
    }
}
