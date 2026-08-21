---
title: "iMicrodose - 24High"
description: "iMicrodose - Triniti Buy online at 24High: ✔️ Simple ✔️ Fast and anonymous | Buy Online"
---
<div class="contentwrapper">
<div class="wrapper">
<script>
    dataLayer.push({
        ecommerce: null
    }); // Clear the previous ecommerce object.
    dataLayer.push({
        event: "view_item",
        ecommerce: {"items":[{"quantity":1,"price":17.5,"item_name":"iMicrodose - Triniti","item_id":"5201908"}],"currency":"EUR","value":17.5}    });


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
        "name": "iMicrodose",
        "image": "https://www.24high.com/images/articles/image.php?id=4811&w=300&h=300",
        "description": "iMicrodose is a microdosing kit with carefully selected psilocybin truffles. The kit is designed for people who want to explore microdosing in a practical and controlled way. Thanks to the resealable packaging, you can easily measure a small amount and store the remaining truffles safely for later use.\nMicrodosing with truffles means taking a very small amount of psilocybin, so you do not experience a full psychedelic trip but may notice subtle changes in focus, creativity, and mood.\nThe truffles in the iMicrodose kits are naturally grown without artificial additives. The compact portions of 5 grams make it easy to experiment with a microdosing schedule and discover which amount works best for you.\nWant to learn more about microdosing? Read our guide What is microdosing? or explore all products in the category microdosing truffles.\nWhat is iMicrodose?\niMicrodose is a microdosing kit with psilocybin truffles specially designed for people who want to explore microdosing. The kit contains small portions of 5 grams of truffles, allowing you to easily measure a microdose and try different schedules.\nMicrodosing means using a very small amount of truffles. The dose is much lower than with a full psychedelic experience. As a result, the effects usually remain subtle and you can often continue with your daily activities.\nThe iMicrodose kits come in a resealable package. This allows you to take a small portion of truffles and store the rest in a cool place to keep them fresh for later use.\nAt 24High, we see that microdosing is especially popular among people who want to become familiar with psilocybin truffles in a calm and controlled way.\nWhich iMicrodose variants are available?\nThe iMicrodose kits are available in four different variants. Each variant contains a different combination of truffle species so you can discover which one suits your preference best.\nTRINITI\nThe TRINITI kit contains three different truffle varieties. This variant is often chosen by people who want to compare multiple species.\n\n5 grams of Galindoi truffles\n5 grams of Mexicana truffles\n5 grams of Tampanensis truffles\n\nORIGINAL\nThe ORIGINAL variant contains only Galindoi truffles. This species is known for its accessible character and is often used in microdosing schedules.\n\n3 &times; 5 grams of Galindoi truffles\n\nMINDFULI\nMINDFULI is composed of Mexicana truffles. This species is often chosen by people who want to combine microdosing with moments of reflection or creativity.\n\n3 &times; 5 grams of Mexicana truffles\n\nUNITI\nThe UNITI kit contains only Tampanensis truffles. This species is known for its balanced character and is often used in structured microdosing schedules.\n\n3 &times; 5 grams of Tampanensis truffles\n\nHow do you use iMicrodose truffles?\nThe iMicrodose kits are developed for microdosing. When microdosing, you take a small amount of psilocybin truffles so the effects usually remain subtle. Many people use microdosing as a calm way to become familiar with truffles without experiencing a full psychedelic journey.\nBecause everyone reacts differently to psilocybin, it is wise to always start with a low amount and carefully observe how your body and mind respond.\n1. Determine your starting dose\nMany users begin with about 1 gram of fresh truffles. Depending on personal sensitivity, a microdose can range between about 0.5 and 1.5 grams.\nWant to get an indication of a possible dosage? Use our calculator:\nMicrodosing dosage calculator\n  \n\nDosageCalculator &gt;&gt;\n\n\n\n2. Commonly used microdosing schedule\nA commonly used microdosing schedule is to take a small dose on one day and then take two days off. This gives the body time to process the effects and usually helps prevent tolerance from building up too quickly.\nThis schedule is often used by people who want to explore microdosing:\n\nDay 1: take a microdose\nDay 2: no dose\nDay 3: no dose\nDay 4: take a microdose again\n\nThese pause days allow you to better observe how the microdose works for you without dosing every day.\n3. Ways to consume truffles\n\nEat directly &ndash; chew the truffles thoroughly before swallowing.\nTruffle tea &ndash; finely chop the truffles and let them steep in hot (not boiling) water for about 10&ndash;15 minutes.\n\n4. Keep track of your experiences\nMany microdosers keep a small journal in which they note how they feel. This can help determine whether a dose should be adjusted or which schedule works best for you.\nWhat can you expect from microdosing?\nMicrodosing is intended to produce subtle effects. Many users describe small changes in focus, creativity, or mood. Because the dose is low, a full psychedelic experience usually does not occur.\nIt is important to know that experiences can vary from person to person. Factors such as sensitivity, environment, and mental state can play a role.\nHow do you store iMicrodose truffles?\n\nStore in a cool place &ndash; preferably between 2 and 4 &deg;C.\nKeep in a dark place &ndash; avoid direct sunlight.\nClose the packaging properly to maintain freshness.\nCheck the expiration date on the packaging.\n\nSafety &amp; considerations\n\nNot suitable for persons under 18 years of age.\nDo not use during pregnancy or breastfeeding.\nDo not combine with alcohol or other psychoactive substances.\nAvoid use if you are sensitive to psychological conditions.\n\nAlways start with a low dose and increase carefully if necessary.\nFrequently Asked Questions (FAQ)\n\nWhat is a microdose of truffles?\u25bc\n\nA microdose is a very small amount of psilocybin truffles. The dose is so low that a full psychedelic experience usually does not occur, but some users describe subtle changes in focus, creativity, or mood.\n\nHow many truffles should you use for microdosing?\u25bc\n\nMany people start with about 1 gram of fresh truffles. Depending on personal sensitivity, this can vary between approximately 0.5 and 1.5 grams.\n\nHow often can you take a microdose?\u25bc\n\nA commonly used schedule is taking one dose and then taking two days off. This gives the body enough time between doses and usually helps keep tolerance low.\n\nCan you combine different truffle species?\u25bc\n\nYes, some users combine small amounts of different truffle species. However, many people prefer to try one species first to better understand how it affects them.\n\nHow long do iMicrodose truffles stay fresh?\u25bc\n\nIf you store the truffles in the refrigerator (2&ndash;4 &deg;C) and close the packaging properly, they usually remain good until the expiration date on the package.\n\n\n\n\nvar acc = document.getElementsByClassName(\"accordion\");\nvar i;\n\nfor (i = 0; i < acc.length; i++) {\n  acc[i].addEventListener(\"click\", function() {\n    this.classList.toggle(\"active\");\n    var panel = this.parentElement.nextElementSibling;\n    var icon = this.querySelector(\"span\");\n\n    if (panel.style.display === \"block\") {\n      panel.style.display = \"none\";\n      if (icon) icon.style.transform = \"rotate(0deg)\";\n    } else {\n      panel.style.display = \"block\";\n      if (icon) icon.style.transform = \"rotate(180deg)\";\n    }\n  });\n}\n\n",
         "sku": "5201908",
        "gtin13": "",
        "mpn": "",
        "offers": {
            "@type": "Offer",
            "priceCurrency": "EUR",
            "price": "17.5",
            "itemCondition": "http://schema.org/NewCondition",
            "availability": "http://schema.org/InStock",
            "url": "https://www.24high.com/en/article/5201908-imicrodose-triniti?setlang=en&article=5201908-imicrodose-triniti",
            "seller": {
                "@type": "Organization",
                "name": "24High"
            }
        }
            }
