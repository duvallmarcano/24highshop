---
title: "Cambodian All in one Growkit  - 24High"
description: "Cambodian All in one Growkit - 1200cc Buy online at 24High: ✔️ Simple ✔️ Fast and anonymous | Buy Online"
---
<div class="contentwrapper">
<div class="wrapper">
<script>
    dataLayer.push({
        ecommerce: null
    }); // Clear the previous ecommerce object.
    dataLayer.push({
        event: "view_item",
        ecommerce: {"items":[{"quantity":1,"price":34.95,"item_name":"Cambodian All in one Growkit - 1200cc","item_id":"7112958"}],"currency":"EUR","value":34.95}    });


    document.addEventListener("DOMContentLoaded", () => {
        const variantSelectorElem = document.getElementById("selectVariant");
        variantSelectorElem.addEventListener("change", () => {
            loadStockStatus();
            getArticlePricing();
        });

        const amountElem = document.getElementById("articleAmount");
        amountElem.addEventListener("change", () => {
            getArticlePricing();
        });

        setupImageViewer();
    });

    function setupImageViewer() {
        const mainImage = document.getElementById('main-product-image');
        const viewerContainer = document.getElementById('interactive-viewer-container');
        const thumbsContainer = document.querySelector('.imagebox__thumbscontainer');

        if (!thumbsContainer || !mainImage) {
            return;
        }

        let viewerInstance = null;

        /**
         * Initializes the 360 viewer with data from the provided element.
         * @param {HTMLElement} viewerTriggerElement - The thumbnail element with the data.
         */
        const init360Viewer = (viewerTriggerElement) => {
            const viewerData = JSON.parse(viewerTriggerElement.getAttribute('data-viewer-data'));

            mainImage.style.display = 'none';
            viewerContainer.style.display = 'block';

            const product360 = new Product360(viewerData);
            viewerInstance = new InteractiveViewer(viewerContainer, product360);
        };

        const initialThumb = thumbsContainer.querySelector('.imagebox__thumbnail');
        if (initialThumb && initialThumb.dataset.type === '360') {
            init360Viewer(initialThumb);
        }

        thumbsContainer.addEventListener('click', (e) => {
            const clickedThumb = e.target.closest('.imagebox__thumbnail');
            if (!clickedThumb) {
                return;
            }

            if (clickedThumb.dataset.type === '360') {
                const viewerData = JSON.parse(clickedThumb.getAttribute('data-viewer-data'));

                if (!viewerInstance) {
                    init360Viewer(clickedThumb);
                } else {
                    const product360 = new Product360(viewerData);
                    viewerInstance.swapObject(product360);
                }
            } else if (clickedThumb.dataset.url) {
                const staticImageUrl = clickedThumb.dataset.url;

                if (viewerInstance) {
                    const staticImageObject = new StaticImage({
                        imageUrl: staticImageUrl,
                        fit: 'contain'
                    });
                    viewerInstance.swapObject(staticImageObject);
                } else {
                    mainImage.src = staticImageUrl;
                }
            }
        });
    }

    function loadStockStatus() {
        const variantSelectorElem = document.getElementById("selectVariant");
        const stockStatusElem = document.getElementById("articleStockStatus");
        stockStatusElem.innerHTML = "<i class='fas fa-spinner fa-spin'></i>";

        new JsRequest({
                action: "getStockStatus",
                stockArticle: variantSelectorElem.value
            })
            .setLoader(false)
            .post(data => {
                stockStatusElem.innerHTML = data.html;
            });
    }

    function getArticlePricing() {
        const variantSelectorElem = document.getElementById("selectVariant");
        const articlePriceElem = document.getElementById("articlePrice");
        const articleAmountElem = document.getElementById("articleAmount");

        articlePriceElem.innerHTML += "<i class='fas fa-spinner fa-spin'></i>";

        new JsRequest({
                action: "getArticlePricing",
                pricingArticle: variantSelectorElem.value,
                amount: articleAmountElem.value
            })
            .setLoader(false)
            .post(data => {
                articlePriceElem.innerHTML = data.html;
            });
    }



    function loadReviews(page) {
        $("#review-container").html("<i class='fas fa-spin fa-circle-notch'></i>");

        $.jsResponseGet({
            action: "getReviews",
            page: page
        }, function(jsr) {
            $("#review-container").html(jsr.getData("html"));

            $(".reviewsPrev").prop("disabled", jsr.getData("isFirst"));
            $(".reviewsNext").prop("disabled", jsr.getData("isLast"));
        });
    }

    $(function() {

        $(".carousel").carousel({
            autoscroll: false
        });

        $(document).on("click", ".addCartBTN", function() {
            $("<div class='hidden addArticleToCart' data-novariant='true' data-articlenumber='" + $("#selectVariant").val() + "' data-amount='" + $("#articleAmount").val() + "' ></div>").appendTo("body").trigger("click");
        });

        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        // REVIEWS
        // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        var page = 0;
        loadReviews(page);

        $(document).on("click", ".rating__btn", function() {
            var $this = $(this);

            if (!$this.closest(".rating--btn").length) {
                return;
            }

            $this.closest(".rating").data("rating", $this.data("rating")).find(".rating__filled").width(($this.data("rating") * 100 / 5) + "%");
        });

        $(".reviewsPrev").click(function() {
            page--;
            if (page < 0) {
                page = 0;
            }
            loadReviews(page);
        });

        $(".reviewsNext").click(function() {
            page++;

            loadReviews(page);
        });

        $("#tabs_reviews").on("click", ".rating--btn .rating__btn", function() {
            var $this = $(this);
            var rating = $this.data("rating");
            var $loader = $.loader().start();

            $.jsResponsePost({
                action: "dialogAddRating",
                rating: rating
            }, function(jsr) {
                if (jsr.getData("loginrequired")) {
                    $.notification("Login is required", "warning");
                    $(".loginShowForm").first().trigger("click");
                    return;
                }

                var $form = $("<form></form>");
                var $rating = $("<input type='hidden' name='rating' value='" + rating + "' />");
                $form.append(jsr.getData("html"));
                $form.append($rating);

                $form.jsResponseForm({
                    action: "addRating"
                }, function(jsr2) {
                    loadReviews();
                });

                $.dialog($form, jsr.getData("title"), "primary")
                    .addButton("Save", "success", function() {
                        $rating.val($form.find(".rating").data("rating"));
                        $form.submit();
                    })
                    .addButton("Cancel", "danger")
                    .once();
            }, function() {
                $loader.stop();
            });

        });

    });
