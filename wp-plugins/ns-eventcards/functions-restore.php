<?php
/**
 * functions-restore.php
 *
 * Paste the contents of this file into your active theme's functions.php
 * (preferably a child theme). This file is intentionally minimal and
 * includes the enqueue used for the eventcard script.
 *
 * IMPORTANT: Back up your current functions.php on the server before
 * overwriting it.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // do not load directly
}

// ----- BEGIN: NS Eventcards enqueue (paste into functions.php) -----
function ns_enqueue_eventcards(){
    // If you placed the JS in your theme, replace the URL below with:
    // get_stylesheet_directory_uri() . '/js/eventcard-multi-elementor.js'
    wp_enqueue_script(
        'ns-eventcards',
        'https://novastella.co.uk/wp-content/uploads/2026/03/eventcard-multi-elementor.js',
        array(),
        null,
        true
    );
}
add_action('wp_enqueue_scripts','ns_enqueue_eventcards');
// ----- END: NS Eventcards enqueue -----

// Add other theme functions below as needed.
