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

/**
 * Output basic Open Graph and Twitter Card meta tags using the WP custom logo
 * Falls back to site icon or a hard-coded image if no logo is set.
 */
function ns_eventcards_social_meta(){
    if ( is_admin() ) return;

    // Title: prefer post title for singular, otherwise site name
    if ( is_singular() ) {
        $og_title = single_post_title('', false);
    } else {
        $og_title = get_bloginfo('name');
    }

    // Description: prefer excerpt for singular, otherwise site tagline
    if ( is_singular() ) {
        global $post;
        setup_postdata( $post );
        $desc = has_excerpt( $post ) ? get_the_excerpt( $post ) : ''; 
        wp_reset_postdata();
    } else {
        $desc = get_bloginfo('description');
    }

    // Image: prefer theme custom logo, then site icon, then a sensible fallback
    $image = '';
    $logo_id = get_theme_mod('custom_logo');
    if ( $logo_id ) {
        $image = wp_get_attachment_image_url( $logo_id, 'full' );
    }
    if ( ! $image ) {
        $site_icon = get_site_icon_url();
        if ( $site_icon ) $image = $site_icon;
    }
    if ( ! $image ) {
        $image = 'https://novastella.co.uk/wp-content/uploads/2026/03/Logo-Black-Background.png';
    }

    $url = ( is_singular() ? get_permalink() : home_url() );

    // Output meta tags (minimal set)
    // Avoid printing a leading newline to prevent accidental output before the DOCTYPE.
    echo '<!-- NS Eventcards social meta -->';
    echo '<meta property="og:title" content="' . esc_attr( $og_title ) . '" />\n';
    if ( $desc ) echo '<meta property="og:description" content="' . esc_attr( $desc ) . '" />\n';
    echo '<meta property="og:image" content="' . esc_url( $image ) . '" />\n';
    echo '<meta property="og:url" content="' . esc_url( $url ) . '" />\n';
    echo '<meta property="og:type" content="website" />\n';
    echo '<meta name="twitter:card" content="summary_large_image" />\n';
    echo '<meta name="twitter:image" content="' . esc_url( $image ) . '" />\n';
    echo '<!-- /NS Eventcards social meta -->';
}
add_action( 'wp_head', 'ns_eventcards_social_meta', 5 );

// Optional: only load on the upcoming events page by slug
/*
function ns_eventcards_enqueue_conditional(){
    if ( is_page('upcoming-events') ) ns_eventcards_enqueue();
}
add_action('wp_enqueue_scripts','ns_eventcards_enqueue_conditional');
*/
