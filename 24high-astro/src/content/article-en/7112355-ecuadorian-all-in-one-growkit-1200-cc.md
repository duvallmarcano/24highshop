---
title: "Ecuadorian All in one Growkit - 24High"
description: "Ecuadorian All in one Growkit - 1200 cc Buy online at 24High: ✔️ Simple ✔️ Fast and anonymous | Buy Online"
---
<div class="contentwrapper">
<div class="wrapper">
<script>
    dataLayer.push({
        ecommerce: null
    }); // Clear the previous ecommerce object.
    dataLayer.push({
        event: "view_item",
        ecommerce: {"items":[{"quantity":1,"price":34.95,"item_name":"Ecuadorian All in one Growkit - 1200 cc","item_id":"7112355"}],"currency":"EUR","value":34.95}    });


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
        "name": "Ecuadorian All in one Growkit",
        "image": "https://www.24high.com/images/articles/image.php?id=4100&w=300&h=300",
        "description": "The Ecuadorian All-in-One Grow Kit is one of the more potent mushroom grow kits in the 24High range. This well-known Psilocybe cubensis strain is renowned for its vivid psychedelic experience, impressive visuals and reliable growth. Many experienced users choose the Ecuadorian for its combination of potent effects, large fruiting bodies and the potential for multiple flushes.\nThe Ecuadorian Grow Kit is a fully colonised Psilocybe cubensis grow kit that allows you to easily grow your own magic mushrooms at home. Under the right conditions, multiple harvests are possible.\nAt 24High, we work with magic mushroom grow kits and truffle products on a daily basis. That&rsquo;s why we believe it&rsquo;s important to provide honest and comprehensive information about the effects, cultivation and responsible use of magic mushrooms. This way, you can get started with full knowledge of the facts.\nBe sure to check out our guide &lsquo;Safe Use, Knowledge and Context&rsquo; for comprehensive background information and practical advice.\nWhat is the Ecuadorian Grow Kit?\nThe Ecuadorian Grow Kit contains a fully colonised substrate on which the mycelium is already fully developed. This means you no longer need to add spores or maintain sterile conditions yourself. You simply need to follow the instructions provided and create the correct growing conditions.\nEcuadorian is one of the potent Psilocybe cubensis strains and is a popular choice amongst experienced psychonauts seeking a clear, profound and visually rich psychedelic experience. The strain is also known for its robust genetics and reliable yield.\nWhy do many growers choose the Ecuadorian Grow Kit?\nEcuadorian is popular due to its combination of potent effects, substantial fruiting bodies and the potential for multiple flushes. Furthermore, this strain copes well with minor temperature fluctuations, meaning it continues to grow reliably under a variety of conditions.\nThe grow kit is fully colonised. This means you don&rsquo;t need to inject spores yourself or carry out any sterile procedures. This reduces the risk of errors and allows you to start growing straight away.\nIs the Ecuadorian Grow Kit suitable for beginners?\nThe grow kit itself is easy to set up and is therefore suitable for novice growers. However, the resulting mushroom strain is considered to be of medium to high potency and is therefore primarily recommended for users who already have experience with psychedelics.\nThe intensity of a psilocybin trip is determined not only by the strain, but also by the dosage, your mental state (set), the environment (setting) and personal sensitivity.\nWhat effects can you expect?\nAfter consumption, Ecuadorian magic mushrooms can provide a powerful psychedelic experience. The effects you experience vary depending on the individual, the situation and the dosage.\n\nModerate to strong visual effects\nMore intense colours and moving patterns\nDeep introspection\nA sense of connectedness\nMoments of euphoria\nFits of laughter, especially at the start of the trip\nAltered perception of time\nHeightened sensory perception\nAt higher doses, an out-of-body experience may occur\n\nNot everyone experiences all of the above effects. Factors such as mood, sleep, diet, experience and environment have a significant influence on the final experience.\nEcuadorian is a potent Psilocybe cubensis strain known for vivid visuals, deep introspection and an intense psychedelic experience. The experience varies depending on dosage and the individual.\nHow do you use Ecuadorian magic mushrooms?\nAfter harvesting, magic mushrooms can be eaten fresh or made into magic mushroom tea. Some users incorporate them into food, although this is less common as high temperatures can affect the active compounds.\nThe first effects are usually noticeable between 30 and 60 minutes after ingestion. On a full stomach, this may take longer. When making tea, the effects can sometimes set in slightly faster.\nThe total experience lasts on average between 3 and 8 hours.\nGeneral dosage guidelines\n\nMild experience: approximately 1 to 2 grams of dried magic mushrooms.\nEquivalent fresh quantity: approximately 10 to 20 grams.\nExperienced users sometimes opt for higher doses, depending on their experience.\nAlways use an accurate set of scales.\n\nNever increase the dose straight away if you&rsquo;re still not feeling much after half an hour. Give the magic mushrooms plenty of time to take effect. Read more about this here: building up your dose gradually.\nHow do you prepare properly for a magic mushroom trip?\nGood preparation can contribute to a pleasant and safe experience. Ecuadorian is often chosen by experienced users because of its powerful effects. That is precisely why a good mindset, a familiar environment and an appropriate dose are particularly important.\n\nIt is best to take them on an empty or slightly full stomach.\nEnsure you&rsquo;re in a quiet and familiar environment.\nDo not schedule any important appointments on the same day.\nDrink plenty of water.\nDo not consume alcohol or other drugs.\nIdeally, have a sober trip sitter present when taking a higher dose.\nIt can be useful to have a trip stopper to hand.\n\nWant to prepare even better? Read our guide &lsquo;Setting, Intention and Preparation&rsquo; for more information on set &amp; setting, trip sitters and the responsible use of magic mushrooms.\nWhy are Ecuadorian magic mushrooms only available as grow kits?\nThe sale of fresh magic mushrooms via smartshops is not permitted in the Netherlands. However, fully colonised magic mushroom grow kits may be sold under current Dutch legislation. That is why grow kits are now the legal way to grow your own magic mushrooms at home.\nWith a fully colonised grow kit, you no longer need to inject spores or maintain sterile conditions yourself. This makes growing considerably easier than with traditional cultivation methods.\nWhy choose a fully colonised grow kit?\nWith a fully colonised grow kit, the mycelium is already fully developed. This means you can start growing magic mushrooms almost immediately without any complicated preparations.\nAs the colonisation process is already complete, there is less chance of errors during the start-up phase. This makes this grow kit suitable for both novice and experienced growers.\nHow does the Ecuadorian Grow Kit work?\nUpon receipt, place the grow kit in the supplied grow bag according to the instructions provided. Next, ensure the correct temperature, humidity and ventilation so that the mycelium can form fruiting bodies.\nTake your time to read through the manual before you begin. Good preparation increases the chances of multiple successful flushes.\nDOWNLOAD HERE: INSTRUCTIONS FOR SETTING UP YOUR GROW KIT\nKey points include:\n\nA temperature of between approximately 20 and 25&deg;C.\nIndirect daylight.\nHigh humidity.\nFresh air daily, as per the instructions.\n\nUnder the right conditions, mushrooms may reappear after each flush.\nHow long does it take before you can harvest Ecuadorian?\nUnder the right conditions, the first mushrooms usually appear within a few weeks of setting up the grow kit. The exact growth rate depends on temperature, humidity, ventilation and care.\nOnce the first flush has been harvested, several more flushes can usually follow under the right conditions.\nHow do you get the most out of your Ecuadorian Grow Kit?\nFor the best yield, it is important to maintain the recommended temperature and humidity levels. Ventilate the grow bag according to the instructions, avoid direct sunlight and harvest the mushrooms at the right time.\nA hygienic approach and a stable environment increase the likelihood of multiple healthy flushes and an optimal yield.\nHow do you harvest Ecuadorian magic mushrooms?\nGently grasp the stem, twist it gently left and right, and then carefully pull the mushroom upwards. Removing the mushroom as completely as possible keeps the surface clean, allowing the next flush to develop better.\nContents of the Ecuadorian Grow Kit\n\nFully colonised Psilocybe cubensis Ecuadorian Grow Kit\nAvailable in 1200 cc and 2100 cc\nGrow bag\nComprehensive growing instructions\n\nAvailable sizes and yield\n\n\nSize\n\n1200 cc\n2100 cc\n\n\n\nAverage yield*\n\nOn average 300 to 400 grams of fresh magic mushrooms\nOn average 700 to 1000 grams of fresh magic mushrooms\n\n\n\n*The final yield depends on growing conditions, care and the number of flushes.\nHow should you store the Ecuadorian Grow Kit?\nA magic mushroom grow kit is a living product. We therefore recommend setting up the Ecuadorian Grow Kit immediately upon receipt. The sooner you start growing, the greater the chance of an optimal yield.\nIf you cannot use the grow kit straight away, store it according to the instructions provided and do not delay setting it up for longer than necessary. During prolonged storage, the quality of the mycelium gradually deteriorates.\nOrigin of the Ecuadorian\nAs the name suggests, the Ecuadorian Psilocybe cubensis originates from Ecuador. The strain was originally found in the Andes Mountains, where it grows under variable weather conditions and significant temperature fluctuations. These natural conditions have contributed to the robust characteristics of this mushroom strain.\nThe Ecuadorian is known for its sturdy white stems, large fruiting bodies and reliable genetics. Thanks to its vigorous growth and consistent yields, this strain has been popular amongst experienced growers for many years.\nWho is the Ecuadorian Grow Kit suitable for?\nThe grow kit is easy to set up thanks to the fully colonised substrate. However, the resulting mushroom strain is primarily recommended for users who already have experience with psychedelics and are seeking a more intense Psilocybe cubensis experience.\nMany experienced psychonauts choose Ecuadorian for its combination of powerful visuals, clear introspection and multiple large flushes.\nWhat alternatives are there?\nNot sure if Ecuadorian is right for you? There are several other psilocybin grow kits available in the 24High range.\n\nColombian &ndash;  a medium-strengthPsilocybe cubensis strain known for its lovely balance between social interaction, creativity and introspection. Suitable for users looking for a slightly more intense experience.\nMexican &ndash;  one of the most popular grow kits for beginners thanks to its accessible nature, ease of cultivation and balanced psychedelic experience.\n\nWhich grow kit suits you best depends on your experience, preferences and the qualities you&rsquo;re looking for.\nSafety and responsible use\nOnly use magic mushrooms if you are an adult and well-informed. Never use them in combination with alcohol, recreational drugs or certain medicines, such as MAO inhibitors or some antidepressants. Do not drive or operate machinery whilst the effects are still present.\nPsychedelics are not recommended for people with a personal or family history of psychosis, schizophrenia or other serious psychiatric conditions. Are you pregnant, breastfeeding or taking medication? If so, consult a doctor before using psychedelic products.\nWhy choose 24High?\nAt 24High, we work with magic mushroom grow kits, magic truffles and microdosing products every day. That&rsquo;s why we know how important clear explanations, reliable quality and good support are. Do you have any questions about growing or using your Ecuadorian Grow Kit? Our team will be happy to help.\nAre you curious about other varieties? Then take a look at our full range of magic mushroom grow kits.\nWant to know more about growing magic mushrooms?\nWant to increase your chances of a successful harvest? Then read our blog &lsquo;Recognising, rectifying and preventing common mistakes with magic mushroom grow kits&rsquo;. Here you&rsquo;ll find out which mistakes novice growers make most often and how you can easily avoid them to ensure a healthy grow kit and multiple successful flushes.\nFrequently Asked Questions\n\n How many harvests can I get from an Ecuadorian Grow Kit? \u25bc \n\nUnder the right conditions, the Ecuadorian Grow Kit yields an average of 2 to 4 flushes. The total yield depends on the size chosen, how well you look after it and the growing conditions.\n\n\n How long does it take for the first Ecuadorian magic mushrooms to grow? \u25bc \n\nUsually, the first magic mushrooms appear within a few weeks of setting up the grow kit according to the instructions. The exact growth rate depends on the temperature, humidity and care.\n\n\n Is the Ecuadorian Grow Kit suitable for novice growers? \u25bc \n\nYes, the grow kit is easy to set up thanks to the fully colonised substrate. However, the resulting Ecuadorian magic mushrooms are medium-strength to potent and are therefore primarily recommended for users with experience of psychedelics.\n\n\n How do I store my Ecuadorian Grow Kit? \u25bc \n\nWe recommend setting up the grow kit immediately upon receipt. The longer you wait, the greater the chance that the quality of the mycelium will deteriorate.\n\n\n How do I know when to harvest my Ecuadorian magic mushrooms? \u25bc \n\nIdeally, harvest the mushrooms just before or when the membrane under the cap starts to peel away. Gently twist the stem loose and carefully pull the mushroom upwards to increase the chance of subsequent flushes.\n\n\n\n\n\ndocument.querySelectorAll(\".accordion\").forEach(function(btn){\nbtn.addEventListener(\"click\", function(){\nthis.classList.toggle(\"active\");\nvar panel=this.nextElementSibling;\nvar arrow=this.querySelector(\"span\");\n\nif(panel.style.display===\"block\"){\npanel.style.display=\"none\";\narrow.style.transform=\"rotate(0deg)\";\nthis.style.background=\"#f9f9f9\";\n}else{\npanel.style.display=\"block\";\narrow.style.transform=\"rotate(180deg)\";\nthis.style.background=\"#f1f8e9\";\n}\n});\n});\n\n",
         "brand": {
                "@type": "Brand",
                "name": "growkit, ecuadorian"
            },
         "sku": "7112355",
        "gtin13": "",
        "mpn": "11202",
        "offers": {
            "@type": "Offer",
            "priceCurrency": "EUR",
            "price": "34.95",
            "itemCondition": "http://schema.org/NewCondition",
            "availability": "http://schema.org/InStock",
            "url": "https://www.24high.com/en/article/7112355-ecuadorian-all-in-one-growkit-1200-cc?setlang=en&article=7112355-ecuadorian-all-in-one-growkit-1200-cc",
            "seller": {
                "@type": "Organization",
                "name": "24High"
            }
        }
        ,
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "3",
                "reviewCount": "1"
            },
            "review": [
                            ]

            }
