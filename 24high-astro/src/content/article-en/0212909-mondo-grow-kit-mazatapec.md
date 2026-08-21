---
title: "Mondo Grow Kit Mazatapec - 24High"
description: "Mondo Grow Kit Mazatapec Buy online at 24High: ✔️ Simple ✔️ Fast and anonymous | Buy Online"
---
<div class="contentwrapper">
<div class="wrapper">
<script>
    dataLayer.push({
        ecommerce: null
    }); // Clear the previous ecommerce object.
    dataLayer.push({
        event: "view_item",
        ecommerce: {"items":[{"quantity":1,"price":34.95,"item_name":"Mondo Grow Kit Mazatapec","item_id":"0212909"}],"currency":"EUR","value":34.95}    });


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
        "name": "Mondo Grow Kit Mazatapec",
        "image": "https://www.24high.com/images/articles/image.php?id=3091&w=300&h=300",
        "description": "Mondo Grow Kit Mazatapec\nThe wonders are not over yet with the psychedelic, mind-blowing and spiritual Mazatapec magic mushroom. This strain is famous for its religious and ritual shamanic use by the medicine men of indigenous Mexican populations such as the Mazatec and Nahuas. Such a religious ritual with psilocybin psychedelic mushrooms or Salvia Divinorium is called a Velada. According to a theory of ethnomycologist, author and psychedelic guru, Terence Mckenna, the use of psilocybin magic mushrooms goes back 15,000 years. The Mazteken used these unique mushrooms around the year 890. She honoured and respected this exclusive mushroom strain for its ability to heal deep-seated pains. The Mazatapec is a true philosophical and creative generator and is able to provide you with problem-solving insights. This magic mushroom grow kit is suitable for beginners looking for something stronger and for the experienced psilocybin user.\nEffects of Mondo Grow Kit Mazatapec Mushrooms\nThe Mazatapec mushroom grow kit from Mondo is a perfect stepping stone for a beginner looking for a more powerful mushroom growkit and for those who are experienced with the use of psilocybin mushrooms. The effects of Mazatapec are highly philosophical, creative, and mediocre in body energy and visuals.\nGrow information Mondo Mazatapec \n\nGrowing difficulties: Easy\nSubstrate: Manure, straw, various grains\nColonization time: 10 - 13 days\nColonization temperature: 28 - 30 degrees Celsius\nFruit temperature: 23 - 26 degrees Celsius\n\nHow many Mazatapec Mushrooms should you take?\nOn average, you can assume the following amounts: \n\nMicrodosing: 0.2 grams of dried mushrooms | 2 grams of fresh mushrooms\nMild trip: 1 gram of dried mushrooms | 10 grams of fresh mushrooms\nNormal trip: 2 grams of dried mushrooms | 20 grams of fresh mushrooms\nIntense trip: 3 grams of dried mushrooms | 30 grams of fresh shrooms\n\nPreparations when you are going to trip on Mondo Mazatapec Shrooms\nDo not start with psilocybin shrooms if you are in a bad mood or not feeling well, this could evoke a bad trip. A relaxed and relaxed setting is very important if you want to have a good night trip. Don't trip to someone you don't know very well. Always do this with people around you who you trust and preferably in a quiet environment such as your own home. Tidy everything up, it is nice to trip in a clean environment without too much junk around you, prepare things that you want to use in your trip such as the music you want to listen to during the trip or the trip stoppers. Make yourself as comfortable as possible. After all, you don't want to go crazy looking for stuff, the tripping itself should be central.\nInstructions for the Mondo Mazatapec Magic Mushroom Grow Kit\nDownload the instructions in PDF for setting up your grow kit here. \nTry to keep the temperature at 24 degrees. In any case not lower than 18 degrees. We strongly recommend the use of a thermomat. Light plays an important role in the cultivation of magic mushrooms. Make sure there is no direct sunlight on the grow box, but that it gets a few hours of sunlight or artificial light per day. This is necessary for the mycelium to understand that they have reached the surface. Moisture is important for growing mushrooms, as well as fresh air.  Do not spray directly on the grow tray! Against the inside of the grow box! Spraying the grow bag is therefore the best solution. You do this with 1 spray. After spraying, close the grow bag immediately with the paperclip. When the veil between the hat and the stem has just been torn, it is time to harvest the mushrooms. Don't wait too long as soon as you see this. You pick a mushroom by turning it clockwise. Don't pull it, you can damage the mycelium and you don't want that for the next flush.\nGetting multiple flushes from your growkit\nWith the Mondo Mazatapec grow kit you can grow and harvest magic mushrooms on average 3 times. When harvesting the mushrooms, it is important that you turn carefully and do not pull on the mushrooms. Damaging the mycelium can cause smaller flushes after picking the mushrooms.\nContent of your magic Mondo Mazatapec Growkit\nWhen you buy your Mondo Mazatapec Growkit you will receive it with all necessary materials. Upon receipt, we advise you to start growing magic mushrooms immediately. This benefits the quality. In your Mondo Mazatapec Growkit you will find the following materials:\n\nGrow box(1200cc)\nGrow bag\nPaperclip\n\nThe grow tray is filled with the substrate and active mycelium from which the mushrooms will grow. All you need to achieve a great mushroom harvest is a clean work environment, drinking water and a way to atomize the water.\nHarvesting your Mondo Mazatapec magic mushrooms\nCount on a harvest of around 300 to 600 grams of magic mushrooms if you stick to the step-by-step plan to grow magic mushrooms. The Mondo growkit is available in 1200cc and 2100cc. The great thing about the Mondo Mazatapec mushroom growkit is? You can use it on average 3 times if you handle it correctly. The Mazatapec mushrooms are easy to grow.\nStoring your mushroom growkit\nSince it is a fresh product, we advise you to set up your mushroom growkit immediately. This way you can achieve the best results and ensure a nice mushroom harvest. Still, you can keep the mushroom growkit after receipt. This is provided with an expiry date.",
         "sku": "0212909",
        "gtin13": "",
        "mpn": "",
        "offers": {
            "@type": "Offer",
            "priceCurrency": "EUR",
            "price": "34.95",
            "itemCondition": "http://schema.org/NewCondition",
            "availability": "http://schema.org/OutOfStock",
            "url": "https://www.24high.com/en/article/0212909-mondo-grow-kit-mazatapec?setlang=en&article=0212909-mondo-grow-kit-mazatapec",
            "seller": {
                "@type": "Organization",
                "name": "24High"
            }
        }
            }
