// Config and Headers
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

// Plugins
window.Swal = require('sweetalert2');

window.alertify = require('alertifyjs/build/alertify.min');

require('lity/dist/lity.min');

require('jquery-ui/ui/effects/effect-slide');

$(function () {
    $('[data-toggle="tooltip"]').tooltip();

    $('.form-control').on('keydown', function(e){
        if(e.keyCode === 13){
            $(this).closest('.segment').find('.primary-btn').trigger('click');
        }
    });
});

const previous_pages = [];
const url_address = new URL(window.location.href);
let identifier_username = '';
let identifier_recovery_type = '';
let identifier_verified_recovery = '';

// forgot password handler
$('.open_recovery_not_reg').on('click', function (e) {
    e.preventDefault();
    openRecoveryPage('recovery', 'not_registered');
});

$('.open_recovery').on('click', function (e) {
    e.preventDefault();
    openRecoveryPage('recovery', 'default');
});

$('.forget_action').on('click', function (e) {
    e.preventDefault();
    startLoading();
    let username_input = $('.mobile_or_email').val();
    sendEmailOrSMS(username_input).done(function (response) {
        if (response.status === 200){
            identifier_username = username_input;
            identifier_recovery_type = response.type;
            if (response.status === 200){
                $('.user_info').html('('+ username_input +')');
                send_otp($('.recovery_timer'));
                toastr.success(response.message);
                openRecoveryCodePage('recovery_code', 'recovery');
            }
            stopLoading();
        }else {
            stopLoading();
            show_error_messages(response);
            toastr.error(response.message);
        }
    }).fail(function (response) {
        stopLoading();
        let msg = '';
        if (response.status === 0){
            msg = 'لطفا اتصال اینترنت را بررسی کنید.';
        }else if (response.status === 429){
            msg = 'خطا تعداد درخواست بالا. لطفا دقایقی دیگر مجددا امتحان کنید.';
        }else{
            show_error_messages(response);
            msg = 'لطفا خطاهای فرم را بررسی کنید.';
        }
        toastr.error(msg);
    });
});

$('.recovery_timer').on('click', function (e) {
    e.preventDefault();
    startLoading();
    sendEmailOrSMS(identifier_username).done(function (response) {
        stopLoading();
        if (response.status === 200){
            send_otp($('.recovery_timer'));
            toastr.success(response.message);
        }else {
            toastr.error(response.message);
        }
    }).fail(function (response) {
        stopLoading();
        let msg = '';
        if (response.status === 0){
            msg = 'لطفا اتصال اینترنت را بررسی کنید.';
        }else if (response.status === 429){
            msg = 'خطا تعداد درخواست بالا. لطفا دقایقی دیگر مجددا امتحان کنید.';
        }else{
            msg = 'لطفا خطاهای فرم را بررسی کنید.';
            show_error_messages(response);
        }
        toastr.error(msg);
    });
});

$('.confirm_recovery_code').on('click', function (e) {
    e.preventDefault();
    startLoading();
    let confirm_code = $('.recovery_code_input').val();

    confirmRecoveryCode(identifier_username,
        confirm_code, identifier_recovery_type)
        .done(function (code_result) {
            hide_error_messages();
            if (code_result.status === 200){
                identifier_verified_recovery = 'user_verified';
                openChangePasswordPage('change_password', 'recovery_code');
            }else {
                toastr.error(code_result.message);
                stopLoading();
            }
        }).fail(function (response) {
        stopLoading();
        let msg = '';
        if (response.status === 0){
            msg = 'لطفا اتصال اینترنت را بررسی کنید.';
        }else if (response.status === 429){
            msg = 'خطا تعداد درخواست بالا. لطفا دقایقی دیگر مجددا امتحان کنید.';
        }else{
            msg = 'لطفا خطاهای فرم را بررسی کنید.';
            show_error_messages(response);
        }
        toastr.error(msg);
    });
});

