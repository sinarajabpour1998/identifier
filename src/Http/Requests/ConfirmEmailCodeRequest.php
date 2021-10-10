<?php

namespace Sinarajabpour1998\Identifier\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ConfirmEmailCodeRequest extends FormRequest
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
            'username' => ['required', 'email'],
            'code' => ['required']
        ];
    }

    public function messages()
    {
        return [
            'username.required' => 'فیلد نام کاربری الزامی است.',
            'username.email' => 'تنها ایمیل مورد قبول است.',
            'code.required' => 'فیلد کد تایید الزامی است.',
        ];
    }

    public function prepareForValidation()
    {
        $this->merge([
            'username' => easternToDigits(request()->username),
            'code' => easternToDigits(request()->code)
        ]);
    }
}