</script>
<script type="application/ld+json">
    {
        "@context": "http://schema.org/",
        "@type": "Product",
        "name": "Cambodian All in one Growkit ",
        "image": "https://www.24high.com/images/articles/image.php?id=4084&w=300&h=300",
        "description": "Cambodian mushroom Growkit\nThe Cubensis Cambodian magic mushrooms sit high in visuals and give a wonderful philosophical trip. These Cambodian mushrooms are great for some more experienced user who has already tripled a number of times with magic mushrooms. Buy the Cambodian mushrooms breeding set online now and enjoy a fine trip on this Cambodian magic mushroom.\nCambodian mushroom Grow Kit for novice psychonauts\nCambodian magic mushrooms are ideally suited for a second or third trip on magic mushrooms. This magic mushroom is on average strong and yet this magic mushroom introduces you to the magical world of tripping in a subtle way. That is why we certainly recommend Cambodian magic mushrooms for the more experienced psychonauts. In addition, these Cambodian magic mushrooms are also very easy to grow. There is actually little wrong and therefore perfect for a first experience for growing magic mushrooms.\nEffects Cambodian magic mushrooms\nThe Cambodian magic mushrooms give an effect and a trip that fits the wishes of an average user of magic mushrooms. You'll  notice the power of tripping on magic mushrooms. The Cambodian mushroom is ideal as a stepping stone if you've already met the world of entheogenic resources once before. The Cambodian magic mushrooms give beautiful visual effects. Colours that you get differently, sounds that sound different, and often you have a different view of life during your trip. This may be that you come to the conclusion that a human being is just a collection of memories.\nYou can expect the following effects on a Cambodian mushroom trip:\n\nColours that are experienced differently\nSounds and voices that come in differently\nLosing the sense of time for a short time\nDifficulty in correctly pronouncing sentences and words\nSometimes not realizing that you are standing, sitting or lying at that moment\nAn experiencing a new outlook on life\n\nCambodian mushrooms are mostly strong on average, yet we advise you to prepare well before you start a trip. More about this later.\nDosage of Cambodian magic mushrooms\nThe amount of magic mushrooms you take depends on the type of trip you are looking for. In addition, your body weight, experience with magic mushrooms and how much you ate also play a role.\n\nMicrodosing: 0.2 grams of dried mushrooms 2 grams of fresh mushrooms. Mild trip: 1 gram of dried mushrooms 9 grams of fresh mushrooms\nNormal trip: 2 grams of dried mushrooms | 21 grams of fresh mushrooms Intense trip: 3.5 grams of dried mushrooms 35 grams of fresh mushrooms\n\nIf you weigh a bit heavier, you may prefer to take more mushrooms than the above example. Either way, one person is not the other. So feel for yourself what the best amount is for you by gaining experiences. You can eat the mushrooms or take tea as a mushroom. Make sure you only add the mushrooms to the hot water when it no longer boils. Boiling water can affect the psychoactive substances. If the mushrooms have been in the hot water for 20 minutes you can drink the tea.\nPreparing for a Cambodian mushroom trip\nTripping is best done in a safe, trusted and pleasant environment. It is important that you are relaxed and able to let things go well during your trip. This only works if you are comfortable and feel safe enough to surrender to the trip. To achieve this, you need the following: Choose friends to trip with that you fully trust. So these are friends who try to help you when needed. Often enough they have their hands full on their own trip, although this is not so bad with the Cambodian mushrooms. That is why it is wise to always have a sober friend in the room. So he did not drink and did not use magic mushrooms. He can help you realize that the mushroom trip will stop in a few hours. Sometimes that is difficult to realize during the trip. In addition, we strongly advise you to have a trip stopper at home. You do not always have to use this, but having it at home alone gives you a relaxed feeling. You know that when the trip gets a little too exciting you can remove the sharp edges by using the trip stopper. Not to forget this, it is good to inform the trip sitter.\nGrowing Cambodian mushrooms\nWith the Cambodian mushroom all-in -one grow kit is now very easy for you to grow Cambodian magic mushrooms yourself. These magic mushrooms are so easy to grow that anyone can do this. All materials are present in the box. You also get a simple step-by-step plan so that you can grow your mushrooms simply and quickly.\nThe 9-step plan for Cambodian mushrooms grow kit\nWith the step-by-step plan below you can maximize your mushroom harvest. This way you have more mushrooms so that you can enjoy a trip more often or with several friends.\nDOWNLOAD HERE: ANIMATED SET-UP INSTRUCTIONS GROWKIT PDF \nThe harvest: carefully grasp the handle, gently turn the handle left and right and pull then release it very quietly, Try to pull the mushroom out as completely as possible carefully. In this way it is possible that new mushrooms will grow again.\nContent of your Cambodian Growkit\nWhen you buy your Cambodian Growkit, you will receive it quickly at home. You can then start growing mushrooms. You will find the following materials in your Cambodian Grow Kit:\n\nPsilocybe Cambodiescens 1200 or 2100 cc\nGrowkit\nBreeding instructions\n\nThe harvest of your Cambodian magic mushroom grow kit\nAfter growing your Cambodian magic mushrooms in a professional manner, it is time to harvest them. But how many magic mushrooms do you actually get from a magic mushroom grow set? The mushroom grow kit is available in two sizes, 1200 cc and 2100 cc.\n\n1200 cc Cambodian mushroom grow kit yields 400 grams of magic mushrooms\n2100 cc Cambodian mushroom grow kit yields 800 grams of magic mushrooms\n\nHowever, this does not mean this is all. You can use a mushroom grow kit multiple times. So you can grow these numbers of mushrooms multiple times. Often this succeeds once or 4. So you can make multiple philosophical or spiritual flights. That is why they call a mushroom grow kit a flight or a flush. How many flushes you get from the magic mushroom grow set depends entirely on the care you put into growing the magic mushrooms. The more carefully you handle this, the more magic mushrooms you can grow. Cambodian magic mushrooms, very pleasant to grow. They are one of the easiest magic mushrooms to grow. So a must for starting growers. The Cubensis Cambodian mushrooms give large flushes, or harvest. Very nice of course, but they grow a little slower than other magic mushrooms. The hats of the magic mushrooms are conical and therefore reminiscent of the Asian hats that people wear.\nSave your Cambodian mushroom grow kit\nSince it is about a fresh product, we advise you to set up your mushroom grow kit immediately. This way you can achieve the best results and ensure a nice mushroom harvest. You can keep most mushroom grow kits in the fridge for about 3 to 6 months before you start growing. Check the expiration date on the packaging for this.\nOrigin of the Cambodian mushrooms\nThe first discovery of the Cambodian mushrooms was made in Southeast Asia. John Allen discovered them near the Angkor Watt temple. This happened during one of his trips to Cambodia. It was used in Cambodia during spiritual ceremonies and rituals.\nBuy your Cambodian magic mushroom grow kit online\nSo if you are a novice psychonaut, we recommend you the Cambodian mushroom grow kit. They are easy to grow and give an average strong trip that is perfect for getting acquainted with the world of psychoactive substances. Buy your Cambodian magic mushroom grow kit online now.",
         "brand": {
                "@type": "Brand",
                "name": "growkit, cambodian"
            },
         "sku": "7112958",
        "gtin13": "",
        "mpn": "11204",
        "offers": {
            "@type": "Offer",
            "priceCurrency": "EUR",
            "price": "34.95",
            "itemCondition": "http://schema.org/NewCondition",
            "availability": "http://schema.org/InStock",
            "url": "https://www.24high.com/en/article/7112958-cambodian-all-in-one-growkit-1200cc?setlang=en&article=7112958-cambodian-all-in-one-growkit-1200cc",
            "seller": {
                "@type": "Organization",
                "name": "24High"
            }
        }
            }