$('.change_password_btn').on('click', function (e) {
    e.preventDefault();
    startLoading();
    let new_pass = $('.recovery_new_password').val();
    let confirm_new_pass = $('.recovery_new_password_confirm').val();
    $.ajax({
        type: "post",
        url: baseUrl + '/auth/change/password',
        dataType: 'json',
        data: {
            'new_password': new_pass,
            'password_confirm': confirm_new_pass,
            'identifier_recovery_type': identifier_recovery_type,
            'identifier_username': identifier_username
        },
        success: function (response) {
            if (response.status === 200){
                window.location = response.url;
            }else {
                toastr.error(response.message);
                stopLoading();
            }
        },
        error: function (response) {
            stopLoading();
            let msg = '';
            if (response.status === 0){
                msg = 'لطفا اتصال اینترنت را بررسی کنید.';
            }else if (response.status === 429){
                msg = 'خطا تعداد درخواست بالا. لطفا دقایقی دیگر مجددا امتحان کنید.';
            }else{
                show_error_messages(response);
                msg = 'لطفا خطاهای فرم را بررسی کنید.';
            }
            toastr.error(msg);
        }
    });
});

function openRecoveryPage(current_page,previous_page) {
    change_url('','','/auth/recovery');
    slide_element(previous_page, current_page);
    previous_pages.push(previous_page);
    $('.mobile_or_email').focus();
}

$('.login_via_password').on('click', function (e) {
    e.preventDefault();
    openPasswordPage('password', 'code');
});

$('.login_email_via_password').on('click', function (e) {
    e.preventDefault();
    openPasswordPage('password', 'email_code');
});

$('.login_with_password').on('click', function (e) {
    e.preventDefault();
    startLoading();
    let password_input = $('.password_input').val();
    $.ajax({
        type: "post",
        url: baseUrl + getFullUrl('/auth/login/password'),
        dataType: 'json',
        data: {
            'identifier_username': identifier_username,
            'password': password_input,
        },
        success: function (response) {
            if (response.status === 200){
                window.location = response.url;
            }else {
                toastr.error(response.message);
                stopLoading();
            }
        },
        error: function (response) {
            stopLoading();
            let msg = '';
            if (response.status === 0){
                msg = 'لطفا اتصال اینترنت را بررسی کنید.';
            }else if (response.status === 429){
                msg = 'خطا تعداد درخواست بالا. لطفا دقایقی دیگر مجددا امتحان کنید.';
            }else{
                show_error_messages(response);
                msg = 'لطفا خطاهای فرم را بررسی کنید.';
            }
            toastr.error(msg);
        }
    });
});

function openPasswordPage(current_page,previous_page) {
    change_url('','','/auth/password');
    slide_element(previous_page, current_page);
    previous_pages.push(previous_page);
    $('.password_input').focus();
}

function openRecoveryCodePage(current_page,previous_page) {
    change_url('','','/auth/recovery_code');
    slide_element(previous_page, current_page);
    previous_pages.push(previous_page);
    $('.recovery_code_input').focus();
}

function openChangePasswordPage(current_page,previous_page) {
    change_url('','','/auth/change_password');
    slide_element(previous_page, current_page);
    previous_pages.push(previous_page);
    stopLoading();
}

// login and register handler
$('.create_account').on('click', function (e) {
    e.preventDefault();
    change_url('','','/auth/register');
    slide_element('default', 'register');
    previous_pages.push('default');
    $('.register_mobile').focus();
});

