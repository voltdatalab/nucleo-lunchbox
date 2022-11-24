var $text = null;
var $save = null;
var $poster = null;
var $themeButtons = null;
var $aspectRatioButtons = null;
var $quote = null;
var $fontSize = null;
var $fontFamily = null;
var $show = null;
var $source = null;
var $quote = null;
var $logoWrapper = null;

var quotes = [
    {
        "quote": "Uma vida não questionada não merece ser vivida.",
        "source": "Platão"
    },
    {
        "quote": "A amizade é um amor que nunca morre.",
        "source": "Mario Quintana"
    },
    {
        "quote": "Tenho em mim todos os sonhos do mundo.",
        "source": "Fernando Pessoa",
        "size": 65
    },
    {
        "quote": "Ser ou não ser.",
        "source": "William Shakespeare",
        "size": 90
    },
    {
        "quote": "O inimigo do homem é o proprio homem!",
        "source": "Mateus 10:36",
        "size": 65
    },
    {
        "quote": "Nossas dúvidas são traidoras e nos fazem perder o que, com frequência, poderíamos ganhar, por simples medo de arriscar.",
        "source": "William Shakespeare",
        "size": 40
    }
];

// Change straight quotes to curly and double hyphens to em-dashes.
function smarten(a) {
  a = a.replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018");       // opening singles
  a = a.replace(/'/g, "\u2019");                            // closing singles & apostrophes
  a = a.replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1\u201c"); // opening doubles
  a = a.replace(/"/g, "\u201d");                            // closing doubles
  a = a.replace(/--/g, "\u2014");                           // em-dashes
  a = a.replace(/ \u2014 /g, "\u2009\u2014\u2009");         // full spaces wrapping em dash
  return a;
}

function convertToSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-');
}

function processText() {
    $text = $('.poster blockquote p, .source');
    $text.each(function() {
        var rawText = $.trim($(this).html());
        $(this).html(smarten(rawText)).find('br').remove();
    });
}

function saveImage() {
    // first check if the quote actually fits
    if (($source.offset().top + $source.height()) > $logoWrapper.offset().top) {
        alert("Your quote doesn't quite fit. Shorten the text or choose a smaller font-size.");
        return;
    }

    // don't print placeholder text if source is empty
    if ($source.text() === '') {
        alert("A source is required.");
        return;
    }

    // make sure source begins with em dash
    if (!$source.text().match(/^[\u2014]/g)) {
        $source.html('&mdash;&thinsp;' + $source.text());
    }

    $('canvas').remove();
    processText();

    html2canvas($poster, {
      onrendered: function(canvas) {
        document.body.appendChild(canvas);
        window.oCanvas = document.getElementsByTagName("canvas");
        window.oCanvas = window.oCanvas[0];
        var strDataURI = window.oCanvas.toDataURL();

        var quote = $('blockquote').text().split(' ', 5);
        var filename = convertToSlug(quote.join(' '));

        var a = $("<a>").attr("href", strDataURI).attr("download", "quote-" + filename + ".png").appendTo("body");

        a[0].click();

        a.remove();

        $('#download').attr('href', strDataURI).attr('target', '_blank');
        $('#download').trigger('click');
      }
    });
}

function adjustFontSize(size) {
    var fontSize = size.toString() + 'px';
    $poster.css('font-size', fontSize);
    if ($fontSize.val() !== size){
        $fontSize.val(size);
    };
}

$(function() {
    $text = $('.poster blockquote p, .source');
    $save = $('#save');
    $poster = $('.poster');
    $themeButtons = $('#theme .btn');
    $fontFamilyButtons = $('#fontfamily .btn');
    $aspectRatioButtons = $('#aspect-ratio .btn');
    $fontSize = $('#fontsize');
    $show = $('#show');
    $source = $('.source');
    $showCredit = $('.show-credit');
    $quote = $('#quote');
    $logoWrapper = $('.logo-wrapper');

    var quote = quotes[Math.floor(Math.random()*quotes.length)];
    if (quote.size){
        adjustFontSize(quote.size);
    }
    $('blockquote p').text(quote.quote);
    $source.html('&mdash;&thinsp;' + quote.source);
    processText();

    $save.on('click', saveImage);

    $themeButtons.on('click', function() {
        $themeButtons.removeClass().addClass('btn btn-primary');
        $(this).addClass('active');
        $poster.removeClass('poster-theme1 poster-theme2 poster-theme3 poster-theme4')
                    .addClass('poster-' + $(this).attr('id'));
    });

    $fontFamilyButtons.on('click', function() {
        $fontFamilyButtons.removeClass().addClass('btn btn-primary');
        $(this).addClass('active');

        var fontFamily = $(this).attr('id');
        $poster.css('font-family', fontFamily);
        if ($fontFamily.val() !== fontFamily){
            $fontFamily.val(fontFamily);
        };
    });


    $aspectRatioButtons.on('click', function() {
        $aspectRatioButtons.removeClass().addClass('btn btn-primary');
        $(this).addClass('active');
        $poster.removeClass('square sixteen-by-nine').addClass($(this).attr('id'));

        if ($poster.hasClass('sixteen-by-nine')) {
            adjustFontSize(32);
            $fontSize.val(32);
        } else {
            adjustFontSize(90);
            $fontSize.val(90);
        }
    });

    $quote.on('click', function() {
        $(this).find('button').toggleClass('active');
        $poster.toggleClass('quote');
    });

    $fontSize.on('change', function() {
        adjustFontSize($(this).val());
    });

    $show.on('keyup', function() {
        var inputText = $(this).val();
        $showCredit.text(inputText);
    });

    // // This event is interfering with the medium editor in some browsers
    // $('blockquote').on('keyup', function(){

    //     console.log($(this)[0].selectionStart);
    //     process_text();
    // });


    var quoteEl = document.querySelectorAll('.poster blockquote');
    var sourceEl = document.querySelectorAll('.source');

    var quoteEditor = new MediumEditor(quoteEl, {
        disableToolbar: true,
        placeholder: 'Type your quote here'
    });

    var sourceEditor = new MediumEditor(sourceEl, {
        disableToolbar: true,
        placeholder: 'Type your quote source here'
    });
});