</script>
<div class="content">
<h1 class="h1 h1--line" style="color: rgb(101,101,101);">Cambodian All in one Growkit </h1>
<div class="columns columns--mobile800">
<div class="columns__column">
<div class="imagebox">
<div class="imagebox__maincontainer">
<img alt="Cambodian All in one Growkit " class="imagebox__mainimage" id="main-product-image" src="../../images/articles/image.php@id=4084&amp;w=1000&amp;h=1000">
<div id="interactive-viewer-container" style="display: none; width: 100%; height: 100%;"></div>
</img></div>
<div class="imagebox__thumbscontainer">
<div class="imagebox__thumbnail" data-url="https://www.24high.com/images/articles/image.php?id=4084&amp;w=1000&amp;h=1000"> <img alt="" src="../../images/articles/image.php@id=4084&amp;w=200&amp;h=200"/></div><div class="imagebox__thumbnail" data-url="https://www.24high.com/images/articles/image.php?id=4085&amp;w=1000&amp;h=1000"> <img alt="" src="../../images/articles/image.php@id=4085&amp;w=200&amp;h=200"/></div><div class="imagebox__thumbnail" data-url="https://www.24high.com/images/articles/image.php?id=2325&amp;w=1000&amp;h=1000"> <img alt="" src="../../images/articles/image.php@id=2325&amp;w=200&amp;h=200"/></div> </div>
</div>
</div>
<div class="columns__column columns__column--grow" style="padding-left: 10px;">
<div class="fx fx--ai-center">
<a class="a a--hover-primary fx__i" href="7112958-cambodian-all-in-one-growkit-1200cc.html#" onclick="$('#reviewtabbtn').click().get(0).scrollIntoView();
                        return false;"><div class="rating" data-rating="0">
