jQuery(function($) {
	if ($(".content-loop").length > 0) {
		var loadMore = document.querySelector(".js-load-more");
		var count = $(".content-loop").data("count");
		var exclude = $(".content-loop").data("exclude");
		var post_type = $(".content-loop").data("type")
			? $(".content-loop").data("type")
			: "post";
		var count_offset = count - 1;
		var page = 2;
		var maxpage = skyloadmore.maxpage;
		var actual_pages = Math.ceil((skyloadmore.total - exclude.length) / count);
		var url = window.location.href;

		var loadMoreObserver = new IntersectionObserver(
			entries => {
				entries.forEach(entry => {
					loadMore.classList.remove("js-loaded");

					if (entry.intersectionRatio > 0) {
						var data = {
							action: "load_more_ajax",
							page: page,
							exclude: exclude,
							type: post_type
						};
						$.ajax({
							type: "POST",
							url: loadmore.url,
							data: data
						})
							.success(function(res) {
								$(".sky-content-loop").append(res.data);

								if (page >= maxpage || page >= actual_pages) {
									// If last page, remove "load more" node
									$(".js-load-more").remove();
								} else {
									loadMore.classList.add("js-loaded");
								}
								page = page + 1;
								count = count + count_offset;
							})
							.error(function(res) {
								$(".content-loop").append(res.responseText);
							});
					}
				});
			},
			{
				rootMargin: "0px 0px 0px 0px",
				threshold: 0
			}
		);

		document.querySelectorAll(".js-load-more").forEach(loader => {
			loadMoreObserver.observe(loader);
		});
	}
});
