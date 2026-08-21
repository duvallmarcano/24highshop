---
title: "Magic Truffles 6-pack - 24High"
description: "Magic Truffles 6-pack Buy online at 24High: ✔️ Simple ✔️ Fast and anonymous | Buy Online"
---
<div class="contentwrapper">
<div class="wrapper">
<script>
    dataLayer.push({
        ecommerce: null
    }); // Clear the previous ecommerce object.
    dataLayer.push({
        event: "view_item",
        ecommerce: {"items":[{"quantity":1,"price":74.95,"item_name":"Magic Truffels 6-pack","item_id":"9110968"}],"currency":"EUR","value":74.95}    });


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
        "name": "Magic Truffles 6-pack",
        "image": "https://www.24high.com/images/articles/image.php?id=1830&w=300&h=300",
        "description": "Magic Truffles 6-pack is a selection of six different psilocybin truffles, each with its own character and strength. This bundle is often chosen by people who want to discover multiple truffle varieties or compare different types with each other.\nThe Magic Truffles 6-pack contains six different psilocybin truffle varieties of 15 grams each. This allows you to discover multiple variants and compare their unique effects, character, and intensity.\nWould you like to discover more varieties? View the full category of  magic truffles or read our explanation  what are psilocybin truffles?.\nWhat are magic truffles?\nMagic truffles (also called sclerotia) are the underground part of certain Psilocybe fungi. In this compact structure, the mycelium stores nutrients. Truffles naturally contain the substances psilocybin and psilocin, which are responsible for the psychedelic effects.\nMany users describe changes in perception, more intense colors, deeper thought processes, and a stronger focus on inner thoughts. Exactly how the experience unfolds can vary from person to person and is influenced by factors such as dosage, setting, and personal sensitivity.\nWhich truffles are included in the Magic Truffles 6-pack?\nThe Magic Truffles 6-pack contains a total of 90 grams of fresh magic truffles, divided over six separate packages of 15 grams each. Every variety has its own character and experience.\n\nAtlantis &ndash; known for an energetic and creative experience with colorful visual effects.\nMexicana &ndash; a mild and accessible truffle often chosen by beginners.\nMushrock &ndash; a balanced variety with a combination of visual effects and introspective thoughts.\nTampanensis &ndash; a philosophical truffle often associated with new insights and reflection.\nDragon&rsquo;s Dynamite &ndash; a stronger truffle with more intense visual effects.\nPink Paradise &ndash; known for a colorful experience with a warm and positive atmosphere.\n\nThis variation allows you to compare different kinds of truffles and discover which one best suits your preference or setting.\nWhy choose a truffle value pack?\nMany people choose a bundle like the Magic Truffles 6-pack because it allows you to try several varieties at once without ordering each one separately. In addition, a value pack often offers a more favorable price than individual products.\nThis bundle contains a selection of six popular truffle varieties with different strengths and experiences. As a result, you get a broad introduction to the spectrum of magic truffles.\nAt 24High, we work with truffles and microdosing products every day. That is why we think it is important that you know exactly what you are using and what kind of experience you can roughly expect. Do you have questions about a specific variety or dosage? Our team is happy to help.\nHow do you use magic truffles?\nMagic truffles are usually eaten fresh. The taste is somewhat nutty and earthy. Some users combine them with tea or fruit juice to make the flavor milder.\nBecause the strength can vary per variety, it is wise to start slowly when trying a new truffle.\nGeneral guidelines\n\nUse truffles in a  calm and familiar environment.\nAllow enough time for the experience (usually 4 to 6 hours).\nStart with a lower amount if you are not yet familiar with a variety.\nMake sure you are mentally and physically well prepared.\n\nThe truffles in this pack are divided over six separate packages, making it easy to dose per session.\nDosage calculator for magic truffles\n  \n\nDosageCalculator &gt;&gt;\n\n\nWhat can you expect from the experience?\nThe effects of psilocybin truffles can vary from person to person and from one variety to another. Many users describe changes in perception, more intense colors, a sense of connection, and deeper thoughts or insights.\nThe experience usually lasts several hours and often unfolds in different phases, from a light build-up to a more intense peak and a calm ending.\nWho is the Magic Truffles 6-pack suitable for?\nThis value bundle is often chosen by:\n\nPeople who want to discover multiple truffle varieties\nUsers who want to compare different strengths\nGroups planning a psychedelic experience together\nPsychonauts who want to try a broad selection\n\nFor beginners, it may be wise to first try milder truffle varieties before using stronger ones.\nContents of the Magic Truffles 6-pack\n\nTotal weight: 90 grams of fresh magic truffles\nNumber of packages: 6\nVarieties: Atlantis, Mexicana, Mushrock, Tampanensis, Dragon&rsquo;s Dynamite, Pink Paradise\n\nSafety &amp; points of attention\nMagic truffles contain psilocybin and can cause a strong psychedelic experience. Always use them responsibly.\n\nDo not combine with alcohol or other substances.\nDo not use when pregnant.\nNot suitable for people with psychological sensitivity.\n\nFAQ &ndash; Magic Truffles 6-pack\n\nHow do you use the truffles from the 6-pack?\u25bc\n\nEach package contains 15 grams of fresh truffles. Many users take between 5 and 15 grams depending on experience and desired intensity.\n\nCan you also use the truffles separately?\u25bc\n\nYes. Each truffle variety is packed separately, so you can try each one at a different time.\n\nHow long does a truffle experience last?\u25bc\n\nMost experiences last around 4 to 6 hours. The first effects usually begin after 30 to 60 minutes.\n\nHow do you store fresh magic truffles?\u25bc\n\nStore fresh truffles in the refrigerator in their original packaging and preferably use them before the expiration date.\n\n\n\n\nvar acc=document.getElementsByClassName(\"accordion\");\nfor(var i=0;i",
         "brand": {
                "@type": "Brand",
                "name": "psilocybetruffles.com"
            },
         "sku": "9110968",
        "gtin13": "",
        "mpn": "",
        "offers": {
            "@type": "Offer",
            "priceCurrency": "EUR",
            "price": "74.95",
            "itemCondition": "http://schema.org/NewCondition",
            "availability": "http://schema.org/InStock",
            "url": "https://www.24high.com/en/article/9110968-magic-truffles-6-pack?setlang=en&article=9110968-magic-truffles-6-pack",
            "seller": {
                "@type": "Organization",
                "name": "24High"
            }
        }
            }
