<?php
/**
 * Plugin Name: NS Eventcards
 * Description: Enqueue eventcard script (loads events from central JSON).
 * Version: 1.0.0
 * Author: Automated Helper
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

function ns_eventcards_enqueue(){
    // Canonical source lives in uploads
    wp_enqueue_script(
        'ns-eventcards',
        'https://novastella.co.uk/wp-content/uploads/2026/03/eventcard-multi-elementor.js',
        array(),
        null,
        true
    );
}
add_action('wp_enqueue_scripts','ns_eventcards_enqueue');

// Optional: only load on the upcoming events page by slug
/*
function ns_eventcards_enqueue_conditional(){
    if ( is_page('upcoming-events') ) ns_eventcards_enqueue();
}
add_action('wp_enqueue_scripts','ns_eventcards_enqueue_conditional');
*/
