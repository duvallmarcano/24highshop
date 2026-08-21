---
title: "SLX Grinder Aluminium Non Sticky 62 mm - Charcoal - 24High"
description: "SLX Grinder Aluminium Non Sticky 62 mm - Charcoal Buy online at 24High: ✔️ Simple ✔️ Fast and anonymous | Buy Online"
---
<div class="contentwrapper">
<div class="wrapper">
<script>
    dataLayer.push({
        ecommerce: null
    }); // Clear the previous ecommerce object.
    dataLayer.push({
        event: "view_item",
        ecommerce: {"items":[{"quantity":1,"price":59.95,"item_name":"SLX Grinder Aluminium Non Sticky 62 mm - Charcoal","item_id":"8107385"}],"currency":"EUR","value":59.95}    });


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
        "name": "SLX Grinder Aluminium Non Sticky 62 mm - Charcoal",
        "image": "https://www.24high.com/images/articles/image.php?id=603&w=300&h=300",
        "description": "The improved SLX grinder is not sticky thanks to the nano coating. This prevents the coating from sticking and you can grind the herbs very fine. This version also contains sharper teeth and the grinder is free of Teflon and other toxic chemicals.\nExtra information:\n\nColour: matte black coating.\nMaterial: aluminum\nFDA certifies\n\nContent:\nSLX Grinder aluminum Non Sticky 50mm",
         "brand": {
                "@type": "Brand",
                "name": "SLX"
            },
         "sku": "8107385",
        "gtin13": "",
        "mpn": "ACC-414CH",
        "offers": {
            "@type": "Offer",
            "priceCurrency": "EUR",
            "price": "59.95",
            "itemCondition": "http://schema.org/NewCondition",
            "availability": "http://schema.org/InStock",
            "url": "https://www.24high.com/en/article/8107385-slx-grinder-aluminium-non-sticky-62-mm-charcoal?setlang=en&article=8107385-slx-grinder-aluminium-non-sticky-62-mm-charcoal",
            "seller": {
                "@type": "Organization",
                "name": "24High"
            }
        }
            }
</script>
<div class="content">
<h1 class="h1 h1--line" style="color: rgb(101,101,101);">SLX Grinder Aluminium Non Sticky 62 mm - Charcoal</h1>
<a class="a a--hover-primary" href="../headshop/115-grinders-iron.html" style="display: inline-block; margin-bottom:20px;">Grinders -&gt; HEADSHOP -&gt; Grinders - Iron</a>
<div class="columns columns--mobile800">
<div class="columns__column">
<div class="imagebox">
<div class="imagebox__maincontainer">
<img alt="SLX Grinder Aluminium Non Sticky 62 mm - Charcoal" class="imagebox__mainimage" id="main-product-image" src="../../images/articles/image.php@id=603&amp;w=1000&amp;h=1000">
<div id="interactive-viewer-container" style="display: none; width: 100%; height: 100%;"></div>
</img></div>
<div class="imagebox__thumbscontainer">
<div class="imagebox__thumbnail" data-url="https://www.24high.com/images/articles/image.php?id=603&amp;w=1000&amp;h=1000"> <img alt="" src="../../images/articles/image.php@id=603&amp;w=200&amp;h=200"/></div> </div>
</div>
</div>
<div class="columns__column columns__column--grow" style="padding-left: 10px;">
<div class="fx fx--ai-center">
<a class="a a--hover-primary fx__i" href="8107385-slx-grinder-aluminium-non-sticky-62-mm-charcoal.html#" onclick="$('#reviewtabbtn').click().get(0).scrollIntoView();
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
<div class="fx__i">Article number: 8107385</div>
</div>
<br/>
<div id="articlePrice">
<span class="text-bold font-2x">€ 59,95</span> (Incl.VAT)            </div>
<br/><br/>
<br>
<div id="articleStockStatus"><i class="fa fa-check success"></i> In stock</div>
<br/>
<select class="input hidden" id="selectVariant" name="variation"><option value="8107385">SLX Grinder Aluminium Non Sticky 62 mm - Charcoal</option></select>
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
<div class="tabs__button" data-tabscontent="#tabs_1129"><i class="far fa-info-circle fa-fw"></i> Info</div><div class="tabs__button" data-tabscontent="#tabs_1130"><i class="far fa-info-circle fa-fw"></i> Video</div> <div class="tabs__button tabs__button--secondary" data-tabscontent="#tabs_reviews" id="reviewtabbtn"><i class="fas fa-star fa-fw"></i> Reviews</div>
</div>
<div class="tabs__content" id="tabs_description" style="padding: 10px;">
<p>The improved<strong> SLX grinder</strong> is not sticky thanks to the nano coating. This prevents the coating from sticking and you can grind the herbs very fine. This version also contains sharper teeth and the grinder is free of Teflon and other toxic chemicals.</p>
<h3>Extra information:</h3>
<ul>
<li>Colour: matte black coating.</li>
<li>Material: aluminum</li>
<li>FDA certifies</li>
</ul>
<h3>Content:</h3>
<p>SLX Grinder aluminum Non Sticky 50mm</p> </div>
<div class="tabs__content" id="tabs_1129" style="padding: 10px;"><ul>
<li>Ultra low friction ceramic coating</li>
<li>Repels water and oils</li>
<li>SLX the only grinder that Never Sticks and never needs cleaning.</li>
<li>Formulated to eliminate friction and prevent debris from building up on the cutting area</li>
<li>Cerami-Coat provides an effortless grind and annihilates “cleaning” from your customer's vocabulary.</li>
<li>SLX shatters every expectation of what a perfect grinder should be</li>
<li>Developed from materials that reduce friction on industrial blades and cutting tools</li>
<li>It will never chip, flake, or burn</li>
<li>Literally repels sticky buildup</li>
<li>Say “goodbye” to stuck grinders and difficult turning.</li>
<li>NO Teflon, PTFE, or other toxic chemicals! </li>
<li>FDA certified for food contact</li>
</ul></div><div class="tabs__content" id="tabs_1130" style="padding: 10px;"><!--[if gte mso 9]><xml>
 <o:OfficeDocumentSettings>
  <o:AllowPNG></o:AllowPNG>
 </o:OfficeDocumentSettings>