</script>
<div class="content">
<h1 class="h1 h1--line" style="color: rgb(101,101,101);">Magic Truffles 6-pack</h1>
<a class="a a--hover-primary" href="../mushrooms/16-magic-truffles.html" style="display: inline-block; margin-bottom:20px;">MUSHROOMS -&gt; Magic Truffles </a>
<div class="columns columns--mobile800">
<div class="columns__column">
<div class="imagebox">
<div class="imagebox__maincontainer">
<img alt="Magic Truffles 6-pack" class="imagebox__mainimage" id="main-product-image" src="../../images/articles/image.php@id=1830&amp;w=1000&amp;h=1000">
<div id="interactive-viewer-container" style="display: none; width: 100%; height: 100%;"></div>
</img></div>
<div class="imagebox__thumbscontainer">
<div class="imagebox__thumbnail" data-url="https://www.24high.com/images/articles/image.php?id=1830&amp;w=1000&amp;h=1000"> <img alt="" src="../../images/articles/image.php@id=1830&amp;w=200&amp;h=200"/></div> </div>
</div>
</div>
<div class="columns__column columns__column--grow" style="padding-left: 10px;">
<div class="fx fx--ai-center">
<a class="a a--hover-primary fx__i" href="9110968-magic-truffles-6-pack.html#" onclick="$('#reviewtabbtn').click().get(0).scrollIntoView();
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
<div class="fx__i">Article number: 9110968</div>
</div>
<br/>
<div id="articlePrice">
<span class="text-bold font-2x">€ 74,95</span> (Incl.VAT)            </div>
<br/><br/>
<br>
<div id="articleStockStatus"><i class="fa fa-check success"></i> In stock</div>
<br/>
<select class="input hidden" id="selectVariant" name="variation"><option value="9110968">Magic Truffles 6-pack</option></select>
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
<div class="tabs__button" data-tabscontent="#tabs_1625"><i class="far fa-info-circle fa-fw"></i> Disclaimer</div><div class="tabs__button" data-tabscontent="#tabs_1626"><i class="far fa-info-circle fa-fw"></i> Delivery</div> <div class="tabs__button tabs__button--secondary" data-tabscontent="#tabs_reviews" id="reviewtabbtn"><i class="fas fa-star fa-fw"></i> Reviews</div>
</div>
<div class="tabs__content" id="tabs_description" style="padding: 10px;">
<p><strong>Magic Truffles 6-pack</strong> is a selection of six different psilocybin truffles, each with its own character and strength. This bundle is often chosen by people who want to discover multiple truffle varieties or compare different types with each other.</p>
<blockquote>The Magic Truffles 6-pack contains six different psilocybin truffle varieties of 15 grams each. This allows you to discover multiple variants and compare their unique effects, character, and intensity.</blockquote>
<p>Would you like to discover more varieties? View the full category of <span style="text-decoration: underline; color: #1a20e8;"> <a href="../mushrooms/16-magic-truffles.html" style="color: #1a20e8; text-decoration: underline;">magic truffles</a></span> or read our explanation <span style="text-decoration: underline; color: #1a20e8;"> <a href="../blog/176/what-are-psilocybin-truffles.html" style="color: #1a20e8; text-decoration: underline;">what are psilocybin truffles?</a></span>.</p>
<h2>What are magic truffles?</h2>
<p>Magic truffles (also called sclerotia) are the underground part of certain <em>Psilocybe</em> fungi. In this compact structure, the mycelium stores nutrients. Truffles naturally contain the substances psilocybin and psilocin, which are responsible for the psychedelic effects.</p>
<p>Many users describe changes in perception, more intense colors, deeper thought processes, and a stronger focus on inner thoughts. Exactly how the experience unfolds can vary from person to person and is influenced by factors such as dosage, setting, and personal sensitivity.</p>
<h2>Which truffles are included in the Magic Truffles 6-pack?</h2>
<p>The Magic Truffles 6-pack contains a total of <strong>90 grams of fresh magic truffles</strong>, divided over six separate packages of 15 grams each. Every variety has its own character and experience.</p>
<ul>
<li><strong>Atlantis</strong> – known for an energetic and creative experience with colorful visual effects.</li>
<li><strong>Mexicana</strong> – a mild and accessible truffle often chosen by beginners.</li>
<li><strong>Mushrock</strong> – a balanced variety with a combination of visual effects and introspective thoughts.</li>
<li><strong>Tampanensis</strong> – a philosophical truffle often associated with new insights and reflection.</li>
<li><strong>Dragon’s Dynamite</strong> – a stronger truffle with more intense visual effects.</li>
<li><strong>Pink Paradise</strong> – known for a colorful experience with a warm and positive atmosphere.</li>
</ul>
<p>This variation allows you to compare different kinds of truffles and discover which one best suits your preference or setting.</p>
<h2>Why choose a truffle value pack?</h2>
<p>Many people choose a bundle like the Magic Truffles 6-pack because it allows you to try several varieties at once without ordering each one separately. In addition, a value pack often offers a more favorable price than individual products.</p>
<p>This bundle contains a selection of six popular truffle varieties with different strengths and experiences. As a result, you get a broad introduction to the spectrum of magic truffles.</p>
<p>At <strong>24High</strong>, we work with truffles and microdosing products every day. That is why we think it is important that you know exactly what you are using and what kind of experience you can roughly expect. Do you have questions about a specific variety or dosage? Our team is happy to help.</p>
<h2>How do you use magic truffles?</h2>
<p>Magic truffles are usually eaten fresh. The taste is somewhat nutty and earthy. Some users combine them with tea or fruit juice to make the flavor milder.</p>
<p>Because the strength can vary per variety, it is wise to start slowly when trying a new truffle.</p>
<h3>General guidelines</h3>
<ul>
<li>Use truffles in a <span style="text-decoration: underline; color: #1a20e8;"> <a href="../blog/438/what-are-set-and-setting-and-why-are-they-so-important-when-tripping.html" style="color: #1a20e8; text-decoration: underline;">calm and familiar environment</a></span>.</li>
<li>Allow enough time for the experience (usually 4 to 6 hours).</li>
<li>Start with a lower amount if you are not yet familiar with a variety.</li>
<li>Make sure you are mentally and physically well prepared.</li>
</ul>
<p>The truffles in this pack are divided over <strong>six separate packages</strong>, making it easy to dose per session.</p>
<p><strong>Dosage calculator for magic truffles</strong></p>
<div class="container" style="position: relative; font-family: Arial, Helvetica, sans-serif;"><a href="../../magic-mushroom-calculator/index.html" title="dosage calculator"> <img alt="Dosage calculator for magic truffles to help you calculate a suitable amount" src="https://www.24high.nl/files/?id=1562.png&amp;file=Doserings_Banner2.png" style="width: 100%;"/> </a>
<div class="text-block" style="position: absolute; bottom: 20px; left: 20px; color: #ffffff; padding-left: 10px; padding-right: 10px;">
<h3 style="font-size: 4vw;">Dosage<br/>Calculator &gt;&gt;</h3>
</div>
</div>
<h2>What can you expect from the experience?</h2>
<p>The effects of psilocybin truffles can vary from person to person and from one variety to another. Many users describe changes in perception, more intense colors, a sense of connection, and deeper thoughts or insights.</p>
<p>The experience usually lasts several hours and often unfolds in different phases, from a light build-up to a more intense peak and a calm ending.</p>
<h2>Who is the Magic Truffles 6-pack suitable for?</h2>
<p>This value bundle is often chosen by:</p>
<ul>
<li>People who want to discover multiple truffle varieties</li>
<li>Users who want to compare different strengths</li>
<li>Groups planning a psychedelic experience together</li>
<li>Psychonauts who want to try a broad selection</li>
</ul>
<p>For beginners, it may be wise to first try milder truffle varieties before using stronger ones.</p>
<h2>Contents of the Magic Truffles 6-pack</h2>
<ul>
<li><strong>Total weight:</strong> 90 grams of fresh magic truffles</li>
<li><strong>Number of packages:</strong> 6</li>
<li><strong>Varieties:</strong> Atlantis, Mexicana, Mushrock, Tampanensis, Dragon’s Dynamite, Pink Paradise</li>
</ul>
<h2>Safety &amp; points of attention</h2>
<p>Magic truffles contain psilocybin and can cause a strong psychedelic experience. Always use them responsibly.</p>
<ul>
<li>Do not combine with alcohol or other substances.</li>
<li>Do not use when pregnant.</li>
<li>Not suitable for people with psychological sensitivity.</li>
</ul>
<h2><span style="color: #34495e;">FAQ – Magic Truffles 6-pack</span></h2>
<div>
<p><button class="accordion" style="background-color: #eee; color: #444; cursor: pointer; padding: 18px; width: 100%; border: none; text-align: left; outline: none; font-size: 15px; transition: 0.4s; position: relative;"><strong>How do you use the truffles from the 6-pack?</strong><span style="position: absolute; right: 18px; transition: transform 0.4s;">▼</span></button></p>
<div class="panel" style="display: none;">
<p>Each package contains 15 grams of fresh truffles. Many users take between 5 and 15 grams depending on experience and desired intensity.</p>
</div>
<p><button class="accordion" style="background-color: #eee; color: #444; cursor: pointer; padding: 18px; width: 100%; border: none; text-align: left; outline: none; font-size: 15px; transition: 0.4s; position: relative;"><strong>Can you also use the truffles separately?</strong><span style="position: absolute; right: 18px; transition: transform 0.4s;">▼</span></button></p>
<div class="panel" style="display: none;">
<p>Yes. Each truffle variety is packed separately, so you can try each one at a different time.</p>
</div>
<p><button class="accordion" style="background-color: #eee; color: #444; cursor: pointer; padding: 18px; width: 100%; border: none; text-align: left; outline: none; font-size: 15px; transition: 0.4s; position: relative;"><strong>How long does a truffle experience last?</strong><span style="position: absolute; right: 18px; transition: transform 0.4s;">▼</span></button></p>
<div class="panel" style="display: none;">
<p>Most experiences last around 4 to 6 hours. The first effects usually begin after 30 to 60 minutes.</p>
</div>
<p><button class="accordion" style="background-color: #eee; color: #444; cursor: pointer; padding: 18px; width: 100%; border: none; text-align: left; outline: none; font-size: 15px; transition: 0.4s; position: relative;"><strong>How do you store fresh magic truffles?</strong><span style="position: absolute; right: 18px; transition: transform 0.4s;">▼</span></button></p>
<div class="panel" style="display: none;">
<p>Store fresh truffles in the refrigerator in their original packaging and preferably use them before the expiration date.</p>
</div>
</div>
<p>
<script>
var acc=document.getElementsByClassName("accordion");
for(var i=0;i<acc.length;i++){
acc[i].addEventListener("click",function(){
var panel=this.parentElement.nextElementSibling;
var arrow=this.querySelector("span");
if(panel.style.display==="block"){
panel.style.display="none";
arrow.style.transform="rotate(0deg)";
}else{
panel.style.display="block";
arrow.style.transform="rotate(180deg)";
}
});
}
</script>
</p> </div>
<div class="tabs__content" id="tabs_1625" style="padding: 10px;"><h3>Disclaimer:</h3>
<p>Magic truffles contain psilocybin, a psychoactive substance that can cause mind-altering effects. Do not use psilocybin truffles if you are a minor or pregnant, use is also not recommended for people with mental disorders (such as anxiety disorders or schizophrenia) and users of certain medications, including antidepressants and MAOIs. The effects are unpredictable and can vary from person to person. Always use in a safe environment, preferably under supervision. When in doubt, consult a doctor. <span>Handle psilocybin truffles responsibly and therefore, when using, do not participate in traffic. Do not drive a car or drive other vehicles.</span></p></div><div class="tabs__content" id="tabs_1626" style="padding: 10px;"><p><span>24High only ships to countries within Europe. This product is legal in the Netherlands. 24High cannot provide any information on the status, legal or illegal, of the product in other countries. Do you doubt whether the product you ordered is legal in the country where it is to be sent? Please inform yourself about this matter with the authorities of the country itself. Buyer bears responsibility. All our products are sent in discreet packaging. If you order truffles and live outside the Benelux, during the warm months we recommend adding a Recycold cool pack to your order to keep your products chilled for longer on the road.</span></p></div>
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
<div class="article__actions"><a aria-label="Product Recycold Cool Pack" class="article__button btn btn--secondary btn--block dialog-dismiss" href="5205818-recycold-cool-pack.html"><svg aria-hidden="true" class="svg-inline--fa fa-info-circle fa-fw" data-fa-i2svg="" data-icon="info-circle" data-prefix="fas" focusable="false" role="img" viewbox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="currentColor"></path></svg></a><a aria-label="Order Recycold Cool Pack" class="article__button btn btn--primary btn--block addArticleToCart dialog-dismiss" data-articlenumber="5205818" href="9110968-magic-truffles-6-pack.html#"><svg aria-hidden="true" class="svg-inline--fa fa-cart-plus fa-fw" data-fa-i2svg="" data-icon="cart-plus" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" fill="currentColor"></path></svg></a></div>
</div>
</div></div> </div>
</div>
<div class="clear"></div>
</div>
</div>