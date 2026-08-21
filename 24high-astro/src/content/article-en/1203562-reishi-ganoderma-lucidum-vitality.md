---
title: "Reishi (Ganoderma Lucidum) - Vitality - 24High"
description: "Reishi (Ganoderma Lucidum) - Vitality Buy online at 24High: ✔️ Simple ✔️ Fast and anonymous | Buy Online"
---
<div class="contentwrapper">
<div class="wrapper">
<script>
    dataLayer.push({
        ecommerce: null
    }); // Clear the previous ecommerce object.
    dataLayer.push({
        event: "view_item",
        ecommerce: {"items":[{"quantity":1,"price":34.95,"item_name":"Reishi (Ganoderma Lucidum) - Vitaliteit","item_id":"1203562"}],"currency":"EUR","value":34.95}    });


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
        "name": "Reishi (Ganoderma Lucidum) - Vitality",
        "image": "https://www.24high.com/images/articles/image.php?id=5024&w=300&h=300",
        "description": "Reishi (Ganoderma lucidum), also known as the lacquer mushroom, is a mushroom that has been used for centuries in traditional Asian herbal medicine. In China, this mushroom is known as &lsquo;Lingzhi&rsquo;, a name traditionally translated as &lsquo;mushroom of immortality&rsquo;. This name has historical and cultural significance and does not constitute a medical claim.\nMcMyco Reishi Vitality contains a full-spectrum extract made from 100% of the fruiting body of the Reishi mushroom. The extract is obtained using water and ethanol extraction, which preserves various natural constituents of the mushroom. The extract contains, amongst other things, 30% polysaccharides, including beta-glucans.\nAlthough Reishi is the subject of scientific research, the current evidence is insufficient to establish health benefits or medical effects in humans. This food supplement is not intended to prevent, treat or cure any diseases.\nIngredients\nPer capsule:\n\n\n400 mg Reishi (Ganoderma lucidum) extract (100% fruiting body)\n\n\nStandardised to 30% polysaccharides, including beta-glucans\n\n\nExcipients:\n\n\nMagnesium citrate\n\n\nSilicon dioxide\n\n\nDirections for use\nTake one capsule up to twice a day with water during a meal, unless otherwise advised by a healthcare professional.\nStorage instructions\nStore the product in a cool, dry and dark place, out of the reach of children.\nContents\n\n\n120 capsules of Reishi (Ganoderma lucidum) extract\n\n\nImportant information\n\n\nA food supplement is not a substitute for a varied and balanced diet and a healthy lifestyle.\n\n\nDo not exceed the recommended daily dose.\n\n\nConsult a doctor or qualified healthcare professional before use if you are pregnant, breastfeeding, taking medication or have a medical condition.\n\n\nKeep out of reach of young children.\n\n",
         "brand": {
                "@type": "Brand",
                "name": "mcmyco"
            },
         "sku": "1203562",
        "gtin13": "",
        "mpn": "",
        "offers": {
            "@type": "Offer",
            "priceCurrency": "EUR",
            "price": "34.95",
            "itemCondition": "http://schema.org/NewCondition",
            "availability": "http://schema.org/InStock",
            "url": "https://www.24high.com/en/article/1203562-reishi-ganoderma-lucidum-vitality?setlang=en&article=1203562-reishi-ganoderma-lucidum-vitality",
            "seller": {
                "@type": "Organization",
                "name": "24High"
            }
        }
            }
