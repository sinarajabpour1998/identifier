<?php

namespace Sinarajabpour1998\Identifier\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class SetCookieRequest extends FormRequest
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
            'cookie_name' => ['required','string'],
            'cookie_value' => ['required','string']
        ];
    }

    public function prepareForValidation()
    {
        $this->merge([
            'cookie_value' => easternToDigits(request()->cookie_value)
        ]);
    }
}