</xml><![endif]--><!--[if gte mso 9]><xml>
 <w:WordDocument>
  <w:View>Normal</w:View>
  <w:Zoom>0</w:Zoom>
  <w:TrackMoves></w:TrackMoves>
  <w:TrackFormatting></w:TrackFormatting>
  <w:HyphenationZone>21</w:HyphenationZone>
  <w:PunctuationKerning></w:PunctuationKerning>
  <w:ValidateAgainstSchemas></w:ValidateAgainstSchemas>
  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>
  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
  <w:DoNotPromoteQF></w:DoNotPromoteQF>
  <w:LidThemeOther>NL</w:LidThemeOther>
  <w:LidThemeAsian>X-NONE</w:LidThemeAsian>
  <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>
  <w:Compatibility>
   <w:BreakWrappedTables></w:BreakWrappedTables>
   <w:SnapToGridInCell></w:SnapToGridInCell>
   <w:WrapTextWithPunct></w:WrapTextWithPunct>
   <w:UseAsianBreakRules></w:UseAsianBreakRules>
   <w:DontGrowAutofit></w:DontGrowAutofit>
   <w:SplitPgBreakAndParaMark></w:SplitPgBreakAndParaMark>
   <w:EnableOpenTypeKerning></w:EnableOpenTypeKerning>
   <w:DontFlipMirrorIndents></w:DontFlipMirrorIndents>
   <w:OverrideTableStyleHps></w:OverrideTableStyleHps>
  </w:Compatibility>
  <m:mathPr>
   <m:mathFont m:val="Cambria Math"></m:mathFont>
   <m:brkBin m:val="before"></m:brkBin>
   <m:brkBinSub m:val="--"></m:brkBinSub>
   <m:smallFrac m:val="off"></m:smallFrac>
   <m:dispDef></m:dispDef>
   <m:lMargin m:val="0"></m:lMargin>
   <m:rMargin m:val="0"></m:rMargin>
   <m:defJc m:val="centerGroup"></m:defJc>
   <m:wrapIndent m:val="1440"></m:wrapIndent>
   <m:intLim m:val="subSup"></m:intLim>
   <m:naryLim m:val="undOvr"></m:naryLim>
  </m:mathPr></w:WordDocument>
