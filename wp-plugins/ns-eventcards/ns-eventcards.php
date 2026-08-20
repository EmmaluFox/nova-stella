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

/**
 * Optional social meta override — ensures a consistent share image.
 * This prints Open Graph and Twitter Card image tags using the logo you requested.
 * If you use an SEO plugin, it may override these; remove or disable this hook if so.
 */
function ns_eventcards_social_meta(){
    // Change this URL if you ever want a different preview image
    $img = 'https://novastella.co.uk/wp-content/uploads/2026/03/Logo-Black-Background.svg';
    // Title and description requested by site owner
    $title = 'Nova Stella';
    $desc = 'A series of live talks from key figures in the esoteric, pagan and magickal scene.';
    echo "\n<!-- NS Eventcards social meta -->\n";
    echo '<meta property="og:title" content="' . esc_attr($title) . '" />\n';
    echo '<meta property="og:description" content="' . esc_attr($desc) . '" />\n';
    echo '<meta property="og:image" content="' . esc_attr($img) . '" />\n';
    echo '<meta property="og:type" content="website" />\n';
    echo '<meta name="twitter:card" content="summary_large_image" />\n';
    echo '<meta name="twitter:title" content="' . esc_attr($title) . '" />\n';
    echo '<meta name="twitter:description" content="' . esc_attr($desc) . '" />\n';
    echo '<meta name="twitter:image" content="' . esc_attr($img) . '" />\n';
}
add_action('wp_head','ns_eventcards_social_meta', 5);