</script>
<div class="content">
<h1 class="h1 h1--line" style="color: rgb(101,101,101);">Mondo Grow Kit Mazatapec</h1>
<div class="columns columns--mobile800">
<div class="columns__column">
<div class="endoflife text-center"><div><b>Currently not available</b></div><div>View alternative articles below.</div></div> <div class="imagebox">
<div class="imagebox__maincontainer">
<img alt="Mondo Grow Kit Mazatapec" class="imagebox__mainimage" id="main-product-image" src="../../images/articles/image.php@id=3091&amp;w=1000&amp;h=1000">
<div id="interactive-viewer-container" style="display: none; width: 100%; height: 100%;"></div>
</img></div>
<div class="imagebox__thumbscontainer">
<div class="imagebox__thumbnail" data-url="https://www.24high.com/images/articles/image.php?id=3091&amp;w=1000&amp;h=1000"> <img alt="" src="../../images/articles/image.php@id=3091&amp;w=200&amp;h=200"/></div><div class="imagebox__thumbnail" data-url="https://www.24high.com/images/articles/image.php?id=3080&amp;w=1000&amp;h=1000"> <img alt="" src="../../images/articles/image.php@id=3080&amp;w=200&amp;h=200"/></div> </div>
</div>
</div>
<div class="columns__column columns__column--grow" style="padding-left: 10px;">
<div class="fx fx--ai-center">
<a class="a a--hover-primary fx__i" href="0212909-mondo-grow-kit-mazatapec.html#" onclick="$('#reviewtabbtn').click().get(0).scrollIntoView();
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
<div class="fx__i">Article number: 0212909</div>
</div>
<br/>
<div id="articlePrice">
<span class="text-bold font-2x">€ 34,95</span> (Incl.VAT)            </div>
<br/><br/>
<br>
<div id="articleStockStatus"><i class="fa fa-times danger"></i> Currently not available</div>
<br/>
<select class="input hidden" id="selectVariant" name="variation"><option value="0212909">Mondo Grow Kit Mazatapec</option></select>
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
<div class="tabs__button tabs__button--secondary" data-tabscontent="#tabs_reviews" id="reviewtabbtn"><i class="fas fa-star fa-fw"></i> Reviews</div>
</div>
<div class="tabs__content" id="tabs_description" style="padding: 10px;">
<h2>Mondo Grow Kit Mazatapec</h2>
<p>The wonders are not over yet with the psychedelic, mind-blowing and spiritual Mazatapec magic mushroom. This strain is famous for its religious and ritual shamanic use by the medicine men of indigenous Mexican populations such as the Mazatec and Nahuas. Such a religious ritual with psilocybin psychedelic mushrooms or Salvia Divinorium is called a Velada. According to a theory of ethnomycologist, author and psychedelic guru, Terence Mckenna, the use of psilocybin magic mushrooms goes back 15,000 years. The Mazteken used these unique mushrooms around the year 890. She honoured and respected this exclusive mushroom strain for its ability to heal deep-seated pains. The Mazatapec is a true philosophical and creative generator and is able to provide you with problem-solving insights. This magic mushroom grow kit is suitable for beginners looking for something stronger and for the experienced psilocybin user.</p>
<h2>Effects of Mondo Grow Kit Mazatapec Mushrooms</h2>
<p>The Mazatapec mushroom grow kit from Mondo is a perfect stepping stone for a beginner looking for a more powerful mushroom growkit and for those who are experienced with the use of psilocybin mushrooms. The effects of Mazatapec are highly philosophical, creative, and mediocre in body energy and visuals.</p>
<h2>Grow information Mondo Mazatapec<span style="font-size: 14px;"> </span></h2>
<ul>
<li>Growing difficulties: Easy</li>
<li>Substrate: Manure, straw, various grains</li>
<li>Colonization time: 10 - 13 days</li>
<li>Colonization temperature: 28 - 30 degrees Celsius</li>
<li>Fruit temperature: 23 - 26 degrees Celsius</li>
</ul>
<h2>How many Mazatapec Mushrooms should you take?</h2>
<p>On average, you can assume the following amounts: <!-- p--></p>
<ul>
<li>Microdosing: 0.2 grams of dried mushrooms | 2 grams of fresh mushrooms</li>
<li>Mild trip: 1 gram of dried mushrooms | 10 grams of fresh mushrooms</li>
<li>Normal trip: 2 grams of dried mushrooms | 20 grams of fresh mushrooms</li>
<li>Intense trip: 3 grams of dried mushrooms | 30 grams of fresh shrooms</li>
</ul>
<h2>Preparations when you are going to trip on Mondo Mazatapec Shrooms</h2>
<p>Do not start with psilocybin shrooms if you are in a bad mood or not feeling well, this could evoke a bad trip. A relaxed and relaxed setting is very important if you want to have a good night trip. Don't trip to someone you don't know very well. Always do this with people around you who you trust and preferably in a quiet environment such as your own home. Tidy everything up, it is nice to trip in a clean environment without too much junk around you, prepare things that you want to use in your trip such as the music you want to listen to during the trip or the trip stoppers. Make yourself as comfortable as possible. After all, you don't want to go crazy looking for stuff, the tripping itself should be central.</p>
<h2>Instructions for the Mondo Mazatapec Magic Mushroom Grow Kit</h2>
<p><span style="text-decoration: underline; color: #2819df;"><a href="../files/index.html@id=1749.pdf&amp;file=mondo-growkit-manual+(2).pdf" style="color: #2819df; text-decoration: underline;">Download the instructions in PDF for setting up your grow kit here. </a></span></p>
<p>Try to keep the temperature at 24 degrees. In any case not lower than 18 degrees. We strongly recommend the use of a thermomat. Light plays an important role in the cultivation of magic mushrooms. Make sure there is no direct sunlight on the grow box, but that it gets a few hours of sunlight or artificial light per day. This is necessary for the mycelium to understand that they have reached the surface. Moisture is important for growing mushrooms, as well as fresh air. <br/><br/><span style="font-weight: bold;"> Do not spray directly on the grow tray! </span>Against the inside of the grow box! Spraying the grow bag is therefore the best solution. You do this with 1 spray. After spraying, close the grow bag immediately with the paperclip. When the veil between the hat and the stem has just been torn, it is time to harvest the mushrooms. Don't wait too long as soon as you see this. You pick a mushroom by turning it clockwise. Don't pull it, you can damage the mycelium and you don't want that for the next flush.</p>
<h2>Getting multiple flushes from your growkit</h2>
<p>With the Mondo Mazatapec grow kit you can grow and harvest magic mushrooms on average 3 times. When harvesting the mushrooms, it is important that you turn carefully and do not pull on the mushrooms. Damaging the mycelium can cause smaller flushes after picking the mushrooms.</p>
<h2>Content of your magic Mondo Mazatapec Growkit</h2>
<p>When you buy your Mondo Mazatapec Growkit you will receive it with all necessary materials. Upon receipt, we advise you to start growing magic mushrooms immediately. This benefits the quality. In your Mondo Mazatapec Growkit you will find the following materials:</p>
<ul>
<li>Grow box(1200cc)</li>
<li>Grow bag</li>
<li>Paperclip</li>
</ul>
<p>The grow tray is filled with the substrate and active mycelium from which the mushrooms will grow. All you need to achieve a great mushroom harvest is a clean work environment, drinking water and a way to atomize the water.</p>
<h2>Harvesting your Mondo Mazatapec magic mushrooms</h2>
<p>Count on a harvest of around 300 to 600 grams of magic mushrooms if you stick to the step-by-step plan to grow magic mushrooms. The Mondo growkit is available in 1200cc and 2100cc. The great thing about the Mondo Mazatapec mushroom growkit is? You can use it on average 3 times if you handle it correctly. The Mazatapec mushrooms are easy to grow.</p>
<h2>Storing your mushroom growkit</h2>
<p>Since it is a fresh product, we advise you to set up your mushroom growkit immediately. This way you can achieve the best results and ensure a nice mushroom harvest. Still, you can keep the mushroom growkit after receipt. This is provided with an expiry date.</p> </div>
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
<h3>Similar items</h3><div class="carousel"></div> </div>
</div>
<div class="clear"></div>
</div>
</div>