</xml><![endif]--><!--[if gte mso 9]><xml>
 <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"
  DefSemiHidden="false" DefQFormat="false" DefPriority="99"
  LatentStyleCount="371">
  <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"></w:LsdException>
  <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 7"></w:LsdException>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 8"></w:LsdException>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 9"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 4"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 5"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 6"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 7"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 8"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 9"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 7"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 8"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 9"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Normal Indent"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="footnote text"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="annotation text"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="header"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="footer"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index heading"></w:LsdException>
  <w:LsdException Locked="false" Priority="35" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="caption"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="table of figures"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="envelope address"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="envelope return"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="footnote reference"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="annotation reference"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="line number"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="page number"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="endnote reference"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="endnote text"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="table of authorities"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="macro"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="toa heading"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List 4"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List 5"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet 4"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet 5"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number 4"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Closing"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Signature"></w:LsdException>
  <w:LsdException Locked="false" Priority="1" SemiHidden="true"
   UnhideWhenUsed="true" Name="Default Paragraph Font"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text Indent"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 4"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 5"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Message Header"></w:LsdException>
  <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Salutation"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Date"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text First Indent"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text First Indent 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Note Heading"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text Indent 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text Indent 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Block Text"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Hyperlink"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="FollowedHyperlink"></w:LsdException>
  <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"></w:LsdException>
  <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Document Map"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Plain Text"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="E-mail Signature"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Top of Form"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Bottom of Form"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Normal (Web)"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Acronym"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Address"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Cite"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Code"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Definition"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Keyboard"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Preformatted"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Sample"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Typewriter"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Variable"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Normal Table"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="annotation subject"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="No List"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Outline List 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Outline List 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Outline List 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Simple 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Simple 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Simple 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Classic 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Classic 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Classic 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Classic 4"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Colorful 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Colorful 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Colorful 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 4"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 5"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 4"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 5"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 6"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 7"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 8"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 4"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 5"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 6"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 7"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 8"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table 3D effects 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table 3D effects 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table 3D effects 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Contemporary"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Elegant"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Professional"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Subtle 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Subtle 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Web 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Web 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Web 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Balloon Text"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" Name="Table Grid"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Theme"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"></w:LsdException>
  <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"></w:LsdException>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading"></w:LsdException>
  <w:LsdException Locked="false" Priority="61" Name="Light List"></w:LsdException>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid"></w:LsdException>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="70" Name="Dark List"></w:LsdException>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"></w:LsdException>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List"></w:LsdException>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"></w:LsdException>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" Name="Revision"></w:LsdException>
  <w:LsdException Locked="false" Priority="34" QFormat="true"
   Name="List Paragraph"></w:LsdException>
  <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"></w:LsdException>
  <w:LsdException Locked="false" Priority="30" QFormat="true"
   Name="Intense Quote"></w:LsdException>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="19" QFormat="true"
   Name="Subtle Emphasis"></w:LsdException>
  <w:LsdException Locked="false" Priority="21" QFormat="true"
   Name="Intense Emphasis"></w:LsdException>
  <w:LsdException Locked="false" Priority="31" QFormat="true"
   Name="Subtle Reference"></w:LsdException>
  <w:LsdException Locked="false" Priority="32" QFormat="true"
   Name="Intense Reference"></w:LsdException>
  <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"></w:LsdException>
  <w:LsdException Locked="false" Priority="37" SemiHidden="true"
   UnhideWhenUsed="true" Name="Bibliography"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"></w:LsdException>
  <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"></w:LsdException>
  <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"></w:LsdException>
  <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"></w:LsdException>
  <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"></w:LsdException>
  <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"></w:LsdException>
  <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 6"></w:LsdException>
 </w:LatentStyles>
</xml><![endif]--><!--[if gte mso 10]>
<style>
 /* Style Definitions */
 table.MsoNormalTable
	{mso-style-name:Standaardtabel;
	mso-tstyle-rowband-size:0;
	mso-tstyle-colband-size:0;
	mso-style-noshow:yes;
	mso-style-priority:99;
	mso-style-parent:"";
	mso-padding-alt:0cm 5.4pt 0cm 5.4pt;
	mso-para-margin-top:0cm;
	mso-para-margin-right:0cm;
	mso-para-margin-bottom:8.0pt;
	mso-para-margin-left:0cm;
	line-height:107%;
	mso-pagination:widow-orphan;
	font-size:11.0pt;
	font-family:"Calibri",sans-serif;
	mso-ascii-font-family:Calibri;
	mso-ascii-theme-font:minor-latin;
	mso-hansi-font-family:Calibri;
	mso-hansi-theme-font:minor-latin;
	mso-bidi-font-family:"Times New Roman";
	mso-bidi-theme-font:minor-bidi;
	mso-fareast-language:EN-US;}
</style>
<![endif]-->
<!--[if gte mso 9]><xml>
 <o:OfficeDocumentSettings>
  <o:AllowPNG></o:AllowPNG>
 </o:OfficeDocumentSettings>
