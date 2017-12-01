<?php
class SessionObject
{
    public $vars;

    public function __construct() {
        $this->vars = &$_SESSION; 
    }
}


// $session = new SessionObject();
// $session->vars['value'] = "newValue";