<?php
/**
 * Paste this into your active theme's functions.php (prefer child theme).
 * Two options: simple enqueue for all pages, or conditional enqueue for the
 * 'upcoming-events' page only.
 */

// Option 1: Simple enqueue (loads on all pages)
function ns_enqueue_eventcards(){
    wp_enqueue_script(
        'ns-eventcards',
        'https://novastella.co.uk/wp-content/uploads/2026/03/eventcard-multi-elementor.js',
        array(),
        null,
        true
    );
}
add_action('wp_enqueue_scripts','ns_enqueue_eventcards');


// Option 2: Conditional enqueue (only on the Upcoming Events page)
/*
function ns_enqueue_eventcards_conditional(){
    if ( is_page('upcoming-events') ) {
        wp_enqueue_script(
            'ns-eventcards',
            'https://novastella.co.uk/wp-content/uploads/2026/03/eventcard-multi-elementor.js',
            array(),
            null,
            true
        );
    }
}
add_action('wp_enqueue_scripts','ns_enqueue_eventcards_conditional');
*/

// Notes:
// - Use a child theme when editing functions.php so updates won't be lost.
// - If you prefer hosting the JS in your theme, replace the URL above with
//   get_stylesheet_directory_uri() . '/js/eventcard-multi-elementor.js'
// - Clear caches after applying the change.