</script>
<div class="content">
<h1 class="h1 h1--line" style="color: rgb(101,101,101);">iMicrodose</h1>
<a class="a a--hover-primary" href="../mushrooms/16-magic-truffles.html" style="display: inline-block; margin-bottom:20px;">MUSHROOMS -&gt; Magic Truffles </a>
<div class="columns columns--mobile800">
<div class="columns__column">
<div class="imagebox">
<div class="imagebox__maincontainer">
<img alt="iMicrodose" class="imagebox__mainimage" id="main-product-image" src="../../images/articles/image.php@id=4811&amp;w=1000&amp;h=1000">
<div id="interactive-viewer-container" style="display: none; width: 100%; height: 100%;"></div>
</img></div>
<div class="imagebox__thumbscontainer">
<div class="imagebox__thumbnail" data-url="https://www.24high.com/images/articles/image.php?id=4811&amp;w=1000&amp;h=1000"> <img alt="" src="../../images/articles/image.php@id=4811&amp;w=200&amp;h=200"/></div><div class="imagebox__thumbnail" data-url="https://www.24high.com/images/articles/image.php?id=4812&amp;w=1000&amp;h=1000"> <img alt="" src="../../images/articles/image.php@id=4812&amp;w=200&amp;h=200"/></div><div class="imagebox__thumbnail" data-url="https://www.24high.com/images/articles/image.php?id=4813&amp;w=1000&amp;h=1000"> <img alt="" src="../../images/articles/image.php@id=4813&amp;w=200&amp;h=200"/></div><div class="imagebox__thumbnail" data-url="https://www.24high.com/images/articles/image.php?id=4814&amp;w=1000&amp;h=1000"> <img alt="" src="../../images/articles/image.php@id=4814&amp;w=200&amp;h=200"/></div><div class="imagebox__thumbnail" data-url="https://www.24high.com/images/articles/image.php?id=4815&amp;w=1000&amp;h=1000"> <img alt="" src="../../images/articles/image.php@id=4815&amp;w=200&amp;h=200"/></div> </div>
</div>
</div>
<div class="columns__column columns__column--grow" style="padding-left: 10px;">
<div class="fx fx--ai-center">
<a class="a a--hover-primary fx__i" href="5201908-imicrodose-triniti.html#" onclick="$('#reviewtabbtn').click().get(0).scrollIntoView();
                        return false;"><div class="rating" data-rating="0">