</xml><![endif]--><!--[if gte mso 9]><xml>
 <w:WordDocument>
  <w:View>Normal</w:View>
  <w:Zoom>0</w:Zoom>
  <w:TrackMoves></w:TrackMoves>
  <w:TrackFormatting></w:TrackFormatting>
  <w:HyphenationZone>21</w:HyphenationZone>
  <w:PunctuationKerning></w:PunctuationKerning>
  <w:ValidateAgainstSchemas></w:ValidateAgainstSchemas>
  <w:SaveIfXMLInvalid>false</w:SaveIfXMLInvalid>
  <w:IgnoreMixedContent>false</w:IgnoreMixedContent>
  <w:AlwaysShowPlaceholderText>false</w:AlwaysShowPlaceholderText>
  <w:DoNotPromoteQF></w:DoNotPromoteQF>
  <w:LidThemeOther>NL</w:LidThemeOther>
  <w:LidThemeAsian>X-NONE</w:LidThemeAsian>
  <w:LidThemeComplexScript>X-NONE</w:LidThemeComplexScript>
  <w:Compatibility>
   <w:BreakWrappedTables></w:BreakWrappedTables>
   <w:SnapToGridInCell></w:SnapToGridInCell>
   <w:WrapTextWithPunct></w:WrapTextWithPunct>
   <w:UseAsianBreakRules></w:UseAsianBreakRules>
   <w:DontGrowAutofit></w:DontGrowAutofit>
   <w:SplitPgBreakAndParaMark></w:SplitPgBreakAndParaMark>
   <w:EnableOpenTypeKerning></w:EnableOpenTypeKerning>
   <w:DontFlipMirrorIndents></w:DontFlipMirrorIndents>
   <w:OverrideTableStyleHps></w:OverrideTableStyleHps>
  </w:Compatibility>
  <m:mathPr>
   <m:mathFont m:val="Cambria Math"></m:mathFont>
   <m:brkBin m:val="before"></m:brkBin>
   <m:brkBinSub m:val="--"></m:brkBinSub>
   <m:smallFrac m:val="off"></m:smallFrac>
   <m:dispDef></m:dispDef>
   <m:lMargin m:val="0"></m:lMargin>
   <m:rMargin m:val="0"></m:rMargin>
   <m:defJc m:val="centerGroup"></m:defJc>
   <m:wrapIndent m:val="1440"></m:wrapIndent>
   <m:intLim m:val="subSup"></m:intLim>
   <m:naryLim m:val="undOvr"></m:naryLim>
  </m:mathPr></w:WordDocument>