$('.account_login').on('click', function (e) {
    e.preventDefault();
    startLoading();
    let username = $('.username_input').val();
    alreadyRegisteredUsername(username).done(function (res) {
        hide_error_messages();
        if (res.status === 200){
            identifier_username = username;
            if (res.registeration_status === 'not_registered'){
                if (res.type === 'mobile'){
                    $('.mobile_num').html(username);
                    $('.not_registered_mobile').val(username);
                    change_url('','','/auth/not_registered');
                    slide_element('default', 'not_registered');
                    previous_pages.push('default');
                }else {
                    toastr.error('این ایمیل درسیستم ثبت نشده.');
                }
                stopLoading();
            }else {
                if (res.type === 'mobile'){
                    send_code_handler(username, 'code', 'default');
                }else {
                    send_email_handler(username, 'email_code', 'default');
                }
            }
        }else {
            stopLoading();
            toastr.error(res.message);
        }
    }).fail(function (response) {
        stopLoading();
        let msg = '';
        if(response.status === 0){
            msg = 'لطفا اتصال اینترنت را بررسی کنید.';
        }else if (response.status === 429){
            msg = 'خطا تعداد درخواست بالا. لطفا دقایقی دیگر مجددا امتحان کنید.';
        }else{
            show_error_messages(response);
            msg = 'لطفا خطاهای فرم را بررسی کنید.';
        }
        toastr.error(msg);
    });
});

$('.confirm_email_code').on('click', function (e) {
    e.preventDefault();
    startLoading();
    let confirm_code = $('.email_code_input').val();
    confirmEmailCode(identifier_username, confirm_code)
        .done(function (code_result) {
            hide_error_messages();
            if (code_result.status === 200){
                window.location = code_result.url;
            }else {
                toastr.error(code_result.message);
                stopLoading();
            }
        }).fail(function (response) {
        stopLoading();
        let msg = '';
        if(response.status === 0){
            msg = 'لطفا اتصال اینترنت را بررسی کنید.';
        }else if (response.status === 429){
            msg = 'خطا تعداد درخواست بالا. لطفا دقایقی دیگر مجددا امتحان کنید.';
        }else{
            show_error_messages(response);
            msg = 'لطفا خطاهای فرم را بررسی کنید.';
        }
        toastr.error(msg);

    });
});

$('.code_step').on('click', function (e) {
    e.preventDefault();
    startLoading();
    let mobile_num = $('.register_mobile').val();
    send_code_handler(mobile_num,'code', 'register');
});

function send_email_handler(username, current_page, previous_page) {
    sendEmailOrSMS(username).done(function (response) {
        if (response.status === 200){
            $('.user_info').html('('+ username +')');
            send_otp($('.recovery_timer'));
            toastr.success(response.message);
            change_url('','','/auth/' + current_page);
            slide_element(previous_page, current_page);
            previous_pages.push(previous_page);
            stopLoading();
        }else {
            stopLoading();
            toastr.error(response.message);
        }
    }).fail(function (response) {
        stopLoading();
        let msg = '';
        if (response.status === 0){
            msg = 'لطفا اتصال اینترنت را بررسی کنید.';
        }else if (response.status === 500){
            msg = 'خطایی در ارسال ایمیل رخ داده. لطفا چند دقیقه دیگر دوباره امتحان کنید یا به ما اطلاع دهید.';
        }else if (response.status === 429){
            msg = 'خطا تعداد درخواست بالا. لطفا دقایقی دیگر مجددا امتحان کنید.';
        }else {
            show_error_messages(response);
            msg = 'خطای غیره منتظره‌ای رخ داده.';
        }
        toastr.error(msg);
    });
}

function send_code_handler(mobile_num, current_page, previous_page) {
    sendCode(mobile_num).done(function (code_result) {
        identifier_username = mobile_num;
        if (code_result.status === 200){
            send_otp($('.otp_timer'));
            toastr.success(code_result.message);
            $('.mobile_num').html('(' + mobile_num + ')');
            stopLoading();
            change_url('','','/auth/code');
            slide_element(previous_page, current_page);
            previous_pages.push(previous_page);
            $('.user_input_code').focus();
        }else {
            stopLoading();
            toastr.error(code_result.message);
        }
    }).fail(function (response) {
        stopLoading();
        let msg = '';
        if (response.status === 0){
            msg = 'لطفا اتصال اینترنت را بررسی کنید.';
        }else if(response.status === 500){
            msg = 'خطایی در ارسال پیامک رخ داده. لطفا چند دقیقه دیگر دوباره امتحان کنید یا به ما اطلاع دهید.';
        }else if (response.status === 429){
            msg = 'خطا تعداد درخواست بالا. لطفا دقایقی دیگر مجددا امتحان کنید.';
        }else {
            show_error_messages(response);
            msg = 'لطفا خطاهای فرم را بررسی کنید.';
        }
        toastr.error(msg);
    });
}

