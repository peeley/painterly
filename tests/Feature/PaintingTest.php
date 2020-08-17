<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Painting;
use App\User;

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
    public function setUp(): void{
        parent::setUp();
        $this->testUser = User::create([
            'name' => 'Test McUser',
            'email' => 'test@example.com',
            'password' => 'test1234'
        ]);
        $this->otherUser = User::create([
            'name' => 'Other McUser',
            'email' => 'test2@example.com',
            'password' => 'test1234'
        ]);
    }

    public function testCreatePainting()
    {
        $painting = $this->testUser->paintings()->create();
        $this->assertTrue($this->testUser->id === $painting->user_id);
        $this->assertTrue($painting->strokes === []);
    }

    public function testExample()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }
}