</xml><![endif]--><!--[if gte mso 9]><xml>
 <w:LatentStyles DefLockedState="false" DefUnhideWhenUsed="false"
  DefSemiHidden="false" DefQFormat="false" DefPriority="99"
  LatentStyleCount="371">
  <w:LsdException Locked="false" Priority="0" QFormat="true" Name="Normal"></w:LsdException>
  <w:LsdException Locked="false" Priority="9" QFormat="true" Name="heading 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 7"></w:LsdException>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 8"></w:LsdException>
  <w:LsdException Locked="false" Priority="9" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="heading 9"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 4"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 5"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 6"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 7"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 8"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index 9"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 7"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 8"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" Name="toc 9"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Normal Indent"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="footnote text"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="annotation text"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="header"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="footer"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="index heading"></w:LsdException>
  <w:LsdException Locked="false" Priority="35" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="caption"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="table of figures"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="envelope address"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="envelope return"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="footnote reference"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="annotation reference"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="line number"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="page number"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="endnote reference"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="endnote text"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="table of authorities"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="macro"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="toa heading"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List 4"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List 5"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet 4"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Bullet 5"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number 4"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Number 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="10" QFormat="true" Name="Title"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Closing"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Signature"></w:LsdException>
  <w:LsdException Locked="false" Priority="1" SemiHidden="true"
   UnhideWhenUsed="true" Name="Default Paragraph Font"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text Indent"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 4"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="List Continue 5"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Message Header"></w:LsdException>
  <w:LsdException Locked="false" Priority="11" QFormat="true" Name="Subtitle"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Salutation"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Date"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text First Indent"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text First Indent 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Note Heading"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text Indent 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Body Text Indent 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Block Text"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Hyperlink"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="FollowedHyperlink"></w:LsdException>
  <w:LsdException Locked="false" Priority="22" QFormat="true" Name="Strong"></w:LsdException>
  <w:LsdException Locked="false" Priority="20" QFormat="true" Name="Emphasis"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Document Map"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Plain Text"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="E-mail Signature"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Top of Form"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Bottom of Form"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Normal (Web)"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Acronym"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Address"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Cite"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Code"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Definition"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Keyboard"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Preformatted"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Sample"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Typewriter"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="HTML Variable"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Normal Table"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="annotation subject"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="No List"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Outline List 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Outline List 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Outline List 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Simple 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Simple 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Simple 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Classic 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Classic 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Classic 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Classic 4"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Colorful 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Colorful 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Colorful 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 4"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Columns 5"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 4"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 5"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 6"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 7"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Grid 8"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 4"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 5"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 6"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 7"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table List 8"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table 3D effects 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table 3D effects 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table 3D effects 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Contemporary"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Elegant"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Professional"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Subtle 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Subtle 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Web 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Web 2"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Web 3"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Balloon Text"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" Name="Table Grid"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" UnhideWhenUsed="true"
   Name="Table Theme"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" Name="Placeholder Text"></w:LsdException>
  <w:LsdException Locked="false" Priority="1" QFormat="true" Name="No Spacing"></w:LsdException>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading"></w:LsdException>
  <w:LsdException Locked="false" Priority="61" Name="Light List"></w:LsdException>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid"></w:LsdException>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="70" Name="Dark List"></w:LsdException>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading"></w:LsdException>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List"></w:LsdException>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid"></w:LsdException>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" SemiHidden="true" Name="Revision"></w:LsdException>
  <w:LsdException Locked="false" Priority="34" QFormat="true"
   Name="List Paragraph"></w:LsdException>
  <w:LsdException Locked="false" Priority="29" QFormat="true" Name="Quote"></w:LsdException>
  <w:LsdException Locked="false" Priority="30" QFormat="true"
   Name="Intense Quote"></w:LsdException>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="60" Name="Light Shading Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="61" Name="Light List Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="62" Name="Light Grid Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="63" Name="Medium Shading 1 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="64" Name="Medium Shading 2 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="65" Name="Medium List 1 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="66" Name="Medium List 2 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="67" Name="Medium Grid 1 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="68" Name="Medium Grid 2 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="69" Name="Medium Grid 3 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="70" Name="Dark List Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="71" Name="Colorful Shading Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="72" Name="Colorful List Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="73" Name="Colorful Grid Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="19" QFormat="true"
   Name="Subtle Emphasis"></w:LsdException>
  <w:LsdException Locked="false" Priority="21" QFormat="true"
   Name="Intense Emphasis"></w:LsdException>
  <w:LsdException Locked="false" Priority="31" QFormat="true"
   Name="Subtle Reference"></w:LsdException>
  <w:LsdException Locked="false" Priority="32" QFormat="true"
   Name="Intense Reference"></w:LsdException>
  <w:LsdException Locked="false" Priority="33" QFormat="true" Name="Book Title"></w:LsdException>
  <w:LsdException Locked="false" Priority="37" SemiHidden="true"
   UnhideWhenUsed="true" Name="Bibliography"></w:LsdException>
  <w:LsdException Locked="false" Priority="39" SemiHidden="true"
   UnhideWhenUsed="true" QFormat="true" Name="TOC Heading"></w:LsdException>
  <w:LsdException Locked="false" Priority="41" Name="Plain Table 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="42" Name="Plain Table 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="43" Name="Plain Table 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="44" Name="Plain Table 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="45" Name="Plain Table 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="40" Name="Grid Table Light"></w:LsdException>
  <w:LsdException Locked="false" Priority="46" Name="Grid Table 1 Light"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark"></w:LsdException>
  <w:LsdException Locked="false" Priority="51" Name="Grid Table 6 Colorful"></w:LsdException>
  <w:LsdException Locked="false" Priority="52" Name="Grid Table 7 Colorful"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="Grid Table 1 Light Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="Grid Table 2 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="Grid Table 3 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="Grid Table 4 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="Grid Table 5 Dark Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="Grid Table 6 Colorful Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="Grid Table 7 Colorful Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="46" Name="List Table 1 Light"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark"></w:LsdException>
  <w:LsdException Locked="false" Priority="51" Name="List Table 6 Colorful"></w:LsdException>
  <w:LsdException Locked="false" Priority="52" Name="List Table 7 Colorful"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 1"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 2"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 3"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 4"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 5"></w:LsdException>
  <w:LsdException Locked="false" Priority="46"
   Name="List Table 1 Light Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="47" Name="List Table 2 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="48" Name="List Table 3 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="49" Name="List Table 4 Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="50" Name="List Table 5 Dark Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="51"
   Name="List Table 6 Colorful Accent 6"></w:LsdException>
  <w:LsdException Locked="false" Priority="52"
   Name="List Table 7 Colorful Accent 6"></w:LsdException>
 </w:LatentStyles>
</xml><![endif]--><!--[if gte mso 10]>
<style>
 /* Style Definitions */
 table.MsoNormalTable
	{mso-style-name:Standaardtabel;
	mso-tstyle-rowband-size:0;
	mso-tstyle-colband-size:0;
	mso-style-noshow:yes;
	mso-style-priority:99;
	mso-style-parent:"";
	mso-padding-alt:0cm 5.4pt 0cm 5.4pt;
	mso-para-margin-top:0cm;
	mso-para-margin-right:0cm;
	mso-para-margin-bottom:8.0pt;
	mso-para-margin-left:0cm;
	line-height:107%;
	mso-pagination:widow-orphan;
	font-size:11.0pt;
	font-family:"Calibri",sans-serif;
	mso-ascii-font-family:Calibri;
	mso-ascii-theme-font:minor-latin;
	mso-hansi-font-family:Calibri;
	mso-hansi-theme-font:minor-latin;
	mso-bidi-font-family:"Times New Roman";
	mso-bidi-theme-font:minor-bidi;
	mso-fareast-language:EN-US;}
