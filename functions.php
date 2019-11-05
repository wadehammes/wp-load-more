<?php
  function load_more_ajax() {
  $all_post_args = array(
    'post_type' => esc_attr($_POST['type']),
    'post_status' => 'publish',
    'paged' => intval(esc_attr($_POST['page'])),
    'post__not_in' => array_map('intval', $_POST['exclude'])
  );

  $all_posts = new WP_Query($all_post_args);
  ob_start();
  
  while ($all_posts->have_posts()) :
    $all_posts->the_post();
    setup_postdata($all_posts->post->ID);
    get_template_part( 'partials/component', 'post-link');
  endwhile;

  wp_reset_query();
	$data = ob_get_clean();
	wp_send_json_success( $data );
	wp_die();
}
add_action('wp_ajax_load_more', 'load_more_ajax');
add_action('wp_ajax_nopriv_load_more', 'load_more_ajax');

function load_more_js() {
  $published_posts = wp_count_posts()->publish;
  $posts_per_page = get_option('posts_per_page');
  $page_number_max = ceil($published_posts / $posts_per_page);

	$args = array(
		'url' => admin_url('admin-ajax.php'),
    'maxpage' => $page_number_max,
    'total' => $published_posts
  );

  wp_enqueue_script('load-more', get_stylesheet_directory_uri() . '/library/vendor/loadposts.js', array( 'jquery' ), '1.0', true);
  wp_localize_script('load-more', 'loadmore', $args);
}
add_action('wp_enqueue_scripts', 'load_more_js', 100);

?>
