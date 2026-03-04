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
    // Prefer plugin-bundled script; fall back to uploads URL if file missing
    $handle = 'ns-eventcards';
    $src_local = plugin_dir_url(__FILE__) . 'eventcard-multi-elementor.js';
    $src_uploads = 'https://novastella.co.uk/wp-content/uploads/2026/03/eventcard-multi-elementor.js';

    if ( file_exists( plugin_dir_path(__FILE__) . 'eventcard-multi-elementor.js' ) ) {
        wp_enqueue_script( $handle, $src_local, array(), null, true );
    } else {
        wp_enqueue_script( $handle, $src_uploads, array(), null, true );
    }
}
add_action('wp_enqueue_scripts','ns_eventcards_enqueue');

// Optional: only load on the upcoming events page by slug
/*
function ns_eventcards_enqueue_conditional(){
    if ( is_page('upcoming-events') ) ns_eventcards_enqueue();
}
add_action('wp_enqueue_scripts','ns_eventcards_enqueue_conditional');
*/