$('.confirm_sms_code').on('click', function (e) {
    e.preventDefault();
    startLoading();
    let confirm_code = $('.user_input_code').val();
    confirmCode(identifier_username, confirm_code).done(function (code_result) {
        hide_error_messages();
        if (code_result.status === 200){
            window.location = code_result.url;
        }else {
            toastr.error(code_result.message);
            stopLoading();
        }
    }).fail(function (response) {
        stopLoading();
        let msg = '';
        if (response.status === 0){
            msg = 'لطفا اتصال اینترنت را بررسی کنید.';
        }else if (response.status === 429){
            msg = 'خطا تعداد درخواست بالا. لطفا دقایقی دیگر مجددا امتحان کنید.';
        }else {
            show_error_messages(response);
            msg = 'لطفا خطاهای فرم را بررسی کنید.';
        }
        toastr.error(msg);
    });
});

$('.otp_timer').on('click', function (e) {
    e.preventDefault();
    startLoading();
    sendCode(identifier_username).done(function (code_result) {
        hide_error_messages();
        if (code_result.status === 200){
            send_otp($('.otp_timer'));
            toastr.success(code_result.message);
        }else {
            toastr.error(code_result.message);
        }
        stopLoading();
    }).fail(function (res) {
        stopLoading();
        let msg = '';
        if (res.status === 0){
            msg = 'لطفا اتصال اینترنت را بررسی کنید.';
        }else if (res.status === 500){
            msg = 'خطایی در ارسال پیامک رخ داده. لطفا چند دقیقه دیگر دوباره امتحان کنید یا به ما اطلاع دهید.';
        }else if (res.status === 429){
            msg = 'خطا تعداد درخواست بالا. لطفا دقایقی دیگر مجددا امتحان کنید.';
        }else {
            show_error_messages(res);
            msg = 'لطفا خطاهای فرم را بررسی کنید.';
        }
        toastr.error(msg);
    });
});

$('.create_new_account').on('click', function (e) {
    e.preventDefault();
    startLoading();
    let mobile_num = $('.not_registered_mobile').val();
    send_code_handler(mobile_num,'code', 'not_registered');
});

let perv_page = '';
$('.back-btn').on('click', function (e) {
    e.preventDefault();
    let page_url = window.location.pathname;
    let page_type = page_url.replace('/auth/', '');
    if (page_type === 'default'){
        window.location = '/';
    }else {
        perv_page = previous_pages.pop();
        change_url('','','/auth/' + perv_page);
        back_slide_element(page_type, perv_page);
        hide_error_messages();
    }
    setFocusOnBack(page_type);
});

const setFocusOnBack = (page_type) => {
    switch (page_type) {
        case 'code':
        case 'recovery':
        case 'register':
            $('.username_input').focus();
            break;
        case 'password':
            $('.user_input_code').focus();
            break;
        case 'recovery_code':
            $('mobile_or_email').focus();
            break;
        default:
            return;
    }
}

// start helper functions

function slide_element(hide,show) {
    $('.' + hide).hide();
    $('.' + show).show();
}

function back_slide_element(hide,show) {
    $('.' + hide).hide();
    $('.' + show).show();
}

function change_url(data,title,url) {
    window.history.pushState(data, title, getFullUrl(url));
}

function getFullUrl(url) {
    let url_param = url_address.searchParams.get("back");
    let new_url = url;
    if (url_param !== null){
        new_url = url + '?back=' + url_param;
    }
    return new_url;
}

