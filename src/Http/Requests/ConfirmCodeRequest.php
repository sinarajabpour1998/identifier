<?php

namespace Sinarajabpour1998\Identifier\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ConfirmCodeRequest extends FormRequest
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
            'mobile' => ['required', 'mobile'],
            'code' => ['required']
        ];
    }

    public function messages()
    {
        return [
            'mobile.required' => 'فیلد موبایل الزامی است.',
            'code.required' => 'فیلد کد تایید الزامی است.'
        ];
    }

    public function prepareForValidation()
    {
        $this->merge([
            'mobile' => easternToDigits(request()->mobile),
            'code' => easternToDigits(request()->code)
        ]);
    }
}
