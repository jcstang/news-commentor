$(document).ready(function () {
    console.log('jquery loaded');

    $('.scrape-new-data').on('click', scrapeArticleHandler);
    $('.save-article-btn').on('click', saveArticleHandler);



    function saveArticleHandler() {
        console.log('ive been clicked! - save article button');
        // TODO: update the article data isSaved (via ajax?)
        // TODO: get data-article id
        let lookupId = $(this).attr('data-article');
        console.log(lookupId);

        $.ajax({
            url: '/api/article',
            type: 'PUT',
            data: {
                _id: lookupId
            },
            success: function (result) {
                console.log(result);
                // TODO: display a success message or failed message
            }
        });
    }

    function scrapeArticleHandler() {
        console.log('ive been clicked! - scrape article button');

    }

});
