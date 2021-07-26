<?php

namespace Sinarajabpour1998\Identifier\View\Components;

use Illuminate\View\Component;

class LoginComponent extends Component
{
    public $page;

    /**
     * Create a new component instance.
     *
     * @return void
     */
    public function __construct($page)
    {
        $this->page = $page;
    }

    public function render()
    {
        return view('vendor.identifier.components.login-component');
    }
}