</script>
<div class="content">
<h1 class="h1 h1--line" style="color: rgb(101,101,101);">Ecuadorian All in one Growkit</h1>
<a class="a a--hover-primary" href="../mushrooms/202-all-in-one-growkits.html" style="display: inline-block; margin-bottom:20px;">Growkits Mushroom -&gt; MUSHROOMS -&gt; All In One Growkits</a>
<div class="columns columns--mobile800">
<div class="columns__column">
<div class="imagebox">
<div class="imagebox__maincontainer">
<img alt="Ecuadorian All in one Growkit" class="imagebox__mainimage" id="main-product-image" src="../../images/articles/image.php@id=4100&amp;w=1000&amp;h=1000">
<div id="interactive-viewer-container" style="display: none; width: 100%; height: 100%;"></div>
</img></div>
<div class="imagebox__thumbscontainer">
<div class="imagebox__thumbnail" data-url="https://www.24high.com/images/articles/image.php?id=4100&amp;w=1000&amp;h=1000"> <img alt="" src="../../images/articles/image.php@id=4100&amp;w=200&amp;h=200"/></div><div class="imagebox__thumbnail" data-url="https://www.24high.com/images/articles/image.php?id=4099&amp;w=1000&amp;h=1000"> <img alt="" src="../../images/articles/image.php@id=4099&amp;w=200&amp;h=200"/></div><div class="imagebox__thumbnail" data-url="https://www.24high.com/images/articles/image.php?id=2327&amp;w=1000&amp;h=1000"> <img alt="" src="../../images/articles/image.php@id=2327&amp;w=200&amp;h=200"/></div> </div>
</div>
</div>
<div class="columns__column columns__column--grow" style="padding-left: 10px;">
<div class="fx fx--ai-center">
<a class="a a--hover-primary fx__i" href="7112355-ecuadorian-all-in-one-growkit-1200-cc.html#" onclick="$('#reviewtabbtn').click().get(0).scrollIntoView();
                        return false;"><div class="rating" data-rating="3">
