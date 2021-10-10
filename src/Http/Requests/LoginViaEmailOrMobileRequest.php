<?php

namespace Sinarajabpour1998\Identifier\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class LoginViaEmailOrMobileRequest extends FormRequest
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
            'username_input' => ['required', 'string']
        ];
    }

    public function messages()
    {
        return [
            'username_input.required' => 'فیلد موبایل یا ایمیل الزامی است.'
        ];
    }

    public function prepareForValidation()
    {
        $this->merge([
            'username_input' => easternToDigits(request()->username_input)
        ]);
    }
}