<span class="rating__empty">
<span class="rating__btn" data-rating="1"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="2"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="3"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="4"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="5"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span>
</span>
<div class="rating__filled" style="width: 0%;">
<div class="rating__filcont">
<svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg>
</div>
</div>
</div> ()</a>
<div class="fx__i">Article number: 7112958</div>
</div>
<br/>
<div id="articlePrice">
<span class="text-bold font-2x">€ 34,95</span> (Incl.VAT)            </div>
<br/><br/>
<br>
<div id="articleStockStatus"><i class="fa fa-check success"></i> In stock</div>
<br/>
<div class="fx__i"><select class="input input--w100" id="selectVariant" name="variation"><option value="7112958">Cambodian All in one Growkit - 1200cc</option><option value="8108405">Cambodian All in one Growkit - 2100cc</option></select></div>
<div class="fx">
<div class="inputstack fx" style="width: 100%;">
<button class="inputstack__btn btn btn--default font-p30" onclick="this.nextElementSibling.value = this.nextElementSibling.value &gt; 1 ? parseInt(this.nextElementSibling.value) - 1 : 1; this.nextElementSibling.dispatchEvent(new Event('change'));">-</button>
<input class="inputstack__input text-center input input--xs font-p30" id="articleAmount" placeholder="Amount" step="1" style="max-width: 50px;" type="number" value="1"/>
<button class="inputstack__btn btn btn--default font-p30" onclick="this.previousElementSibling.value = this.previousElementSibling.value === '' ? 1 : (parseInt(this.previousElementSibling.value) + 1); this.previousElementSibling.dispatchEvent(new Event('change'));">+</button>
<span class="fx__i inputstack__btn btn btn--shoppingcart addCartBTN text-center font-p30">
<i class="fa fa-shopping-cart"></i> Add to shopping cart                    </span>
</div>
</div>
<br>
<br>
<br/>
</br></br></br></div>
</div>
<br/>
<div class="tabs tabs--secondary tabs--bordered tabs--noclose">
<div class="tabs__bar">
<div class="tabs__button tabs__button--init tabs__button--secondary" data-tabscontent="#tabs_description"><i class="fas fa-info-circle fa-fw"></i> Description</div>
<div class="tabs__button" data-tabscontent="#tabs_92"><i class="far fa-info-circle fa-fw"></i> Warning</div><div class="tabs__button" data-tabscontent="#tabs_868"><i class="far fa-info-circle fa-fw"></i> Delivery</div> <div class="tabs__button tabs__button--secondary" data-tabscontent="#tabs_reviews" id="reviewtabbtn"><i class="fas fa-star fa-fw"></i> Reviews</div>
</div>
<div class="tabs__content" id="tabs_description" style="padding: 10px;">
<h2>Cambodian mushroom Growkit</h2>
<p>The Cubensis Cambodian magic mushrooms sit high in visuals and give a wonderful philosophical trip. These Cambodian mushrooms are great for some more experienced user who has already tripled a number of times with magic mushrooms. Buy the Cambodian mushrooms breeding set online now and enjoy a fine trip on this Cambodian magic mushroom.</p>
<h2>Cambodian mushroom Grow Kit for novice psychonauts</h2>
<p>Cambodian magic mushrooms are ideally suited for a second or third trip on magic mushrooms. This magic mushroom is on average strong and yet this magic mushroom introduces you to the magical world of tripping in a subtle way. That is why we certainly recommend Cambodian magic mushrooms for the more experienced psychonauts. In addition, these Cambodian magic mushrooms are also very easy to grow. There is actually little wrong and therefore perfect for a first experience for growing magic mushrooms.</p>
<h2>Effects Cambodian magic mushrooms</h2>
<p>The Cambodian magic mushrooms give an effect and a trip that fits the wishes of an average user of magic mushrooms. You'll  notice the power of tripping on magic mushrooms. The Cambodian mushroom is ideal as a stepping stone if you've already met the world of entheogenic resources once before. The Cambodian magic mushrooms give beautiful visual effects. Colours that you get differently, sounds that sound different, and often you have a different view of life during your trip. This may be that you come to the conclusion that a human being is just a collection of memories.</p>
<p>You can expect the following effects on a Cambodian mushroom trip:</p>
<ul>
<li>Colours that are experienced differently</li>
<li>Sounds and voices that come in differently</li>
<li>Losing the sense of time for a short time</li>
<li>Difficulty in correctly pronouncing sentences and words</li>
<li>Sometimes not realizing that you are standing, sitting or lying at that moment</li>
<li>An experiencing a new outlook on life</li>
</ul>
<p>Cambodian mushrooms are mostly strong on average, yet we advise you to prepare well before you start a trip. More about this later.</p>
<h2>Dosage of Cambodian magic mushrooms</h2>
<p>The amount of magic mushrooms you take depends on the type of trip you are looking for. In addition, your body weight, experience with magic mushrooms and how much you ate also play a role.</p>
<ul>
<li>Microdosing: 0.2 grams of dried mushrooms 2 grams of fresh mushrooms. Mild trip: 1 gram of dried mushrooms 9 grams of fresh mushrooms</li>
<li>Normal trip: 2 grams of dried mushrooms | 21 grams of fresh mushrooms Intense trip: 3.5 grams of dried mushrooms 35 grams of fresh mushrooms</li>
</ul>
<p>If you weigh a bit heavier, you may prefer to take more mushrooms than the above example. Either way, one person is not the other. So feel for yourself what the best amount is for you by gaining experiences. You can eat the mushrooms or take tea as a mushroom. Make sure you only add the mushrooms to the hot water when it no longer boils. Boiling water can affect the psychoactive substances. If the mushrooms have been in the hot water for 20 minutes you can drink the tea.</p>
<h2>Preparing for a Cambodian mushroom trip</h2>
<p>Tripping is best done in a safe, trusted and pleasant environment. It is important that you are relaxed and able to let things go well during your trip. This only works if you are comfortable and feel safe enough to surrender to the trip. To achieve this, you need the following: <br/><br/>Choose friends to trip with that you fully trust. So these are friends who try to help you when needed. Often enough they have their hands full on their own trip, although this is not so bad with the Cambodian mushrooms. That is why it is wise to always have a sober friend in the room. So he did not drink and did not use magic mushrooms. He can help you realize that the mushroom trip will stop in a few hours. Sometimes that is difficult to realize during the trip. <br/><br/>In addition, we strongly advise you to have a trip stopper at home. You do not always have to use this, but having it at home alone gives you a relaxed feeling. You know that when the trip gets a little too exciting you can remove the sharp edges by using the trip stopper. Not to forget this, it is good to inform the trip sitter.</p>
<h2>Growing Cambodian mushrooms</h2>
<p>With the Cambodian mushroom all-in -one grow kit is now very easy for you to grow Cambodian magic mushrooms yourself. These magic mushrooms are so easy to grow that anyone can do this. All materials are present in the box. You also get a simple step-by-step plan so that you can grow your mushrooms simply and quickly.</p>
<h2>The 9-step plan for Cambodian mushrooms grow kit</h2>
<p>With the step-by-step plan below you can maximize your mushroom harvest. This way you have more mushrooms so that you can enjoy a trip more often or with several friends.</p>
<p><span style="font-weight: bold;">DOWNLOAD HERE: <span style="color: #0907f5;"><a href="../files/index.html@id=1173.pdf&amp;file=GrowKit_instructies_Allinone_EN.pdf" rel="noopener" style="color: #0907f5;" target="_blank">ANIMATED SET-UP INSTRUCTIONS GROWKIT PDF</a> </span></span></p>
<p><strong>The harvest</strong>: carefully grasp the handle, gently turn the handle left and right and pull then release it very quietly, Try to pull the mushroom out as completely as possible carefully. In this way it is possible that new mushrooms will grow again.</p>
<h2>Content of your Cambodian Growkit</h2>
<p>When you buy your Cambodian Growkit, you will receive it quickly at home. You can then start growing mushrooms. You will find the following materials in your Cambodian Grow Kit:</p>
<ul>
<li>Psilocybe Cambodiescens 1200 or 2100 cc</li>
<li>Growkit</li>
<li>Breeding instructions</li>
</ul>
<h2>The harvest of your Cambodian magic mushroom grow kit</h2>
<p>After growing your Cambodian magic mushrooms in a professional manner, it is time to harvest them. But how many magic mushrooms do you actually get from a magic mushroom grow set? The mushroom grow kit is available in two sizes, 1200 cc and 2100 cc.</p>
<ul>
<li>1200 cc Cambodian mushroom grow kit yields 400 grams of magic mushrooms</li>
<li>2100 cc Cambodian mushroom grow kit yields 800 grams of magic mushrooms</li>
</ul>
<p>However, this does not mean this is all. You can use a mushroom grow kit multiple times. So you can grow these numbers of mushrooms multiple times. Often this succeeds once or 4. So you can make multiple philosophical or spiritual flights. That is why they call a mushroom grow kit a flight or a flush. How many flushes you get from the magic mushroom grow set depends entirely on the care you put into growing the magic mushrooms. The more carefully you handle this, the more magic mushrooms you can grow. <br/><br/>Cambodian magic mushrooms, very pleasant to grow. They are one of the easiest magic mushrooms to grow. So a must for starting growers. The Cubensis Cambodian mushrooms give large flushes, or harvest. Very nice of course, but they grow a little slower than other magic mushrooms. The hats of the magic mushrooms are conical and therefore reminiscent of the Asian hats that people wear.</p>
<h2>Save your Cambodian mushroom grow kit</h2>
<p>Since it is about a fresh product, we advise you to set up your mushroom grow kit immediately. This way you can achieve the best results and ensure a nice mushroom harvest. You can keep most mushroom grow kits in the fridge for about 3 to 6 months before you start growing. Check the expiration date on the packaging for this.</p>
<h2>Origin of the Cambodian mushrooms</h2>
<p>The first discovery of the Cambodian mushrooms was made in Southeast Asia. John Allen discovered them near the Angkor Watt temple. This happened during one of his trips to Cambodia. It was used in Cambodia during spiritual ceremonies and rituals.</p>
<h2>Buy your Cambodian magic mushroom grow kit online</h2>
<p>So if you are a novice psychonaut, we recommend you the Cambodian mushroom grow kit. They are easy to grow and give an average strong trip that is perfect for getting acquainted with the world of psychoactive substances. Buy your Cambodian magic mushroom grow kit online now.</p> </div>
<div class="tabs__content" id="tabs_92" style="padding: 10px;">Magic mushrooms can be dangerous to health when you combine it with certain medications, alcohol or with MAO inhibitors. Are you using drugs? Always consult your doctor first and read the package insert of your medicine to prevent health risks. DO NOT use the magic mushrooms if you are pregnant or breast-feeding. Treat these unique Magic Mushrooms with respect and use them only when you are in a positve mood and a peaceful environment. Do NOT go driving vehicles or participate in traffic !</div><div class="tabs__content" id="tabs_868" style="padding: 10px;">24High only ship to countries within Europe. 24High cannot provide information about the status, legal or illegal, about the product in other countries. Not sure if the ordered product is legal in the country where it should be sent? Inform yourself about this issue with the authorities of the country itself. Buyer bears responsibility. All our products are shipped in discreet packaging.<br/><br/>If it happens(most unlikely) that your grow kit is longer on the road than delivery days indicated by the outsourced logistics service, please contact us. If a grow kit is on the road for more than 2 weeks, it may happen that the grow kit no longer works. Therefore, once you have received the grow kit, it is important to place it in the refrigerator for 24 hours before before setting it up. Take photos of setting up and of the grow kit and photos after 2.5 weeks of growth. Mail these photos to support@24high.nl. We will decide on the basis of the photos whether you are entitled to a discount or get the full purchase amount refunded in the form of a credit that can only be spent on www.24high.com/en. Of course we also offer an Express shipping service that guarantees that even in these warm summer months a sensitive product such as the grow kit arrives in perfect condition, there are extra costs involved, but the delivery time is many times shorter.<br/></div>
<div class="tabs__content" id="tabs_reviews" style="padding: 10px;">
            Add review:
            <div class="rating rating--btn">
<span class="rating__btn" data-rating="1"><i class="fas fa-star fa-fw"></i></span><span class="rating__btn" data-rating="2"><i class="fas fa-star fa-fw"></i></span><span class="rating__btn" data-rating="3"><i class="fas fa-star fa-fw"></i></span><span class="rating__btn" data-rating="4"><i class="fas fa-star fa-fw"></i></span><span class="rating__btn" data-rating="5"><i class="fas fa-star fa-fw"></i></span>
</div>
<div id="review-container"></div>
<div class="fx">
<div class="fx__i"><button class="btn btn--secondary reviewsPrev"><i class="fas fa-chevron-left"></i></button></div>
<div class="fx__i text-right"><button class="btn btn--secondary reviewsNext"><i class="fas fa-chevron-right"></i></button></div>
</div>
</div>
</div>
<br>
<div>
<h3>Similar items</h3><div class="carousel"></div> </div>
</br></div>
<div class="clear"></div>
</div>
</div>