function hide_error_messages(){
    $('.form-group')
        .find('.invalid-feedback')
        .addClass('d-none')
        .find('strong').text('');
    $('.form-group')
        .find('.is-invalid')
        .removeClass('is-invalid');
}

function show_error_messages(res){
    let response = res;
    $('.form-group')
        .find('.invalid-feedback')
        .addClass('d-none')
        .find('strong').text('');
    $('.form-group').find('.is-invalid')
        .removeClass('is-invalid');
    if (response.status === 422) {
        for( const field_name in response.responseJSON.errors ){
            if(response.responseJSON.errors[field_name]) {
                let target = $('[name=' + field_name + ']');
                target.addClass('is-invalid');
                target.closest('.form-group')
                    .find('.invalid-feedback')
                    .removeClass('d-none')
                    .find('strong').text(response.responseJSON.errors[field_name]);
                [].forEach.call(document.querySelectorAll("input[type='file']"),
                    function(input) {
                        input = $(input);
                        if(input.data('name') === field_name){
                            input.addClass('is-invalid');
                            input.closest('.custom-file')
                                .find('.invalid-feedback')
                                .removeClass('d-none')
                                .find('strong').text(response.responseJSON.errors[field_name]);
                        }
                    });
            }
        }
    }
}

function sendCode(mobile_field) {
    return $.ajax({
        type: "post",
        url: baseUrl + '/auth/send/code',
        dataType: 'json',
        data: {
            'mobile': mobile_field
        }
    });
}

function alreadyRegisteredUsername(user_field) {
    return $.ajax({
        type: "post",
        url: baseUrl + '/auth/check/registered/user',
        dataType: 'json',
        data: {
            'username_input': user_field
        }
    });
}

function confirmCode(mobile,code) {
    return $.ajax({
        type: "post",
        url: baseUrl + getFullUrl('/auth/confirm/code'),
        dataType: 'json',
        data: {
            'mobile': mobile,
            'code': code
        }
    });
}

function confirmRecoveryCode(username,code,type) {
    return $.ajax({
        type: "post",
        url: baseUrl + getFullUrl('/auth/confirm/recovery'),
        dataType: 'json',
        data: {
            'username': username,
            'code': code,
            'type': type
        }
    });
}

function confirmEmailCode(username,code) {
    return $.ajax({
        type: "post",
        url: baseUrl + getFullUrl('/auth/confirm/email/code'),
        dataType: 'json',
        data: {
            'username': username,
            'code': code
        }
    });
}

function sendEmailOrSMS(username_input) {
    return $.ajax({
        type: "post",
        url: baseUrl + '/auth/check/username',
        dataType: 'json',
        data: {
            'username': username_input
        }
    });
}

function startLoading() {
    $('.loading_overlay').removeClass('d-none');
    $('.loading_overlay').addClass('d-flex');
}

function stopLoading() {
    $('.loading_overlay').removeClass('d-flex');
    $('.loading_overlay').addClass('d-none');
}
// end helper functions

//start timer
function send_otp(target) {
    target.prop("disabled",true);
    var min=2;
    var sec=0;
    target.find('.otp_timer_text').html('<span class="minutes">2</span>' + ':' + '<span class="seconds">0</span>');
    clearInterval(interval);
    start_count_down(min,sec,target);
}

var interval;
function start_count_down(minutes,seconds,target) {
    let sec = seconds;
    let min = minutes;
    var w1 = 0;
    interval = setInterval(() => {
        if (sec > 0) {
            sec -= 1;
        } else if (min >= 1) {
            min -= 1;
            sec = 59;
        } else {
            clearInterval(interval);
            // action
            target.find('.otp_timer_text').html('ارسال مجدد');
            target.prop("disabled",false);
        }
        target.find('.minutes').html(min);
        target.find('.seconds').html(sec);
    }, 1000);
}
//end timer
