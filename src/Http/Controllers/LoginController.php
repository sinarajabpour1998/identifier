<?php

namespace Sinarajabpour1998\Identifier\Http\Controllers;

use App\Http\Controllers\Controller;
use Sinarajabpour1998\Identifier\Facades\IdentifierLoginFacade;
use Sinarajabpour1998\Identifier\Http\Requests\ChangePasswordRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Sinarajabpour1998\Identifier\Http\Requests\CheckMobileRequest;
use Sinarajabpour1998\Identifier\Http\Requests\CheckUsernameRequest;
use Sinarajabpour1998\Identifier\Http\Requests\ConfirmCodeRequest;
use Sinarajabpour1998\Identifier\Http\Requests\ConfirmEmailCodeRequest;
use Sinarajabpour1998\Identifier\Http\Requests\ConfirmRecoveryCodeRequest;
use Sinarajabpour1998\Identifier\Http\Requests\LoginViaEmailOrMobileRequest;
use Sinarajabpour1998\Identifier\Http\Requests\SendCodeRequest;
use Sinarajabpour1998\LogManager\Facades\LogFacade;

class LoginController extends Controller
{
    public function show($page = null)
    {
        if ($page != 'default'){
            return redirect(url('/auth/default'));
        }
        return view('vendor.identifier.identifier', [
            'page' => $page
        ]);
    }

    public function sendCode(SendCodeRequest $request)
    {
        $result = IdentifierLoginFacade::sendSMS($request->mobile);
        return json_encode([
            'status' => $result['status'],
            'message' => $result['message']
        ]);
    }

    public function confirmCode(ConfirmCodeRequest $request)
    {
        $url = '';
        $result = IdentifierLoginFacade::confirmSMS($request->mobile, $request->code);
        if ($result->status == 200){
            $attempLogin = IdentifierLoginFacade::attempLogin($result->user);
            if ($attempLogin->status == 200){
                $url = IdentifierLoginFacade::redirectUserUrl($result);
                LogFacade::generateLog("login");
                return json_encode([
                    'status' => $result->status,
                    'message' => $result->message,
                    'url' => $url
                ]);
            }
        }else{
            LogFacade::generateLog("failed_login", $request->mobile . " : " . $result->message);
            return json_encode([
                'status' => $result->status,
                'message' => $result->message,
            ]);
        }
    }

    public function checkMobile(CheckMobileRequest $request)
    {
        $request->validate([
            'mobile' => ['required', 'mobile']
        ],[
            'mobile.required' => '???????? ???????????? ???????????? ??????.'
        ]);
        $result = IdentifierLoginFacade::checkMobileExist($request->mobile);
        return json_encode([
            'type' => $result,
        ]);
    }

    public function checkRegisteredUser(LoginViaEmailOrMobileRequest $request)
    {
        $type = 'undefined';
        $message = '';
        $result = array();
        $registration_status = 'not_registered';
        $result['status'] = 200;
        $result['message'] = 'Success';
        if (IdentifierLoginFacade::isMobile($request->username_input)){
            $type = 'mobile';
            $registration_status = IdentifierLoginFacade::checkMobileExist($request->username_input);
        }
        if (IdentifierLoginFacade::isEmail($request->username_input)){
            $type = 'email';
            $registration_status = IdentifierLoginFacade::checkEmailExist($request->username_input);
        }
        if ($type == 'undefined'){
            $result['status'] = 404;
            $result['message'] = '???????? ?????????? ???? ???????????? ???????? ???????? ??????.';
        }
        return json_encode([
            'type' => $type,
            'registeration_status' => $registration_status,
            'status' => $result['status'],
            'message' => $result['message']
        ]);
    }