</script>
<div class="content">
<h1 class="h1 h1--line" style="color: rgb(101,101,101);">Reishi (Ganoderma Lucidum) - Vitality</h1>
<a class="a a--hover-primary" href="../healthshop/229-heart-and-blood-vessels.html" style="display: inline-block; margin-bottom:20px;">HEALTHSHOP -&gt; Heart and blood vessels</a>
<div class="columns columns--mobile800">
<div class="columns__column">
<div class="imagebox">
<div class="imagebox__maincontainer">
<img alt="Reishi (Ganoderma Lucidum) - Vitality" class="imagebox__mainimage" id="main-product-image" src="../../images/articles/image.php@id=5024&amp;w=1000&amp;h=1000">
<div id="interactive-viewer-container" style="display: none; width: 100%; height: 100%;"></div>
</img></div>
<div class="imagebox__thumbscontainer">
<div class="imagebox__thumbnail" data-url="https://www.24high.com/images/articles/image.php?id=5024&amp;w=1000&amp;h=1000"> <img alt="" src="../../images/articles/image.php@id=5024&amp;w=200&amp;h=200"/></div> </div>
</div>
</div>
<div class="columns__column columns__column--grow" style="padding-left: 10px;">
<div class="fx fx--ai-center">
<a class="a a--hover-primary fx__i" href="1203562-reishi-ganoderma-lucidum-vitality.html#" onclick="$('#reviewtabbtn').click().get(0).scrollIntoView();
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
<div class="fx__i">Article number: 1203562</div>
</div>
<br/>
<div id="articlePrice">
<span class="text-bold font-2x">€ 34,95</span> (Incl.VAT)            </div>
<br/><br/>
<br>
<div id="articleStockStatus"><i class="fa fa-check success"></i> In stock</div>
<br/>
<select class="input hidden" id="selectVariant" name="variation"><option value="1203562">Reishi (Ganoderma Lucidum) - Vitality</option></select>
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
<p><strong>Reishi (<em>Ganoderma lucidum</em>)</strong>, also known as the lacquer mushroom, is a mushroom that has been used for centuries in traditional Asian herbal medicine. In China, this mushroom is known as ‘Lingzhi’, a name traditionally translated as ‘mushroom of immortality’. This name has historical and cultural significance and does not constitute a medical claim.</p>
<p>McMyco Reishi Vitality contains a full-spectrum extract made from 100% of the fruiting body of the Reishi mushroom. The extract is obtained using water and ethanol extraction, which preserves various natural constituents of the mushroom. The extract contains, amongst other things, 30% polysaccharides, including beta-glucans.</p>
<p>Although Reishi is the subject of scientific research, the current evidence is insufficient to establish health benefits or medical effects in humans. This food supplement is not intended to prevent, treat or cure any diseases.</p>
<h2>Ingredients</h2>
<p><strong>Per capsule:</strong></p>
<ul>
<li>
<p>400 mg Reishi (<em>Ganoderma lucidum</em>) extract (100% fruiting body)</p>
</li>
<li>
<p>Standardised to 30% polysaccharides, including beta-glucans</p>
</li>
</ul>
<p><strong>Excipients:</strong></p>
<ul>
<li>
<p>Magnesium citrate</p>
</li>
<li>
<p>Silicon dioxide</p>
</li>
</ul>
<h2>Directions for use</h2>
<p>Take one capsule up to twice a day with water during a meal, unless otherwise advised by a healthcare professional.</p>
<h2>Storage instructions</h2>
<p>Store the product in a cool, dry and dark place, out of the reach of children.</p>
<h2>Contents</h2>
<ul>
<li>
<p>120 capsules of Reishi (<em>Ganoderma lucidum</em>) extract</p>
</li>
</ul>
<h2>Important information</h2>
<ul>
<li>
<p>A food supplement is not a substitute for a varied and balanced diet and a healthy lifestyle.</p>
</li>
<li>
<p>Do not exceed the recommended daily dose.</p>
</li>
<li>
<p>Consult a doctor or qualified healthcare professional before use if you are pregnant, breastfeeding, taking medication or have a medical condition.</p>
</li>
<li>
<p>Keep out of reach of young children.</p>
</li>
</ul> </div>
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
<h3>Similar items</h3><div class="carousel"><div class="article article--carousel" itemscope="" itemtype="http://schema.org/Product"><div class="article__header"><meta content="https://www.24high.com/images/articles/image.php?id=3419&amp;w=300&amp;h=300" itemprop="image"/><div class="article__image data-link cursor-pointer" data-link="https://www.24high.com/en/article/1203195-chaga-mushroom-extract-foodsporen"><img alt="Chaga Mushroom Extract (Foodsporen)" class="lazyload" data-src="https://www.24high.com/images/articles/image.php?id=3419&amp;w=300&amp;h=300" src="../../images/articles/blank.gif"/></div> </div>
<div class="article__footer">
<div class="article__description data-link" data-link="https://www.24high.com/en/article/1203195-chaga-mushroom-extract-foodsporen"><a href="1203195-chaga-mushroom-extract-foodsporen.html"><span itemprop="name">Chaga Mushroom Extract (Foodsporen)</span></a></div>
<div class="text-center"><div class="rating" data-rating="5" itemprop="aggregateRating" itemscope="" itemtype="http://schema.org/AggregateRating">
<meta content="5" itemprop="bestRating"><meta content="5" itemprop="ratingValue"><meta content="1" itemprop="ratingCount">
<span class="rating__empty">
<span class="rating__btn" data-rating="1"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="2"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="3"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="4"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="5"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span>
</span>
<div class="rating__filled" style="width: 100%;">
<div class="rating__filcont">
<svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg>
</div>
</div>
</meta></meta></meta></div></div>
<div class="article__price data-link primary" data-link="https://www.24high.com/en/article/1203195-chaga-mushroom-extract-foodsporen" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"><a href="1203195-chaga-mushroom-extract-foodsporen.html">€ 29,50</a><meta content="EUR" itemprop="priceCurrency"/><meta content="29.5" itemprop="price"/><link href="http://schema.org/InStock" itemprop="availability"/></div>
<div class="article__actions"><a aria-label="Product Chaga Mushroom Extract (Foodsporen)" class="article__button btn btn--secondary btn--block dialog-dismiss" href="1203195-chaga-mushroom-extract-foodsporen.html"><svg aria-hidden="true" class="svg-inline--fa fa-info-circle fa-fw" data-fa-i2svg="" data-icon="info-circle" data-prefix="fas" focusable="false" role="img" viewbox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="currentColor"></path></svg></a><a aria-label="Order Chaga Mushroom Extract (Foodsporen)" class="article__button btn btn--primary btn--block addArticleToCart dialog-dismiss" data-articlenumber="1203195" href="1203562-reishi-ganoderma-lucidum-vitality.html#"><svg aria-hidden="true" class="svg-inline--fa fa-cart-plus fa-fw" data-fa-i2svg="" data-icon="cart-plus" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" fill="currentColor"></path></svg></a></div>
</div>
</div><div class="article article--carousel" itemscope="" itemtype="http://schema.org/Product"><div class="article__header"><meta content="https://www.24high.com/images/articles/image.php?id=3911&amp;w=300&amp;h=300" itemprop="image"/><div class="article__image data-link cursor-pointer" data-link="https://www.24high.com/en/article/3208536-matcha-powder"><img alt="Matcha Powder " class="lazyload" data-src="https://www.24high.com/images/articles/image.php?id=3911&amp;w=300&amp;h=300" src="../../images/articles/blank.gif"/></div> </div>
<div class="article__footer">
<div class="article__description data-link" data-link="https://www.24high.com/en/article/3208536-matcha-powder"><a href="3208536-matcha-powder.html"><span itemprop="name">Matcha Powder </span></a></div>
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
<div class="article__price data-link primary" data-link="https://www.24high.com/en/article/3208536-matcha-powder" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"><a href="3208536-matcha-powder.html">€ 9,95</a><meta content="EUR" itemprop="priceCurrency"/><meta content="9.95" itemprop="price"/><link href="http://schema.org/InStock" itemprop="availability"/></div>
<div class="article__actions"><a aria-label="Product Matcha Powder " class="article__button btn btn--secondary btn--block dialog-dismiss" href="3208536-matcha-powder.html"><svg aria-hidden="true" class="svg-inline--fa fa-info-circle fa-fw" data-fa-i2svg="" data-icon="info-circle" data-prefix="fas" focusable="false" role="img" viewbox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="currentColor"></path></svg></a><a aria-label="Order Matcha Powder " class="article__button btn btn--primary btn--block addArticleToCart dialog-dismiss" data-articlenumber="3208536" href="1203562-reishi-ganoderma-lucidum-vitality.html#"><svg aria-hidden="true" class="svg-inline--fa fa-cart-plus fa-fw" data-fa-i2svg="" data-icon="cart-plus" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" fill="currentColor"></path></svg></a></div>
</div>
</div><div class="article article--carousel" itemscope="" itemtype="http://schema.org/Product"><div class="article__header"><meta content="https://www.24high.com/images/articles/image.php?id=3953&amp;w=300&amp;h=300" itemprop="image"/><div class="article__image data-link cursor-pointer" data-link="https://www.24high.com/en/article/3209566-chaga-mushroom-powder"><img alt="Chaga Mushroom Powder" class="lazyload" data-src="https://www.24high.com/images/articles/image.php?id=3953&amp;w=300&amp;h=300" src="../../images/articles/blank.gif"/></div> </div>
<div class="article__footer">
<div class="article__description data-link" data-link="https://www.24high.com/en/article/3209566-chaga-mushroom-powder"><a href="3209566-chaga-mushroom-powder.html"><span itemprop="name">Chaga Mushroom Powder</span></a></div>
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
<div class="article__price data-link primary" data-link="https://www.24high.com/en/article/3209566-chaga-mushroom-powder" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"><a href="3209566-chaga-mushroom-powder.html"><span class="article__oldprice">€ 22,95</span> € 16,95</a><meta content="EUR" itemprop="priceCurrency"/><meta content="16.95" itemprop="price"/><link href="http://schema.org/InStock" itemprop="availability"/></div>
<div class="article__actions"><a aria-label="Product Chaga Mushroom Powder" class="article__button btn btn--secondary btn--block dialog-dismiss" href="3209566-chaga-mushroom-powder.html"><svg aria-hidden="true" class="svg-inline--fa fa-info-circle fa-fw" data-fa-i2svg="" data-icon="info-circle" data-prefix="fas" focusable="false" role="img" viewbox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="currentColor"></path></svg></a><a aria-label="Order Chaga Mushroom Powder" class="article__button btn btn--primary btn--block addArticleToCart dialog-dismiss" data-articlenumber="3209566" href="1203562-reishi-ganoderma-lucidum-vitality.html#"><svg aria-hidden="true" class="svg-inline--fa fa-cart-plus fa-fw" data-fa-i2svg="" data-icon="cart-plus" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" fill="currentColor"></path></svg></a></div>
</div>
</div><div class="article article--carousel" itemscope="" itemtype="http://schema.org/Product"><div class="article__header"><meta content="https://www.24high.com/images/articles/image.php?id=5370&amp;w=300&amp;h=300" itemprop="image"/><div class="article__image data-link cursor-pointer" data-link="https://www.24high.com/en/article/4202644-ceremonial-raw-cacao-beans-bolivia"><img alt="Ceremonial Raw Cacao Beans - Bolivia" class="lazyload" data-src="https://www.24high.com/images/articles/image.php?id=5370&amp;w=300&amp;h=300" src="../../images/articles/blank.gif"/></div> </div>
<div class="article__footer">
<div class="article__description data-link" data-link="https://www.24high.com/en/article/4202644-ceremonial-raw-cacao-beans-bolivia"><a href="4202644-ceremonial-raw-cacao-beans-bolivia.html"><span itemprop="name">Ceremonial Raw Cacao Beans - Bolivia</span></a></div>
<div class="text-center"><div class="rating" data-rating="5" itemprop="aggregateRating" itemscope="" itemtype="http://schema.org/AggregateRating">
<meta content="5" itemprop="bestRating"><meta content="5" itemprop="ratingValue"><meta content="1" itemprop="ratingCount">
<span class="rating__empty">
<span class="rating__btn" data-rating="1"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="2"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="3"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="4"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="5"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span>
</span>
<div class="rating__filled" style="width: 100%;">
<div class="rating__filcont">
<svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg>
</div>
</div>
</meta></meta></meta></div></div>
<div class="article__price data-link primary" data-link="https://www.24high.com/en/article/4202644-ceremonial-raw-cacao-beans-bolivia" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"><a href="4202644-ceremonial-raw-cacao-beans-bolivia.html">€ 14,95</a><meta content="EUR" itemprop="priceCurrency"/><meta content="14.95" itemprop="price"/><link href="http://schema.org/InStock" itemprop="availability"/></div>
<div class="article__actions"><a aria-label="Product Ceremonial Raw Cacao Beans - Bolivia" class="article__button btn btn--secondary btn--block dialog-dismiss" href="4202644-ceremonial-raw-cacao-beans-bolivia.html"><svg aria-hidden="true" class="svg-inline--fa fa-info-circle fa-fw" data-fa-i2svg="" data-icon="info-circle" data-prefix="fas" focusable="false" role="img" viewbox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="currentColor"></path></svg></a><a aria-label="Order Ceremonial Raw Cacao Beans - Bolivia" class="article__button btn btn--primary btn--block addArticleToCart dialog-dismiss" data-articlenumber="4202644" href="1203562-reishi-ganoderma-lucidum-vitality.html#"><svg aria-hidden="true" class="svg-inline--fa fa-cart-plus fa-fw" data-fa-i2svg="" data-icon="cart-plus" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" fill="currentColor"></path></svg></a></div>
</div>
</div><div class="article article--carousel" itemscope="" itemtype="http://schema.org/Product"><div class="article__header"><meta content="https://www.24high.com/images/articles/image.php?id=4051&amp;w=300&amp;h=300" itemprop="image"/><div class="article__image data-link cursor-pointer" data-link="https://www.24high.com/en/article/3210653-mushroom-gummies-lions-mane-mixed"><img alt="Mushroom Gummies Lion's Mane - Mixed" class="lazyload" data-src="https://www.24high.com/images/articles/image.php?id=4051&amp;w=300&amp;h=300" src="../../images/articles/blank.gif"/></div> </div>
<div class="article__footer">
<div class="article__description data-link" data-link="https://www.24high.com/en/article/3210653-mushroom-gummies-lions-mane-mixed"><a href="3210653-mushroom-gummies-lions-mane-mixed.html"><span itemprop="name">Mushroom Gummies Lion's Mane - Mixed</span></a></div>
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
<div class="article__price data-link primary" data-link="https://www.24high.com/en/article/3210653-mushroom-gummies-lions-mane-mixed" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"><a href="3210653-mushroom-gummies-lions-mane-mixed.html">€ 9,95</a><meta content="EUR" itemprop="priceCurrency"/><meta content="9.95" itemprop="price"/><link href="http://schema.org/InStock" itemprop="availability"/></div>
<div class="article__actions"><a -="" aria-label="Product Mushroom Gummies Lion" class="article__button btn btn--secondary btn--block dialog-dismiss" href="3210653-mushroom-gummies-lions-mane-mixed.html" mane="" mixed'="" s=""><svg aria-hidden="true" class="svg-inline--fa fa-info-circle fa-fw" data-fa-i2svg="" data-icon="info-circle" data-prefix="fas" focusable="false" role="img" viewbox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="currentColor"></path></svg></a><a -="" aria-label="Order Mushroom Gummies Lion" class="article__button btn btn--primary btn--block addArticleToCart dialog-dismiss" data-articlenumber="3210653" href="1203562-reishi-ganoderma-lucidum-vitality.html#" mane="" mixed'="" s=""><svg aria-hidden="true" class="svg-inline--fa fa-cart-plus fa-fw" data-fa-i2svg="" data-icon="cart-plus" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" fill="currentColor"></path></svg></a></div>
</div>
</div><div class="article article--carousel" itemscope="" itemtype="http://schema.org/Product"><div class="article__header"><meta content="https://www.24high.com/images/articles/image.php?id=3909&amp;w=300&amp;h=300" itemprop="image"/><div class="article__image data-link cursor-pointer" data-link="https://www.24high.com/en/article/3208150-freeze-dried-acai-powder"><img alt="Freeze-dried acai powder " class="lazyload" data-src="https://www.24high.com/images/articles/image.php?id=3909&amp;w=300&amp;h=300" src="../../images/articles/blank.gif"/></div> </div>
<div class="article__footer">
<div class="article__description data-link" data-link="https://www.24high.com/en/article/3208150-freeze-dried-acai-powder"><a href="3208150-freeze-dried-acai-powder.html"><span itemprop="name">Freeze-dried acai powder </span></a></div>
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
<div class="article__price data-link primary" data-link="https://www.24high.com/en/article/3208150-freeze-dried-acai-powder" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"><a href="3208150-freeze-dried-acai-powder.html">€ 14,95</a><meta content="EUR" itemprop="priceCurrency"/><meta content="14.95" itemprop="price"/><link href="http://schema.org/InStock" itemprop="availability"/></div>
<div class="article__actions"><a aria-label="Product Freeze-dried acai powder " class="article__button btn btn--secondary btn--block dialog-dismiss" href="3208150-freeze-dried-acai-powder.html"><svg aria-hidden="true" class="svg-inline--fa fa-info-circle fa-fw" data-fa-i2svg="" data-icon="info-circle" data-prefix="fas" focusable="false" role="img" viewbox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="currentColor"></path></svg></a><a aria-label="Order Freeze-dried acai powder " class="article__button btn btn--primary btn--block addArticleToCart dialog-dismiss" data-articlenumber="3208150" href="1203562-reishi-ganoderma-lucidum-vitality.html#"><svg aria-hidden="true" class="svg-inline--fa fa-cart-plus fa-fw" data-fa-i2svg="" data-icon="cart-plus" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" fill="currentColor"></path></svg></a></div>
</div>
</div></div> </div>
</div>
<div class="clear"></div>
</div>
</div>