<span class="rating__empty">
<span class="rating__btn" data-rating="1"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="2"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="3"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="4"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="5"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span>
</span>
<div class="rating__filled" style="width: 60%;">
<div class="rating__filcont">
<svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg>
</div>
</div>
</div> (1)</a>
<div class="fx__i">Article number: 7112355</div>
</div>
<br/>
<div id="articlePrice">
<span class="text-bold font-2x">€ 34,95</span> (Incl.VAT)            </div>
<br/><br/>
<br>
<div id="articleStockStatus"><i class="fa fa-check success"></i> In stock</div>
<br/>
<div class="fx__i"><select class="input input--w100" id="selectVariant" name="variation"><option value="7112355">Ecuadorian All in one Growkit - 1200 cc</option><option value="8108853">Ecuadorian All in one Growkit - 2100 cc</option></select></div>
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
<div class="tabs__button" data-tabscontent="#tabs_102"><i class="far fa-info-circle fa-fw"></i> Warning</div><div class="tabs__button" data-tabscontent="#tabs_870"><i class="far fa-info-circle fa-fw"></i> Delivery</div> <div class="tabs__button tabs__button--secondary" data-tabscontent="#tabs_reviews" id="reviewtabbtn"><i class="fas fa-star fa-fw"></i> Reviews</div>
</div>
<div class="tabs__content" id="tabs_description" style="padding: 10px;">
<p>The <strong>Ecuadorian All-in-One Grow Kit</strong> is one of the more potent mushroom grow kits in the 24High range. This well-known <em>Psilocybe cubensis strain</em> is renowned for its vivid psychedelic experience, impressive visuals and reliable growth. Many experienced users choose the Ecuadorian for its combination of potent effects, large fruiting bodies and the potential for multiple flushes.</p>
<blockquote style="background: #f9f9f9; border-left: 5px solid #55b308; padding: 15px 20px; margin: 30px 0; font-style: italic; border-radius: 0 8px 8px 0;"><strong>The Ecuadorian Grow Kit is a fully colonised <em>Psilocybe cubensis</em> grow kit that allows you to easily grow your own magic mushrooms at home. Under the right conditions, multiple harvests are possible.</strong></blockquote>
<p>At 24High, we work with magic mushroom grow kits and truffle products on a daily basis. That’s why we believe it’s important to provide honest and comprehensive information about the effects, cultivation and responsible use of magic mushrooms. This way, you can get started with full knowledge of the facts.</p>
<p>Be sure to check out our guide <span style="text-decoration: underline; color: #1649f5;"><a href="../guide/safe-use-knowledge-and-context.html" style="color: #1649f5; text-decoration: underline;">‘Safe Use, Knowledge and Context’</a></span> for comprehensive background information and practical advice.</p>
<h2>What is the Ecuadorian Grow Kit?</h2>
<p>The Ecuadorian Grow Kit contains a fully colonised substrate on which the mycelium is already fully developed. This means you no longer need to add spores or maintain sterile conditions yourself. You simply need to follow the instructions provided and create the correct growing conditions.</p>
<p>Ecuadorian is one of the potent <em>Psilocybe cubensis strains</em> and is a popular choice amongst experienced psychonauts seeking a clear, profound and visually rich psychedelic experience. The strain is also known for its robust genetics and reliable yield.</p>
<h2>Why do many growers choose the Ecuadorian Grow Kit?</h2>
<p>Ecuadorian is popular due to its combination of potent effects, substantial fruiting bodies and the potential for multiple flushes. Furthermore, this strain copes well with minor temperature fluctuations, meaning it continues to grow reliably under a variety of conditions.</p>
<p>The grow kit is fully colonised. This means you don’t need to inject spores yourself or carry out any sterile procedures. This reduces the risk of errors and allows you to start growing straight away.</p>
<h2>Is the Ecuadorian Grow Kit suitable for beginners?</h2>
<p>The grow kit itself is easy to set up and is therefore suitable for novice growers. However, the resulting mushroom strain is considered to be of medium to high potency and is therefore primarily recommended for users who already have experience with psychedelics.</p>
<p>The intensity of a psilocybin trip is determined not only by the strain, but also by the dosage, your mental state (set), the environment (setting) and personal sensitivity.</p>
<h2>What effects can you expect?</h2>
<p>After consumption, Ecuadorian magic mushrooms can provide a powerful psychedelic experience. The effects you experience vary depending on the individual, the situation and the dosage.</p>
<ul>
<li>Moderate to strong visual effects</li>
<li>More intense colours and moving patterns</li>
<li>Deep introspection</li>
<li>A sense of connectedness</li>
<li>Moments of euphoria</li>
<li>Fits of laughter, especially at the start of the trip</li>
<li>Altered perception of time</li>
<li>Heightened sensory perception</li>
<li>At higher doses, an out-of-body experience may occur</li>
</ul>
<p>Not everyone experiences all of the above effects. Factors such as mood, sleep, diet, experience and environment have a significant influence on the final experience.</p>
<blockquote style="background: #f9f9f9; border-left: 5px solid #55b308; padding: 15px 20px; margin: 30px 0; font-style: italic; border-radius: 0 8px 8px 0;"><strong>Ecuadorian is a potent <em>Psilocybe cubensis strain</em> known for vivid visuals, deep introspection and an intense psychedelic experience. The experience varies depending on dosage and the individual.</strong></blockquote>
<h2>How do you use Ecuadorian magic mushrooms?</h2>
<p>After harvesting, magic mushrooms can be eaten fresh or made into magic mushroom tea. Some users incorporate them into food, although this is less common as high temperatures can affect the active compounds.</p>
<p>The first effects are usually noticeable between 30 and 60 minutes after ingestion. On a full stomach, this may take longer. When making tea, the effects can sometimes set in slightly faster.</p>
<p>The total experience lasts on average between 3 and 8 hours.</p>
<h3>General dosage guidelines</h3>
<ul>
<li>Mild experience: approximately 1 to 2 grams of dried magic mushrooms.</li>
<li>Equivalent fresh quantity: approximately 10 to 20 grams.</li>
<li>Experienced users sometimes opt for higher doses, depending on their experience.</li>
<li>Always use an accurate set of scales.</li>
</ul>
<p>Never increase the dose straight away if you’re still not feeling much after half an hour. Give the magic mushrooms plenty of time to take effect. Read more about this here: <span style="text-decoration: underline; color: #1649f5;"><a href="../guide/safe-use-knowledge-and-context/dosing-carefully-built-up.html" style="color: #1649f5; text-decoration: underline;">building up your dose gradually</a></span>.</p>
<h2>How do you prepare properly for a magic mushroom trip?</h2>
<p>Good preparation can contribute to a pleasant and safe experience. Ecuadorian is often chosen by experienced users because of its powerful effects. That is precisely why a good mindset, a familiar environment and an appropriate dose are particularly important.</p>
<ul>
<li>It is best to take them on an empty or slightly full stomach.</li>
<li>Ensure you’re in a quiet and familiar environment.</li>
<li>Do not schedule any important appointments on the same day.</li>
<li>Drink plenty of water.</li>
<li>Do not consume alcohol or other drugs.</li>
<li>Ideally, have a sober trip sitter present when taking a higher dose.</li>
<li>It can be useful to have a trip stopper to hand.</li>
</ul>
<p><span>Want to prepare even better? Read our guide </span><span style="text-decoration: underline; color: #1649f5;"><a href="../guide/natural-psychedelics-experience-types/setting-intention-preparation.html" style="color: #1649f5; text-decoration: underline;">‘Setting, Intention and Preparation’</a></span><span> for more information on set &amp; setting, trip sitters and the responsible use of magic mushrooms.</span></p>
<h2>Why are Ecuadorian magic mushrooms only available as grow kits?</h2>
<p>The sale of fresh magic mushrooms via smartshops is not permitted in the Netherlands. However, fully colonised magic mushroom grow kits may be sold under current Dutch legislation. That is why grow kits are now the legal way to grow your own magic mushrooms at home.</p>
<p>With a fully colonised grow kit, you no longer need to inject spores or maintain sterile conditions yourself. This makes growing considerably easier than with traditional cultivation methods.</p>
<h2>Why choose a fully colonised grow kit?</h2>
<p>With a fully colonised grow kit, the mycelium is already fully developed. This means you can start growing magic mushrooms almost immediately without any complicated preparations.</p>
<p>As the colonisation process is already complete, there is less chance of errors during the start-up phase. This makes this grow kit suitable for both novice and experienced growers.</p>
<h2>How does the Ecuadorian Grow Kit work?</h2>
<p>Upon receipt, place the grow kit in the supplied grow bag according to the instructions provided. Next, ensure the correct temperature, humidity and ventilation so that the mycelium can form fruiting bodies.</p>
<p><span>Take your time to read through the manual before you begin. Good preparation increases the chances of multiple successful flushes.</span></p>
<p><strong>DOWNLOAD HERE: <span style="text-decoration: underline;"><a href="https://www.24high.it/blog/134/quali-sono-le-specie-di-funghi-adatte-a-una-prima-introduzione" rel="noopener" style="color: #1649f5; text-decoration: underline;" target="_blank">INSTRUCTIONS FOR SETTING UP YOUR GROW KIT</a></span></strong></p>
<p>Key points include:</p>
<ul>
<li>A temperature of between approximately 20 and 25°C.</li>
<li>Indirect daylight.</li>
<li>High humidity.</li>
<li>Fresh air daily, as per the instructions.</li>
</ul>
<p>Under the right conditions, mushrooms may reappear after each flush.</p>
<h2>How long does it take before you can harvest Ecuadorian?</h2>
<p>Under the right conditions, the first mushrooms usually appear within a few weeks of setting up the grow kit. The exact growth rate depends on temperature, humidity, ventilation and care.</p>
<p>Once the first flush has been harvested, several more flushes can usually follow under the right conditions.</p>
<h2>How do you get the most out of your Ecuadorian Grow Kit?</h2>
<p>For the best yield, it is important to maintain the recommended temperature and humidity levels. Ventilate the grow bag according to the instructions, avoid direct sunlight and harvest the mushrooms at the right time.</p>
<p>A hygienic approach and a stable environment increase the likelihood of multiple healthy flushes and an optimal yield.</p>
<h2>How do you harvest Ecuadorian magic mushrooms?</h2>
<p>Gently grasp the stem, twist it gently left and right, and then carefully pull the mushroom upwards. Removing the mushroom as completely as possible keeps the surface clean, allowing the next flush to develop better.</p>
<h2>Contents of the Ecuadorian Grow Kit</h2>
<ul>
<li>Fully colonised <em>Psilocybe cubensis</em> Ecuadorian Grow Kit</li>
<li>Available in 1200 cc and 2100 cc</li>
<li>Grow bag</li>
<li>Comprehensive growing instructions</li>
</ul>
<h2>Available sizes and yield</h2>
<div style="display: flex; gap: 40px; flex-wrap: wrap; margin-bottom: 25px;">
<div style="flex: 1; min-width: 280px; background: #e9eef5; padding: 25px; border-radius: 12px;">
<h4 style="margin-top: 0;">Size</h4>
<ul style="padding-left: 18px; margin-bottom: 0;">
<li>1200 cc</li>
<li>2100 cc</li>
</ul>
</div>
<div style="flex: 1; min-width: 280px; background: #fff5f5; padding: 25px; border-radius: 12px;">
<h4 style="margin-top: 0;">Average yield*</h4>
<ul style="padding-left: 18px; margin-bottom: 0;">
<li>On average 300 to 400 grams of fresh magic mushrooms</li>
<li>On average 700 to 1000 grams of fresh magic mushrooms</li>
</ul>
</div>
</div>
<p><em>*The final yield depends on growing conditions, care and the number of flushes.</em></p>
<h2>How should you store the Ecuadorian Grow Kit?</h2>
<p>A magic mushroom grow kit is a living product. We therefore recommend setting up the Ecuadorian Grow Kit immediately upon receipt. The sooner you start growing, the greater the chance of an optimal yield.</p>
<p>If you cannot use the grow kit straight away, store it according to the instructions provided and do not delay setting it up for longer than necessary. During prolonged storage, the quality of the mycelium gradually deteriorates.</p>
<h2>Origin of the Ecuadorian</h2>
<p>As the name suggests, the Ecuadorian <em>Psilocybe cubensis</em> originates from Ecuador. The strain was originally found in the Andes Mountains, where it grows under variable weather conditions and significant temperature fluctuations. These natural conditions have contributed to the robust characteristics of this mushroom strain.</p>
<p>The Ecuadorian is known for its sturdy white stems, large fruiting bodies and reliable genetics. Thanks to its vigorous growth and consistent yields, this strain has been popular amongst experienced growers for many years.</p>
<h2>Who is the Ecuadorian Grow Kit suitable for?</h2>
<p>The grow kit is easy to set up thanks to the fully colonised substrate. However, the resulting mushroom strain is primarily recommended for users who already have experience with psychedelics and are seeking a more intense <em>Psilocybe cubensis experience</em>.</p>
<p>Many experienced psychonauts choose Ecuadorian for its combination of powerful visuals, clear introspection and multiple large flushes.</p>
<h2>What alternatives are there?</h2>
<p>Not sure if Ecuadorian is right for you? There are several other psilocybin grow kits available in the 24High range.</p>
<ul>
<li><span style="text-decoration: underline; color: #1649f5;"><a href="7112834-colombian-all-in-one-growkit-250-cc.html" style="color: #1649f5; text-decoration: underline;">Colombian</a></span><span> – </span> a medium-strength<em>Psilocybe cubensis strain</em> known for its lovely balance between social interaction, creativity and introspection. Suitable for users looking for a slightly more intense experience.</li>
<li><span style="text-decoration: underline; color: #1649f5;"><a href="7112977-mexican-all-in-one-growkit-250-cc.html" style="color: #1649f5; text-decoration: underline;">Mexican</a></span><span> – </span> one of the most popular grow kits for beginners thanks to its accessible nature, ease of cultivation and balanced psychedelic experience.</li>
</ul>
<p>Which grow kit suits you best depends on your experience, preferences and the qualities you’re looking for.</p>
<h2>Safety and responsible use</h2>
<p>Only use magic mushrooms if you are an adult and well-informed. Never use them in combination with alcohol, recreational drugs or certain medicines, such as MAO inhibitors or some antidepressants. Do not drive or operate machinery whilst the effects are still present.</p>
<p>Psychedelics are not recommended for people with a personal or family history of psychosis, schizophrenia or other serious psychiatric conditions. Are you pregnant, breastfeeding or taking medication? If so, consult a doctor before using psychedelic products.</p>
<h2>Why choose 24High?</h2>
<p>At 24High, we work with magic mushroom grow kits, magic truffles and microdosing products every day. That’s why we know how important clear explanations, reliable quality and good support are. Do you have any questions about growing or using your Ecuadorian Grow Kit? Our team will be happy to help.</p>
<p>Are you curious about other varieties? Then take a look at our full range of <span style="text-decoration: underline; color: #1649f5;"><a href="../mushrooms/24-growkits-mushroom.html" style="color: #1649f5; text-decoration: underline;">magic mushroom grow kits</a></span>.</p>
<h2>Want to know more about growing magic mushrooms?</h2>
<p>Want to increase your chances of a successful harvest? Then read our blog <span style="text-decoration: underline; color: #1649f5;"><a href="../blog/483/recognise-fix-and-avoid-common-mistakes-with-mushroom-grow-kits.html" style="color: #1649f5; text-decoration: underline;">‘Recognising, rectifying and preventing common mistakes with magic mushroom grow kits</a></span>’. Here you’ll find out which mistakes novice growers make most often and how you can easily avoid them to ensure a healthy grow kit and multiple successful flushes.</p>
<h2>Frequently Asked Questions</h2>
<div style="margin-bottom: 50px;">
<div itemprop="mainEntity" itemscope="" itemtype="https://schema.org/Question"><button class="accordion" style="background-color: #f9f9f9; color: #444; cursor: pointer; padding: 18px; width: 100%; border: 1px solid #eee; border-radius: 8px; text-align: left; outline: none; transition: 0.4s; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; gap: 15px;"> <strong itemprop="name" style="flex: 1; margin: 0; line-height: 1.4; font-size: 14px;">How many harvests can I get from an Ecuadorian Grow Kit?</strong> <span style="flex-shrink: 0; transition: transform 0.4s; font-size: 12px;">▼</span> </button>
<div class="panel" itemprop="acceptedAnswer" itemscope="" itemtype="https://schema.org/Answer" style="padding: 0 18px; display: none; background-color: white; overflow: hidden; border-left: 2px solid #55b308; margin-bottom: 15px;">
<p itemprop="text" style="padding: 10px 0;">Under the right conditions, the Ecuadorian Grow Kit yields an average of 2 to 4 flushes. The total yield depends on the size chosen, how well you look after it and the growing conditions.</p>
</div>
</div>
<div itemprop="mainEntity" itemscope="" itemtype="https://schema.org/Question"><button class="accordion" style="background-color: #f9f9f9; color: #444; cursor: pointer; padding: 18px; width: 100%; border: 1px solid #eee; border-radius: 8px; text-align: left; outline: none; transition: 0.4s; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; gap: 15px;"> <strong itemprop="name" style="flex: 1; margin: 0; line-height: 1.4; font-size: 14px;">How long does it take for the first Ecuadorian magic mushrooms to grow?</strong> <span style="flex-shrink: 0; transition: transform 0.4s; font-size: 12px;">▼</span> </button>
<div class="panel" itemprop="acceptedAnswer" itemscope="" itemtype="https://schema.org/Answer" style="padding: 0 18px; display: none; background-color: white; overflow: hidden; border-left: 2px solid #55b308; margin-bottom: 15px;">
<p itemprop="text" style="padding: 10px 0;">Usually, the first magic mushrooms appear within a few weeks of setting up the grow kit according to the instructions. The exact growth rate depends on the temperature, humidity and care.</p>
</div>
</div>
<div itemprop="mainEntity" itemscope="" itemtype="https://schema.org/Question"><button class="accordion" style="background-color: #f9f9f9; color: #444; cursor: pointer; padding: 18px; width: 100%; border: 1px solid #eee; border-radius: 8px; text-align: left; outline: none; transition: 0.4s; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; gap: 15px;"> <strong itemprop="name" style="flex: 1; margin: 0; line-height: 1.4; font-size: 14px;">Is the Ecuadorian Grow Kit suitable for novice growers?</strong> <span style="flex-shrink: 0; transition: transform 0.4s; font-size: 12px;">▼</span> </button>
<div class="panel" itemprop="acceptedAnswer" itemscope="" itemtype="https://schema.org/Answer" style="padding: 0 18px; display: none; background-color: white; overflow: hidden; border-left: 2px solid #55b308; margin-bottom: 15px;">
<p itemprop="text" style="padding: 10px 0;">Yes, the grow kit is easy to set up thanks to the fully colonised substrate. However, the resulting Ecuadorian magic mushrooms are medium-strength to potent and are therefore primarily recommended for users with experience of psychedelics.</p>
</div>
</div>
<div itemprop="mainEntity" itemscope="" itemtype="https://schema.org/Question"><button class="accordion" style="background-color: #f9f9f9; color: #444; cursor: pointer; padding: 18px; width: 100%; border: 1px solid #eee; border-radius: 8px; text-align: left; outline: none; transition: 0.4s; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; gap: 15px;"> <strong itemprop="name" style="flex: 1; margin: 0; line-height: 1.4; font-size: 14px;">How do I store my Ecuadorian Grow Kit?</strong> <span style="flex-shrink: 0; transition: transform 0.4s; font-size: 12px;">▼</span> </button>
<div class="panel" itemprop="acceptedAnswer" itemscope="" itemtype="https://schema.org/Answer" style="padding: 0 18px; display: none; background-color: white; overflow: hidden; border-left: 2px solid #55b308; margin-bottom: 15px;">
<p itemprop="text" style="padding: 10px 0;">We recommend setting up the grow kit immediately upon receipt. The longer you wait, the greater the chance that the quality of the mycelium will deteriorate.</p>
</div>
</div>
<div itemprop="mainEntity" itemscope="" itemtype="https://schema.org/Question"><button class="accordion" style="background-color: #f9f9f9; color: #444; cursor: pointer; padding: 18px; width: 100%; border: 1px solid #eee; border-radius: 8px; text-align: left; outline: none; transition: 0.4s; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; gap: 15px;"> <strong itemprop="name" style="flex: 1; margin: 0; line-height: 1.4; font-size: 14px;">How do I know when to harvest my Ecuadorian magic mushrooms?</strong> <span style="flex-shrink: 0; transition: transform 0.4s; font-size: 12px;">▼</span> </button>
<div class="panel" itemprop="acceptedAnswer" itemscope="" itemtype="https://schema.org/Answer" style="padding: 0 18px; display: none; background-color: white; overflow: hidden; border-left: 2px solid #55b308; margin-bottom: 15px;">
<p itemprop="text" style="padding: 10px 0;">Ideally, harvest the mushrooms just before or when the membrane under the cap starts to peel away. Gently twist the stem loose and carefully pull the mushroom upwards to increase the chance of subsequent flushes.</p>
</div>
</div>
</div>
<p>
<script>
document.querySelectorAll(".accordion").forEach(function(btn){
btn.addEventListener("click", function(){
this.classList.toggle("active");
var panel=this.nextElementSibling;
var arrow=this.querySelector("span");

if(panel.style.display==="block"){
panel.style.display="none";
arrow.style.transform="rotate(0deg)";
this.style.background="#f9f9f9";
}else{
panel.style.display="block";
arrow.style.transform="rotate(180deg)";
this.style.background="#f1f8e9";
}
});
});
</script>
</p> </div>
<div class="tabs__content" id="tabs_102" style="padding: 10px;">Magic mushrooms can be dangerous to health when you combine it with certain medications, alcohol or with MAO inhibitors. Are you using drugs? Always consult your doctor first and read the package insert of your medicine to prevent health risks. DO NOT use the magic mushrooms if you are pregnant or breast-feeding. Treat these unique Magic Mushrooms with respect and use them only when you are in a positve mood and a peaceful environment. Do NOT go driving vehicles or participate in traffic !</div><div class="tabs__content" id="tabs_870" style="padding: 10px;">24High only ship to countries within Europe. 24High cannot provide information about the status, legal or illegal, about the product in other countries. Not sure if the ordered product is legal in the country where it should be sent? Inform yourself about this issue with the authorities of the country itself. Buyer bears responsibility. All our products are shipped in discreet packaging.<br/><br/>If it happens(most unlikely) that your grow kit is longer on the road than delivery days indicated by the outsourced logistics service, please contact us. If a grow kit is on the road for more than 2 weeks, it may happen that the grow kit no longer works. Therefore, once you have received the grow kit, it is important to place it in the refrigerator for 24 hours before before setting it up. Take photos of setting up and of the grow kit and photos after 2.5 weeks of growth. Mail these photos to support@24high.nl. We will decide on the basis of the photos whether you are entitled to a discount or get the full purchase amount refunded in the form of a credit that can only be spent on www.24high.com/en. Of course we also offer an Express shipping service that guarantees that even in these warm summer months a sensitive product such as the grow kit arrives in perfect condition, there are extra costs involved, but the delivery time is many times shorter.<br/></div>
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
<h3>Similar items</h3><div class="carousel"><div class="article article--carousel" itemscope="" itemtype="http://schema.org/Product"><div class="article__header"><meta content="https://www.24high.com/images/articles/image.php?id=5101&amp;w=300&amp;h=300" itemprop="image"/><div class="article__image data-link cursor-pointer" data-link="https://www.24high.com/en/article/3209168-psilo-qtest-psilocybin-test-for-truffles-shrooms-miraculix"><img alt="Psilo-QTest - Psilocybin test for Truffles &amp; Shrooms (Miraculix)" class="lazyload" data-src="https://www.24high.com/images/articles/image.php?id=5101&amp;w=300&amp;h=300" src="../../images/articles/blank.gif"/></div> </div>
<div class="article__footer">
<div class="article__description data-link" data-link="https://www.24high.com/en/article/3209168-psilo-qtest-psilocybin-test-for-truffles-shrooms-miraculix"><a href="3209168-psilo-qtest-psilocybin-test-for-truffles-shrooms-miraculix.html"><span itemprop="name">Psilo-QTest - Psilocybin test for Truffles &amp; Shrooms (Miraculix)</span></a></div>
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
<div class="article__price data-link primary" data-link="https://www.24high.com/en/article/3209168-psilo-qtest-psilocybin-test-for-truffles-shrooms-miraculix" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"><a href="3209168-psilo-qtest-psilocybin-test-for-truffles-shrooms-miraculix.html">€ 18,95</a><meta content="EUR" itemprop="priceCurrency"/><meta content="18.95" itemprop="price"/><link href="http://schema.org/InStock" itemprop="availability"/></div>
<div class="article__actions"><a aria-label="Product Psilo-QTest - Psilocybin test for Truffles &amp; Shrooms (Miraculix)" class="article__button btn btn--secondary btn--block dialog-dismiss" href="3209168-psilo-qtest-psilocybin-test-for-truffles-shrooms-miraculix.html"><svg aria-hidden="true" class="svg-inline--fa fa-info-circle fa-fw" data-fa-i2svg="" data-icon="info-circle" data-prefix="fas" focusable="false" role="img" viewbox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="currentColor"></path></svg></a><a aria-label="Order Psilo-QTest - Psilocybin test for Truffles &amp; Shrooms (Miraculix)" class="article__button btn btn--primary btn--block addArticleToCart dialog-dismiss" data-articlenumber="3209168" href="7112355-ecuadorian-all-in-one-growkit-1200-cc.html#"><svg aria-hidden="true" class="svg-inline--fa fa-cart-plus fa-fw" data-fa-i2svg="" data-icon="cart-plus" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" fill="currentColor"></path></svg></a></div>
</div>
</div><div class="article article--carousel" itemscope="" itemtype="http://schema.org/Product"><div class="article__header"><meta content="https://www.24high.com/images/articles/image.php?id=2381&amp;w=300&amp;h=300" itemprop="image"/><div class="article__image data-link cursor-pointer" data-link="https://www.24high.com/en/article/0202221-magic-mushroom-startkit"><img alt="Magic Mushroom Startkit" class="lazyload" data-src="https://www.24high.com/images/articles/image.php?id=2381&amp;w=300&amp;h=300" src="../../images/articles/blank.gif"/></div> </div>
<div class="article__footer">
<div class="article__description data-link" data-link="https://www.24high.com/en/article/0202221-magic-mushroom-startkit"><a href="0202221-magic-mushroom-startkit.html"><span itemprop="name">Magic Mushroom Startkit</span></a></div>
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
<div class="article__price data-link primary" data-link="https://www.24high.com/en/article/0202221-magic-mushroom-startkit" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"><a href="0202221-magic-mushroom-startkit.html">€ 19,95</a><meta content="EUR" itemprop="priceCurrency"/><meta content="19.95" itemprop="price"/><link href="http://schema.org/InStock" itemprop="availability"/></div>
<div class="article__actions"><a aria-label="Product Magic Mushroom Startkit" class="article__button btn btn--secondary btn--block dialog-dismiss" href="0202221-magic-mushroom-startkit.html"><svg aria-hidden="true" class="svg-inline--fa fa-info-circle fa-fw" data-fa-i2svg="" data-icon="info-circle" data-prefix="fas" focusable="false" role="img" viewbox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="currentColor"></path></svg></a><a aria-label="Order Magic Mushroom Startkit" class="article__button btn btn--primary btn--block addArticleToCart dialog-dismiss" data-articlenumber="0202221" href="7112355-ecuadorian-all-in-one-growkit-1200-cc.html#"><svg aria-hidden="true" class="svg-inline--fa fa-cart-plus fa-fw" data-fa-i2svg="" data-icon="cart-plus" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" fill="currentColor"></path></svg></a></div>
</div>
</div><div class="article article--carousel" itemscope="" itemtype="http://schema.org/Product"><div class="article__header"><meta content="https://www.24high.com/images/articles/image.php?id=4106&amp;w=300&amp;h=300" itemprop="image"/><div class="article__image data-link cursor-pointer" data-link="https://www.24high.com/en/article/7112782-mckennaii-all-in-one-growkit-250-cc"><img alt="McKennaii All in one Growkit" class="lazyload" data-src="https://www.24high.com/images/articles/image.php?id=4106&amp;w=300&amp;h=300" src="../../images/articles/blank.gif"/></div> </div>
<div class="article__footer">
<div class="article__description data-link" data-link="https://www.24high.com/en/article/7112782-mckennaii-all-in-one-growkit-250-cc"><a href="7112782-mckennaii-all-in-one-growkit-250-cc.html"><span itemprop="name">McKennaii All in one Growkit</span></a></div>
<div class="text-center"><div class="rating" data-rating="4.11111" itemprop="aggregateRating" itemscope="" itemtype="http://schema.org/AggregateRating">
<meta content="5" itemprop="bestRating"><meta content="4.11111" itemprop="ratingValue"><meta content="9" itemprop="ratingCount">
<span class="rating__empty">
<span class="rating__btn" data-rating="1"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="2"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="3"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="4"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="5"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span>
</span>
<div class="rating__filled" style="width: 82.2222%;">
<div class="rating__filcont">
<svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg>
</div>
</div>
</meta></meta></meta></div></div>
<div class="article__price data-link primary" data-link="https://www.24high.com/en/article/7112782-mckennaii-all-in-one-growkit-250-cc" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"><a href="7112782-mckennaii-all-in-one-growkit-250-cc.html">€ 19,95</a><meta content="EUR" itemprop="priceCurrency"/><meta content="19.95" itemprop="price"/><link href="http://schema.org/InStock" itemprop="availability"/></div>
<div class="article__actions"><a aria-label="Product McKennaii All in one Growkit" class="article__button btn btn--secondary btn--block dialog-dismiss" href="7112782-mckennaii-all-in-one-growkit-250-cc.html"><svg aria-hidden="true" class="svg-inline--fa fa-info-circle fa-fw" data-fa-i2svg="" data-icon="info-circle" data-prefix="fas" focusable="false" role="img" viewbox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="currentColor"></path></svg></a><a aria-label="Order McKennaii All in one Growkit" class="article__button btn btn--primary btn--block addArticleToCart dialog-dismiss" data-articlenumber="7112782" href="7112355-ecuadorian-all-in-one-growkit-1200-cc.html#"><svg aria-hidden="true" class="svg-inline--fa fa-cart-plus fa-fw" data-fa-i2svg="" data-icon="cart-plus" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" fill="currentColor"></path></svg> <svg aria-hidden="true" class="svg-inline--fa fa-layer-group fa-fw" data-fa-i2svg="" data-icon="layer-group" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z" fill="currentColor"></path></svg></a></div>
</div>
</div><div class="article article--carousel" itemscope="" itemtype="http://schema.org/Product"><div class="article__header"><meta content="https://www.24high.com/images/articles/image.php?id=4094&amp;w=300&amp;h=300" itemprop="image"/><div class="article__image data-link cursor-pointer" data-link="https://www.24high.com/en/article/7112907-thai-all-in-one-growkit-1200-cc"><img alt="Thai All in one Growkit " class="lazyload" data-src="https://www.24high.com/images/articles/image.php?id=4094&amp;w=300&amp;h=300" src="../../images/articles/blank.gif"/></div> </div>
<div class="article__footer">
<div class="article__description data-link" data-link="https://www.24high.com/en/article/7112907-thai-all-in-one-growkit-1200-cc"><a href="7112907-thai-all-in-one-growkit-1200-cc.html"><span itemprop="name">Thai All in one Growkit </span></a></div>
<div class="text-center"><div class="rating" data-rating="4" itemprop="aggregateRating" itemscope="" itemtype="http://schema.org/AggregateRating">
<meta content="5" itemprop="bestRating"><meta content="4" itemprop="ratingValue"><meta content="2" itemprop="ratingCount">
<span class="rating__empty">
<span class="rating__btn" data-rating="1"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="2"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="3"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="4"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="5"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span>
</span>
<div class="rating__filled" style="width: 80%;">
<div class="rating__filcont">
<svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg>
</div>
</div>
</meta></meta></meta></div></div>
<div class="article__price data-link primary" data-link="https://www.24high.com/en/article/7112907-thai-all-in-one-growkit-1200-cc" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"><a href="7112907-thai-all-in-one-growkit-1200-cc.html">€ 34,95</a><meta content="EUR" itemprop="priceCurrency"/><meta content="34.95" itemprop="price"/><link href="http://schema.org/InStock" itemprop="availability"/></div>
<div class="article__actions"><a aria-label="Product Thai All in one Growkit " class="article__button btn btn--secondary btn--block dialog-dismiss" href="7112907-thai-all-in-one-growkit-1200-cc.html"><svg aria-hidden="true" class="svg-inline--fa fa-info-circle fa-fw" data-fa-i2svg="" data-icon="info-circle" data-prefix="fas" focusable="false" role="img" viewbox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="currentColor"></path></svg></a><a aria-label="Order Thai All in one Growkit " class="article__button btn btn--primary btn--block addArticleToCart dialog-dismiss" data-articlenumber="7112907" href="7112355-ecuadorian-all-in-one-growkit-1200-cc.html#"><svg aria-hidden="true" class="svg-inline--fa fa-cart-plus fa-fw" data-fa-i2svg="" data-icon="cart-plus" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" fill="currentColor"></path></svg> <svg aria-hidden="true" class="svg-inline--fa fa-layer-group fa-fw" data-fa-i2svg="" data-icon="layer-group" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z" fill="currentColor"></path></svg></a></div>
</div>
</div><div class="article article--carousel" itemscope="" itemtype="http://schema.org/Product"><div class="article__header"><meta content="https://www.24high.com/images/articles/image.php?id=4083&amp;w=300&amp;h=300" itemprop="image"/><div class="article__image data-link cursor-pointer" data-link="https://www.24high.com/en/article/7112182-mazatapec-all-in-one-growkit-1200-cc"><img alt="Mazatapec, All in one Growkit " class="lazyload" data-src="https://www.24high.com/images/articles/image.php?id=4083&amp;w=300&amp;h=300" src="../../images/articles/blank.gif"/></div> </div>
<div class="article__footer">
<div class="article__description data-link" data-link="https://www.24high.com/en/article/7112182-mazatapec-all-in-one-growkit-1200-cc"><a href="7112182-mazatapec-all-in-one-growkit-1200-cc.html"><span itemprop="name">Mazatapec, All in one Growkit </span></a></div>
<div class="text-center"><div class="rating" data-rating="3.5" itemprop="aggregateRating" itemscope="" itemtype="http://schema.org/AggregateRating">
<meta content="5" itemprop="bestRating"><meta content="3.5" itemprop="ratingValue"><meta content="2" itemprop="ratingCount">
<span class="rating__empty">
<span class="rating__btn" data-rating="1"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="2"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="3"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="4"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span><span class="rating__btn" data-rating="5"><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg></span>
</span>
<div class="rating__filled" style="width: 70%;">
<div class="rating__filcont">
<svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg><svg aria-hidden="true" class="svg-inline--fa fa-star fa-fw" data-fa-i2svg="" data-icon="star" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z" fill="currentColor"></path></svg>
</div>
</div>
</meta></meta></meta></div></div>
<div class="article__price data-link primary" data-link="https://www.24high.com/en/article/7112182-mazatapec-all-in-one-growkit-1200-cc" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"><a href="7112182-mazatapec-all-in-one-growkit-1200-cc.html">€ 34,95</a><meta content="EUR" itemprop="priceCurrency"/><meta content="34.95" itemprop="price"/><link href="http://schema.org/InStock" itemprop="availability"/></div>
<div class="article__actions"><a aria-label="Product Mazatapec, All in one Growkit " class="article__button btn btn--secondary btn--block dialog-dismiss" href="7112182-mazatapec-all-in-one-growkit-1200-cc.html"><svg aria-hidden="true" class="svg-inline--fa fa-info-circle fa-fw" data-fa-i2svg="" data-icon="info-circle" data-prefix="fas" focusable="false" role="img" viewbox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="currentColor"></path></svg></a><a aria-label="Order Mazatapec, All in one Growkit " class="article__button btn btn--primary btn--block addArticleToCart dialog-dismiss" data-articlenumber="7112182" href="7112355-ecuadorian-all-in-one-growkit-1200-cc.html#"><svg aria-hidden="true" class="svg-inline--fa fa-cart-plus fa-fw" data-fa-i2svg="" data-icon="cart-plus" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" fill="currentColor"></path></svg> <svg aria-hidden="true" class="svg-inline--fa fa-layer-group fa-fw" data-fa-i2svg="" data-icon="layer-group" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M264.5 5.2c14.9-6.9 32.1-6.9 47 0l218.6 101c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 149.8C37.4 145.8 32 137.3 32 128s5.4-17.9 13.9-21.8L264.5 5.2zM476.9 209.6l53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 277.8C37.4 273.8 32 265.3 32 256s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0l152-70.2zm-152 198.2l152-70.2 53.2 24.6c8.5 3.9 13.9 12.4 13.9 21.8s-5.4 17.9-13.9 21.8l-218.6 101c-14.9 6.9-32.1 6.9-47 0L45.9 405.8C37.4 401.8 32 393.3 32 384s5.4-17.9 13.9-21.8l53.2-24.6 152 70.2c23.4 10.8 50.4 10.8 73.8 0z" fill="currentColor"></path></svg></a></div>
</div>
</div><div class="article article--carousel" itemscope="" itemtype="http://schema.org/Product"><div class="article__header"><meta content="https://www.24high.com/images/articles/image.php?id=4767&amp;w=300&amp;h=300" itemprop="image"/><div class="article__image data-link cursor-pointer" data-link="https://www.24high.com/en/article/4212194-marshmallow-shrooms-growkit"><img alt="Marshmallow Shrooms Growkit" class="lazyload" data-src="https://www.24high.com/images/articles/image.php?id=4767&amp;w=300&amp;h=300" src="../../images/articles/blank.gif"/></div> </div>
<div class="article__footer">
<div class="article__description data-link" data-link="https://www.24high.com/en/article/4212194-marshmallow-shrooms-growkit"><a href="4212194-marshmallow-shrooms-growkit.html"><span itemprop="name">Marshmallow Shrooms Growkit</span></a></div>
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
<div class="article__price data-link primary" data-link="https://www.24high.com/en/article/4212194-marshmallow-shrooms-growkit" itemprop="offers" itemscope="" itemtype="http://schema.org/Offer"><a href="4212194-marshmallow-shrooms-growkit.html">€ 44,95</a><meta content="EUR" itemprop="priceCurrency"/><meta content="44.95" itemprop="price"/><link href="http://schema.org/InStock" itemprop="availability"/></div>
<div class="article__actions"><a aria-label="Product Marshmallow Shrooms Growkit" class="article__button btn btn--secondary btn--block dialog-dismiss" href="4212194-marshmallow-shrooms-growkit.html"><svg aria-hidden="true" class="svg-inline--fa fa-info-circle fa-fw" data-fa-i2svg="" data-icon="info-circle" data-prefix="fas" focusable="false" role="img" viewbox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" fill="currentColor"></path></svg></a><a aria-label="Order Marshmallow Shrooms Growkit" class="article__button btn btn--primary btn--block addArticleToCart dialog-dismiss" data-articlenumber="4212194" href="7112355-ecuadorian-all-in-one-growkit-1200-cc.html#"><svg aria-hidden="true" class="svg-inline--fa fa-cart-plus fa-fw" data-fa-i2svg="" data-icon="cart-plus" data-prefix="fas" focusable="false" role="img" viewbox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96zM252 160c0 11 9 20 20 20h44v44c0 11 9 20 20 20s20-9 20-20V180h44c11 0 20-9 20-20s-9-20-20-20H356V96c0-11-9-20-20-20s-20 9-20 20v44H272c-11 0-20 9-20 20z" fill="currentColor"></path></svg></a></div>
</div>
</div></div> </div>
</br></div>
<div class="clear"></div>
</div>
</div>