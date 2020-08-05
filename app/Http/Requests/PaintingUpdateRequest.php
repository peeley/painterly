<?php

namespace App\Http\Requests;

use App\Painting;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Gate;

class PaintingUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'title' => 'max:255|min:1',
            'strokes' => 'json',
            //'action' => Rule::in(['add', 'undo', 'redo', 'clear'])
        ];
    }
}