<span class="rating__empty">
<span class="rating__btn" data-rating="1"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="2"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="3"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="4"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="5"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span>
</span>
<div class="rating__filled" style="width: 0%;">
<div class="rating__filcont">
<svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg>
</div>
</div>
</div> (0)</a>
<div class="fx__i">Article number: 5201908</div>
</div>
<br/>
<div id="articlePrice">
<span class="text-bold font-2x">€ 17,50</span> (Incl.VAT)            </div>
<br/><br/>
<br>
<div id="articleStockStatus"><i class="fa fa-check success"></i> In stock</div>
<br/>
<div class="fx__i"><select class="input input--w100" id="selectVariant" name="variation"><option value="5201908">iMicrodose - Triniti</option><option value="5201445">iMicrodose - Mindfuli</option><option value="5201902">iMicrodose - Original</option><option value="5201762">iMicrodose - Uniti</option></select></div>
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
<div class="tabs__button" data-tabscontent="#tabs_1770"><i class="far fa-info-circle fa-fw"></i> Disclaimer</div> <div class="tabs__button tabs__button--secondary" data-tabscontent="#tabs_reviews" id="reviewtabbtn"><i class="fas fa-star fa-fw"></i> Reviews</div>
</div>
<div class="tabs__content" id="tabs_description" style="padding: 10px;">
<p><strong>iMicrodose</strong> is a microdosing kit with carefully selected psilocybin truffles. The kit is designed for people who want to explore microdosing in a practical and controlled way. Thanks to the resealable packaging, you can easily measure a small amount and store the remaining truffles safely for later use.</p>
<blockquote>Microdosing with truffles means taking a very small amount of psilocybin, so you do not experience a full psychedelic trip but may notice subtle changes in focus, creativity, and mood.</blockquote>
<p>The truffles in the iMicrodose kits are naturally grown without artificial additives. The compact portions of 5 grams make it easy to experiment with a microdosing schedule and discover which amount works best for you.</p>
<p>Want to learn more about microdosing? Read our guide <span style="text-decoration: underline; color: #1a20e8;"><a href="../blog/477/microdosing-for-beginners-how-to-start-responsibly-with-an-emerging-trend.html" style="color: #1a20e8; text-decoration: underline;">What is microdosing?</a></span> or explore all products in the category <span style="text-decoration: underline; color: #1a20e8;"><a href="../mushrooms/189-microdosing.html" style="color: #1a20e8; text-decoration: underline;">microdosing truffles</a></span>.</p>
<h2>What is iMicrodose?</h2>
<p><strong>iMicrodose</strong> is a microdosing kit with psilocybin truffles specially designed for people who want to explore microdosing. The kit contains small portions of 5 grams of truffles, allowing you to easily measure a microdose and try different schedules.</p>
<p>Microdosing means using a very small amount of truffles. The dose is much lower than with a full psychedelic experience. As a result, the effects usually remain subtle and you can often continue with your daily activities.</p>
<p>The iMicrodose kits come in a resealable package. This allows you to take a small portion of truffles and store the rest in a cool place to keep them fresh for later use.</p>
<p>At 24High, we see that microdosing is especially popular among people who want to become familiar with psilocybin truffles in a calm and controlled way.</p>
<h2>Which iMicrodose variants are available?</h2>
<p>The iMicrodose kits are available in four different variants. Each variant contains a different combination of truffle species so you can discover which one suits your preference best.</p>
<h3>TRINITI</h3>
<p>The TRINITI kit contains three different truffle varieties. This variant is often chosen by people who want to compare multiple species.</p>
<ul>
<li>5 grams of <strong>Galindoi</strong> truffles</li>
<li>5 grams of <strong>Mexicana</strong> truffles</li>
<li>5 grams of <strong>Tampanensis</strong> truffles</li>
</ul>
<h3>ORIGINAL</h3>
<p>The ORIGINAL variant contains only Galindoi truffles. This species is known for its accessible character and is often used in microdosing schedules.</p>
<ul>
<li>3 × 5 grams of <strong>Galindoi</strong> truffles</li>
</ul>
<h3>MINDFULI</h3>
<p>MINDFULI is composed of Mexicana truffles. This species is often chosen by people who want to combine microdosing with moments of reflection or creativity.</p>
<ul>
<li>3 × 5 grams of <strong>Mexicana</strong> truffles</li>
</ul>
<h3>UNITI</h3>
<p>The UNITI kit contains only Tampanensis truffles. This species is known for its balanced character and is often used in structured microdosing schedules.</p>
<ul>
<li>3 × 5 grams of <strong>Tampanensis</strong> truffles</li>
</ul>
<h2>How do you use iMicrodose truffles?</h2>
<p>The iMicrodose kits are developed for microdosing. When microdosing, you take a small amount of psilocybin truffles so the effects usually remain subtle. Many people use microdosing as a calm way to become familiar with truffles without experiencing a full psychedelic journey.</p>
<p>Because everyone reacts differently to psilocybin, it is wise to always start with a low amount and carefully observe how your body and mind respond.</p>
<h3>1. Determine your starting dose</h3>
<p>Many users begin with about <strong>1 gram of fresh truffles</strong>. Depending on personal sensitivity, a microdose can range between about <strong>0.5 and 1.5 grams</strong>.</p>
<p>Want to get an indication of a possible dosage? Use our calculator:</p>
<div><strong>Microdosing dosage calculator<br/><br/></strong>
<div class="container" style="position: relative; font-family: Arial, Helvetica, sans-serif;"><a href="../../magic-mushroom-calculator/index.html" title="dosage calculator"> <img alt="Truffle dosage calculator 24High" src="https://www.24high.nl/files/?id=1562.png&amp;file=Doserings_Banner2.png" style="width: 100%;"/> </a>
<div class="text-block" style="position: absolute; bottom: 20px; left: 20px; color: #ffffff; padding-left: 10px; padding-right: 10px;">
<h3 style="font-size: 4vw;">Dosage<br/>Calculator &gt;&gt;</h3>
</div>
</div>
</div>
<h3>2. Commonly used microdosing schedule</h3>
<blockquote>A commonly used microdosing schedule is to take a small dose on one day and then take two days off. This gives the body time to process the effects and usually helps prevent tolerance from building up too quickly.</blockquote>
<p>This schedule is often used by people who want to explore microdosing:</p>
<ul>
<li><strong>Day 1:</strong> take a microdose</li>
<li><strong>Day 2:</strong> no dose</li>
<li><strong>Day 3:</strong> no dose</li>
<li><strong>Day 4:</strong> take a microdose again</li>
</ul>
<p>These pause days allow you to better observe how the microdose works for you without dosing every day.</p>
<h3>3. Ways to consume truffles</h3>
<ul>
<li><strong>Eat directly</strong> – chew the truffles thoroughly before swallowing.</li>
<li><strong>Truffle tea</strong> – finely chop the truffles and let them steep in hot (not boiling) water for about 10–15 minutes.</li>
</ul>
<h3>4. Keep track of your experiences</h3>
<p>Many microdosers keep a small journal in which they note how they feel. This can help determine whether a dose should be adjusted or which schedule works best for you.</p>
<h2>What can you expect from microdosing?</h2>
<p>Microdosing is intended to produce subtle effects. Many users describe small changes in focus, creativity, or mood. Because the dose is low, a full psychedelic experience usually does not occur.</p>
<p>It is important to know that experiences can vary from person to person. Factors such as sensitivity, environment, and mental state can play a role.</p>
<h2>How do you store iMicrodose truffles?</h2>
<ul>
<li><strong>Store in a cool place</strong> – preferably between <strong>2 and 4 °C</strong>.</li>
<li><strong>Keep in a dark place</strong> – avoid direct sunlight.</li>
<li><strong>Close the packaging properly</strong> to maintain freshness.</li>
<li><strong>Check the expiration date</strong> on the packaging.</li>
</ul>
<h2>Safety &amp; considerations</h2>
<ul>
<li>Not suitable for persons under 18 years of age.</li>
<li>Do not use during pregnancy or breastfeeding.</li>
<li>Do not combine with alcohol or other psychoactive substances.</li>
<li>Avoid use if you are sensitive to psychological conditions.</li>
</ul>
<p>Always start with a low dose and increase carefully if necessary.</p>
<h2><span style="color: #34495e;">Frequently Asked Questions (FAQ)</span></h2>
<div>
<p><button class="accordion" style="background-color: #eee; color: #444; cursor: pointer; padding: 18px; width: 100%; border: none; text-align: left; outline: none; font-size: 15px; transition: 0.4s; position: relative;"><strong>What is a microdose of truffles?</strong><span style="position: absolute; right: 18px; transition: transform 0.4s;">▼</span></button></p>
<div class="panel" style="display: none;">
<p>A microdose is a very small amount of psilocybin truffles. The dose is so low that a full psychedelic experience usually does not occur, but some users describe subtle changes in focus, creativity, or mood.</p>
</div>
<p><button class="accordion" style="background-color: #eee; color: #444; cursor: pointer; padding: 18px; width: 100%; border: none; text-align: left; outline: none; font-size: 15px; transition: 0.4s; position: relative;"><strong>How many truffles should you use for microdosing?</strong><span style="position: absolute; right: 18px; transition: transform 0.4s;">▼</span></button></p>
<div class="panel" style="display: none;">
<p>Many people start with about 1 gram of fresh truffles. Depending on personal sensitivity, this can vary between approximately 0.5 and 1.5 grams.</p>
</div>
<p><button class="accordion" style="background-color: #eee; color: #444; cursor: pointer; padding: 18px; width: 100%; border: none; text-align: left; outline: none; font-size: 15px; transition: 0.4s; position: relative;"><strong>How often can you take a microdose?</strong><span style="position: absolute; right: 18px; transition: transform 0.4s;">▼</span></button></p>
<div class="panel" style="display: none;">
<p>A commonly used schedule is taking one dose and then taking two days off. This gives the body enough time between doses and usually helps keep tolerance low.</p>
</div>
<p><button class="accordion" style="background-color: #eee; color: #444; cursor: pointer; padding: 18px; width: 100%; border: none; text-align: left; outline: none; font-size: 15px; transition: 0.4s; position: relative;"><strong>Can you combine different truffle species?</strong><span style="position: absolute; right: 18px; transition: transform 0.4s;">▼</span></button></p>
<div class="panel" style="display: none;">
<p>Yes, some users combine small amounts of different truffle species. However, many people prefer to try one species first to better understand how it affects them.</p>
</div>
<p><button class="accordion" style="background-color: #eee; color: #444; cursor: pointer; padding: 18px; width: 100%; border: none; text-align: left; outline: none; font-size: 15px; transition: 0.4s; position: relative;"><strong>How long do iMicrodose truffles stay fresh?</strong><span style="position: absolute; right: 18px; transition: transform 0.4s;">▼</span></button></p>
<div class="panel" style="display: none;">
<p>If you store the truffles in the refrigerator (2–4 °C) and close the packaging properly, they usually remain good until the expiration date on the package.</p>
</div>
</div>
<p>
<script>
var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.parentElement.nextElementSibling;
    var icon = this.querySelector("span");

    if (panel.style.display === "block") {
      panel.style.display = "none";
      if (icon) icon.style.transform = "rotate(0deg)";
    } else {
      panel.style.display = "block";
      if (icon) icon.style.transform = "rotate(180deg)";
    }
  });
}
</script>
</p> </div>
<div class="tabs__content" id="tabs_1770" style="padding: 10px;"><h3>Disclaimer:</h3>
<p>Microdosing truffles contain psilocybin, a psychoactive substance that can cause mind-altering effects. Do not use psilocybin truffles if you are a minor or pregnant, use is also not recommended for people with mental disorders (such as anxiety disorders or schizophrenia) and users of certain medications, including antidepressants and MAOIs. Always use in a safe environment, preferably under supervision. If in doubt, consult a doctor.</p></div>
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
<br/>
<div>
<h3>Accessories</h3><div class="fx"><div class="article" itemscope="" itemtype="http://schema.org/Product"><div class="article__header"><meta content="https://www.24high.com/images/articles/image.php?id=5111&amp;w=300&amp;h=300" itemprop="image"/><div class="article__image data-link cursor-pointer" data-link="https://www.24high.com/en/article/5205818-recycold-cool-pack"><img alt="Recycold Cool Pack" class="lazyload" data-src="https://www.24high.com/images/articles/image.php?id=5111&amp;w=300&amp;h=300" src="../../images/articles/blank.gif"/></div> </div>
<div class="article__footer">
<div class="article__description data-link" data-link="https://www.24high.com/en/article/5205818-recycold-cool-pack"><a href="5205818-recycold-cool-pack.html"><span itemprop="name">Recycold Cool Pack</span></a></div>
<div class="text-center"><div class="rating" data-rating="0">
<span class="rating__empty">
<span class="rating__btn" data-rating="1"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="2"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="3"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="4"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="5"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span>
</span>
<div class="rating__filled" style="width: 0%;">
<div class="rating__filcont">
<svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg>
</div>
</div>
</div></div>
<div class="article__price data-link primary" data-link="https://www.24high.com/en/article/5205818-recycold-cool-pack" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"><a href="5205818-recycold-cool-pack.html">€ 0,99</a><meta content="EUR" itemprop="priceCurrency"/><meta content="0.99" itemprop="price"/><link href="http://schema.org/InStock" itemprop="availability"/></div>
<div class="article__actions"><a aria-label="Product Recycold Cool Pack" class="article__button btn btn--secondary btn--block dialog-dismiss" href="5205818-recycold-cool-pack.html"><svg aria-hidden="true" class="svg-inline--fa fa-info-circle fa-fw" data-fa-i2svg="" data-icon="info-circle" data-prefix="fas" focusable="false" role="img" viewbox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="currentColor"></path></svg></a><a aria-label="Order Recycold Cool Pack" class="article__button btn btn--primary btn--block addArticleToCart dialog-dismiss" data-articlenumber="5205818" href="5201908-imicrodose-triniti.html#"><svg aria-hidden="true" class="svg-inline--fa fa-cart-plus fa-fw" data-fa-i2svg="" data-icon="cart-plus" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" fill="currentColor"></path></svg></a></div>
</div>
</div></div> </div>
</div>
<div class="clear"></div>
</div>
</div>