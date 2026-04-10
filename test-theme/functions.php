<?php
// some normal stuff

function bad_function_call() {
  eval('something');
  base64_decode('some string');
}