</style>
<![endif]--><iframe frameborder="0" height="370" iframe="" src=" https://www.youtube.com/embed/bNBdk5xD6cc?rel=0&amp;modistbranding=1&amp;autohide=1&amp;showinfo=0&amp;controls=0" width="390">
</iframe></div>
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
<h3>Similar items</h3><div class="carousel"><div class="article article--carousel" itemscope="" itemtype="http://schema.org/Product"><div class="article__header"><meta content="https://www.24high.com/images/articles/image.php?id=5301&amp;w=300&amp;h=300" itemprop="image"/><div class="article__image data-link cursor-pointer" data-link="https://www.24high.com/en/article/0201113-magic-truffle-grinder"><img alt="Magic Truffle Grinder" class="lazyload" data-src="https://www.24high.com/images/articles/image.php?id=5301&amp;w=300&amp;h=300" src="../../images/articles/blank.gif"/></div> </div>
<div class="article__footer">
<div class="article__description data-link" data-link="https://www.24high.com/en/article/0201113-magic-truffle-grinder"><a href="0201113-magic-truffle-grinder.html"><span itemprop="name">Magic Truffle Grinder</span></a></div>
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
<div class="article__price data-link primary" data-link="https://www.24high.com/en/article/0201113-magic-truffle-grinder" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"><a href="0201113-magic-truffle-grinder.html">€ 4,95</a><meta content="EUR" itemprop="priceCurrency"/><meta content="4.95" itemprop="price"/><link href="http://schema.org/InStock" itemprop="availability"/></div>
<div class="article__actions"><a aria-label="Product Magic Truffle Grinder" class="article__button btn btn--secondary btn--block dialog-dismiss" href="0201113-magic-truffle-grinder.html"><svg aria-hidden="true" class="svg-inline--fa fa-info-circle fa-fw" data-fa-i2svg="" data-icon="info-circle" data-prefix="fas" focusable="false" role="img" viewbox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="currentColor"></path></svg></a><a aria-label="Order Magic Truffle Grinder" class="article__button btn btn--primary btn--block addArticleToCart dialog-dismiss" data-articlenumber="0201113" href="8107385-slx-grinder-aluminium-non-sticky-62-mm-charcoal.html#"><svg aria-hidden="true" class="svg-inline--fa fa-cart-plus fa-fw" data-fa-i2svg="" data-icon="cart-plus" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" fill="currentColor"></path></svg></a></div>
</div>
</div><div class="article article--carousel" itemscope="" itemtype="http://schema.org/Product"><div class="article__header"><meta content="https://www.24high.com/images/articles/image.php?id=3833&amp;w=300&amp;h=300" itemprop="image"/><div class="article__image data-link cursor-pointer" data-link="https://www.24high.com/en/article/0205295-aluminium-rainbow-grinder-55mm-4parts"><img alt="Aluminium Rainbow Grinder 55mm 4parts" class="lazyload" data-src="https://www.24high.com/images/articles/image.php?id=3833&amp;w=300&amp;h=300" src="../../images/articles/blank.gif"/></div> </div>
<div class="article__footer">
<div class="article__description data-link" data-link="https://www.24high.com/en/article/0205295-aluminium-rainbow-grinder-55mm-4parts"><a href="0205295-aluminium-rainbow-grinder-55mm-4parts.html"><span itemprop="name">Aluminium Rainbow Grinder 55mm 4parts</span></a></div>
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
<div class="article__price data-link primary" data-link="https://www.24high.com/en/article/0205295-aluminium-rainbow-grinder-55mm-4parts" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"><a href="0205295-aluminium-rainbow-grinder-55mm-4parts.html">€ 10,95</a><meta content="EUR" itemprop="priceCurrency"/><meta content="10.95" itemprop="price"/><link href="http://schema.org/InStock" itemprop="availability"/></div>
<div class="article__actions"><a aria-label="Product Aluminium Rainbow Grinder 55mm 4parts" class="article__button btn btn--secondary btn--block dialog-dismiss" href="0205295-aluminium-rainbow-grinder-55mm-4parts.html"><svg aria-hidden="true" class="svg-inline--fa fa-info-circle fa-fw" data-fa-i2svg="" data-icon="info-circle" data-prefix="fas" focusable="false" role="img" viewbox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="currentColor"></path></svg></a><a aria-label="Order Aluminium Rainbow Grinder 55mm 4parts" class="article__button btn btn--primary btn--block addArticleToCart dialog-dismiss" data-articlenumber="0205295" href="8107385-slx-grinder-aluminium-non-sticky-62-mm-charcoal.html#"><svg aria-hidden="true" class="svg-inline--fa fa-cart-plus fa-fw" data-fa-i2svg="" data-icon="cart-plus" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" fill="currentColor"></path></svg></a></div>
</div>
</div><div class="article article--carousel" itemscope="" itemtype="http://schema.org/Product"><div class="article__header"><meta content="https://www.24high.com/images/articles/image.php?id=3843&amp;w=300&amp;h=300" itemprop="image"/><div class="article__image data-link cursor-pointer" data-link="https://www.24high.com/en/article/3205627-aluminium-grenade-grinder-camouflage-3-parts"><img alt="Aluminium Grenade Grinder Camouflage 3 parts" class="lazyload" data-src="https://www.24high.com/images/articles/image.php?id=3843&amp;w=300&amp;h=300" src="../../images/articles/blank.gif"/></div> </div>
<div class="article__footer">
<div class="article__description data-link" data-link="https://www.24high.com/en/article/3205627-aluminium-grenade-grinder-camouflage-3-parts"><a href="3205627-aluminium-grenade-grinder-camouflage-3-parts.html"><span itemprop="name">Aluminium Grenade Grinder Camouflage 3 parts</span></a></div>
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
<div class="article__price data-link primary" data-link="https://www.24high.com/en/article/3205627-aluminium-grenade-grinder-camouflage-3-parts" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"><a href="3205627-aluminium-grenade-grinder-camouflage-3-parts.html">€ 9,95</a><meta content="EUR" itemprop="priceCurrency"/><meta content="9.95" itemprop="price"/><link href="http://schema.org/InStock" itemprop="availability"/></div>
<div class="article__actions"><a aria-label="Product Aluminium Grenade Grinder Camouflage 3 parts" class="article__button btn btn--secondary btn--block dialog-dismiss" href="3205627-aluminium-grenade-grinder-camouflage-3-parts.html"><svg aria-hidden="true" class="svg-inline--fa fa-info-circle fa-fw" data-fa-i2svg="" data-icon="info-circle" data-prefix="fas" focusable="false" role="img" viewbox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="currentColor"></path></svg></a><a aria-label="Order Aluminium Grenade Grinder Camouflage 3 parts" class="article__button btn btn--primary btn--block addArticleToCart dialog-dismiss" data-articlenumber="3205627" href="8107385-slx-grinder-aluminium-non-sticky-62-mm-charcoal.html#"><svg aria-hidden="true" class="svg-inline--fa fa-cart-plus fa-fw" data-fa-i2svg="" data-icon="cart-plus" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" fill="currentColor"></path></svg></a></div>
</div>
</div><div class="article article--carousel" itemscope="" itemtype="http://schema.org/Product"><div class="article__header"><meta content="https://www.24high.com/images/articles/image.php?id=2557&amp;w=300&amp;h=300" itemprop="image"/><div class="article__image data-link cursor-pointer" data-link="https://www.24high.com/en/article/9109575-wood-grinder-leaf"><img alt="Wood grinder leaf" class="lazyload" data-src="https://www.24high.com/images/articles/image.php?id=2557&amp;w=300&amp;h=300" src="../../images/articles/blank.gif"/></div> </div>
<div class="article__footer">
<div class="article__description data-link" data-link="https://www.24high.com/en/article/9109575-wood-grinder-leaf"><a href="9109575-wood-grinder-leaf.html"><span itemprop="name">Wood grinder leaf</span></a></div>
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
<div class="article__price data-link primary" data-link="https://www.24high.com/en/article/9109575-wood-grinder-leaf" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"><a href="9109575-wood-grinder-leaf.html">€ 6,95</a><meta content="EUR" itemprop="priceCurrency"/><meta content="6.95" itemprop="price"/><link href="http://schema.org/InStock" itemprop="availability"/></div>
<div class="article__actions"><a aria-label="Product Wood grinder leaf" class="article__button btn btn--secondary btn--block dialog-dismiss" href="9109575-wood-grinder-leaf.html"><svg aria-hidden="true" class="svg-inline--fa fa-info-circle fa-fw" data-fa-i2svg="" data-icon="info-circle" data-prefix="fas" focusable="false" role="img" viewbox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="currentColor"></path></svg></a><a aria-label="Order Wood grinder leaf" class="article__button btn btn--primary btn--block addArticleToCart dialog-dismiss" data-articlenumber="9109575" href="8107385-slx-grinder-aluminium-non-sticky-62-mm-charcoal.html#"><svg aria-hidden="true" class="svg-inline--fa fa-cart-plus fa-fw" data-fa-i2svg="" data-icon="cart-plus" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" fill="currentColor"></path></svg></a></div>
</div>
</div><div class="article article--carousel" itemscope="" itemtype="http://schema.org/Product"><div class="article__header"><meta content="https://www.24high.com/images/articles/image.php?id=2573&amp;w=300&amp;h=300" itemprop="image"/><div class="article__image data-link cursor-pointer" data-link="https://www.24high.com/en/article/0205392-card-grinder-alice-in-grinderland-caterpillar"><img alt="Card Grinder Alice in Grinderland - Caterpillar" class="lazyload" data-src="https://www.24high.com/images/articles/image.php?id=2573&amp;w=300&amp;h=300" src="../../images/articles/blank.gif"/></div> </div>
<div class="article__footer">
<div class="article__description data-link" data-link="https://www.24high.com/en/article/0205392-card-grinder-alice-in-grinderland-caterpillar"><a href="0205392-card-grinder-alice-in-grinderland-caterpillar.html"><span itemprop="name">Card Grinder Alice in Grinderland - Caterpillar</span></a></div>
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
<div class="article__price data-link primary" data-link="https://www.24high.com/en/article/0205392-card-grinder-alice-in-grinderland-caterpillar" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"><a href="0205392-card-grinder-alice-in-grinderland-caterpillar.html">€ 4,95</a><meta content="EUR" itemprop="priceCurrency"/><meta content="4.95" itemprop="price"/><link href="http://schema.org/InStock" itemprop="availability"/></div>
<div class="article__actions"><a aria-label="Product Card Grinder Alice in Grinderland - Caterpillar" class="article__button btn btn--secondary btn--block dialog-dismiss" href="0205392-card-grinder-alice-in-grinderland-caterpillar.html"><svg aria-hidden="true" class="svg-inline--fa fa-info-circle fa-fw" data-fa-i2svg="" data-icon="info-circle" data-prefix="fas" focusable="false" role="img" viewbox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="currentColor"></path></svg></a><a aria-label="Order Card Grinder Alice in Grinderland - Caterpillar" class="article__button btn btn--primary btn--block addArticleToCart dialog-dismiss" data-articlenumber="0205392" href="8107385-slx-grinder-aluminium-non-sticky-62-mm-charcoal.html#"><svg aria-hidden="true" class="svg-inline--fa fa-cart-plus fa-fw" data-fa-i2svg="" data-icon="cart-plus" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" fill="currentColor"></path></svg></a></div>
</div>
</div><div class="article article--carousel" itemscope="" itemtype="http://schema.org/Product"><div class="article__header"><meta content="https://www.24high.com/images/articles/image.php?id=2693&amp;w=300&amp;h=300" itemprop="image"/><div class="article__image data-link cursor-pointer" data-link="https://www.24high.com/en/article/0207724-the-bulldog-grinder-plastic-pink"><img alt="The Bulldog – Grinder Plastic Pink" class="lazyload" data-src="https://www.24high.com/images/articles/image.php?id=2693&amp;w=300&amp;h=300" src="../../images/articles/blank.gif"/></div> </div>
<div class="article__footer">
<div class="article__description data-link" data-link="https://www.24high.com/en/article/0207724-the-bulldog-grinder-plastic-pink"><a href="0207724-the-bulldog-grinder-plastic-pink.html"><span itemprop="name">The Bulldog – Grinder Plastic Pink</span></a></div>
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
<div class="article__price data-link primary" data-link="https://www.24high.com/en/article/0207724-the-bulldog-grinder-plastic-pink" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"><a href="0207724-the-bulldog-grinder-plastic-pink.html">€ 3,95</a><meta content="EUR" itemprop="priceCurrency"/><meta content="3.95" itemprop="price"/><link href="http://schema.org/InStock" itemprop="availability"/></div>
<div class="article__actions"><a aria-label="Product The Bulldog – Grinder Plastic Pink" class="article__button btn btn--secondary btn--block dialog-dismiss" href="0207724-the-bulldog-grinder-plastic-pink.html"><svg aria-hidden="true" class="svg-inline--fa fa-info-circle fa-fw" data-fa-i2svg="" data-icon="info-circle" data-prefix="fas" focusable="false" role="img" viewbox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="currentColor"></path></svg></a><a aria-label="Order The Bulldog – Grinder Plastic Pink" class="article__button btn btn--primary btn--block addArticleToCart dialog-dismiss" data-articlenumber="0207724" href="8107385-slx-grinder-aluminium-non-sticky-62-mm-charcoal.html#"><svg aria-hidden="true" class="svg-inline--fa fa-cart-plus fa-fw" data-fa-i2svg="" data-icon="cart-plus" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" fill="currentColor"></path></svg></a></div>
</div>
</div></div> </div>
</div>
<div class="clear"></div>
</div>
</div>