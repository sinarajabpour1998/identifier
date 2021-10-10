<?php

namespace Sinarajabpour1998\Identifier\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ConfirmRecoveryCodeRequest extends FormRequest
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
            'username' => ['required', 'string'],
            'code' => ['required'],
            'type' => ['required', 'in:email,mobile']
        ];
    }

    public function messages()
    {
        return [
            'username.required' => 'فیلد نام کاربری الزامی است.',
            'code.required' => 'فیلد کد تایید الزامی است.',
            'type.required' => 'فیلد نوع بازیابی الزامی است.',
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