    public function checkUsername(CheckUsernameRequest $request)
    {
        $request->validate([
            'username' => ['required', 'string']
        ],[
            'username.required' => '???????? ???????????? ???? ?????????? ???????????? ??????.'
        ]);
        $type = 'undefined';
        $message = '';
        if (IdentifierLoginFacade::isMobile($request->username)){
            $type = 'mobile';
            $result = IdentifierLoginFacade::sendSMS($request->username, 'recovery_mode');
        }
        if (IdentifierLoginFacade::isEmail($request->username)){
            $type = 'email';
            $result = IdentifierLoginFacade::sendConfirmEmail($request->username);
        }
        if ($type == 'undefined'){
            $result = array();
            $result['status'] = 404;
            $result['message'] = '???????? ?????????? ???? ???????????? ???????? ???????? ??????.';
        }
        return json_encode([
            'status' => $result['status'],
            'type' => $type,
            'message' => $result['message']
        ]);
    }

    public function confirmRecoveryCode(ConfirmRecoveryCodeRequest $request)
    {
        $result = (object) array();
        if ($request->type == 'mobile'){
            $result = IdentifierLoginFacade::confirmSMS($request->username, $request->code, 'recovery_mode');
            LogFacade::generateLog("password_recovery_via_sms", $request->username . " : " . $result->message);
        }
        if ($request->type == 'email'){
            $result = IdentifierLoginFacade::confirmEmail($request->username, $request->code);
            LogFacade::generateLog("password_recovery_via_email", $request->username . " : " . $result->message);
        }
        if (empty($result)){
            $result->status = 400;
            $result->message = '?????????? ???????? ??????.';
            LogFacade::generateLog("failed_recovery", $request->username . " : " . $result->message);
        }
        return json_encode([
            'status' => $result->status,
            'message' => $result->message,
        ]);
    }

    public function confirmEmailCode(ConfirmEmailCodeRequest $request)
    {
        $result = (object) array();
        $url = '';
        $result = IdentifierLoginFacade::confirmEmail($request->username, $request->code);
        if (empty($result)){
            $result->status = 400;
            $result->message = '?????????? ???????? ??????.';
            LogFacade::generateLog("failed_login", $request->username . " : " . $result->message);
        }elseif ($result->status == 200){
            $result = IdentifierLoginFacade::loginViaEmail($request->username);
            $url = IdentifierLoginFacade::redirectUserUrl($result);
            LogFacade::generateLog("login_via_email", $request->username . " : " . $result->message);
        }else{
            LogFacade::generateLog("failed_login", $request->username . " : " . $result->message);
        }
        return json_encode([
            'status' => $result->status,
            'message' => $result->message,
            'url' => $url
        ]);
    }

    public function changePassword(ChangePasswordRequest $request)
    {
        $type = $request->identifier_recovery_type;
        $username = $request->identifier_username;
        $url = '';
        $result = (object) array();
        if ($type == 'mobile'){
            $result = IdentifierLoginFacade::changePasswordViaMobile($username, $request->new_password);
            LogFacade::generateLog("password_recovery_via_sms", $username . " : " . $result->message);
        }
        if ($type == 'email'){
            $result = IdentifierLoginFacade::changePasswordViaEmail($username, $request->new_password);
            LogFacade::generateLog("password_recovery_via_email", $username . " : " . $result->message);
        }
        if (empty($result) || is_null($result)){
            $result->status = 400;
            $result->message = '?????????? ???????? ??????.';
            LogFacade::generateLog("failed_recovery", $username . " : " . $result->message);
        }else{
            $url = IdentifierLoginFacade::redirectUserUrl($result);
        }
        return json_encode([
            'status' => $result->status,
            'message' => $result->message,
            'url' => $url
        ]);
    }

    public function loginWithPassword(Request $request)
    {
        $request->validate([
            'identifier_username' => ['required', 'string'],
            'password' => ['required', 'min:6']
        ]);
        $username = $request->identifier_username;
        $url = '';
        $result = IdentifierLoginFacade::loginViaPassword($username,$request->password);
        if ($result->status == 200){
            $url = IdentifierLoginFacade::redirectUserUrl($result);
            LogFacade::generateLog("login_via_password");
        }else{
            LogFacade::generateLog("failed_login", $username . " : " . $result->message);
        }
        return json_encode([
            'status' => $result->status,
            'message' => $result->message,
            'url' => $url
        ]);
    }

    public function logout(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
