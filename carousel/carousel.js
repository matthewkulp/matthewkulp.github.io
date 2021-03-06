



var previousHitbox = $('.previous');
var nextHitbox = $('.next');
var mobilePictures = $('.mobilePicture');




// Detect Touch Device.
if (Modernizr.touch) {

	// Get rid of .previous hitbox so a touch event advances in one direction.
	previousHitbox.hide();
	nextHitbox.css('width', '100%');



	// I have to pull the src attribute off the source tag
	// Put it into a new div, which I'll style
	// Move it out of the video div, so it doesn't mess up the pictures array

	// modify goTo to keep track of the current on and the next one

	// Remove mp4s
	$('.video').remove();

	// Take div attribute and turn it into an image and insert it in the div.
	mobilePictures.map(function(){
		$(this).append('<img src="' + $(this).attr('url') + '" />');
	});



} else {

	mobilePictures.remove();

};




//Initializations
var carousel = $('#carousel');
var items = $("#carousel ul li");
var pictures = $("ul .image");
var descriptions = $("ul .description");
var links = $('ul .link');
var titles = $('ul .title');

var inViewImage = $('.inview .imageContainer');
var inViewDescription = $('.inview .description');
var inViewTitle = $('.inview .title');
var inViewLink = $('.inview .link');

items.eq(0).addClass('active');
var currentItem = $('.active').index();
var currentImage = $('.currentImage');
var nextImage = $('.nextImage');
var loader = $(".loader");

var count = $('.count');
var linkImage = $('.inview .link img');

var autoCycle;
var nextItemTitle;
var currentItemTitle;
var nextItem;

var animationComplete = false;
var firstGoToCall = true;
var enterExitTime = 200;
var descriptionYChange = 9;
var titleYChange = -2;
var loaderEnterExitTime = 500;


var intervalTime;

function goTo (itemIndex) {
	nextItem = itemIndex;
	animationComplete = false;
	currentItemTitle = titles.eq(currentItem).html();
	nextItemTitle = titles.eq(nextItem).html();

	//Image Changes
	nextImage.empty();
	nextImage.css('opacity', '0');
	nextImage.html(pictures.eq(nextItem).html());

	if (nextImage.children().attr('isVideo') == 'true') {

		var video = nextImage.children();
		video[0].play();

	};

	nextImage.velocity('fadeIn', {
		duration: enterExitTime * 2,
		complete: function() {
				currentImage.html(nextImage.html());
			},
		}
	)

	// Description Changes
	inViewDescription.velocity( {
		opacity: [0, "ease-in", 1],
		translateY: [descriptionYChange, 0],
		}, {
		duration: enterExitTime,
		complete: function() {
			inViewDescription.html(descriptions.eq(nextItem).html());
			inViewDescription.velocity(
				{
				opacity: [1, "ease-in", 0],
				translateY: [0, descriptionYChange],
				}, {
				duration: enterExitTime,
				complete: function() {
					animationComplete = true;
				}
				}
			)
		}
	});

	if (currentItemTitle == nextItemTitle && firstGoToCall == false) {

		inViewTitle.html(titles.eq(nextItem).html());

	} else {

		// Title Changes
		inViewTitle.velocity(
			{
			opacity: [0, "ease-in", 1],
			translateY: [descriptionYChange, 0],
			},
			{
			duration: enterExitTime,
			complete: function() {
				inViewTitle.html(titles.eq(nextItem).html());
				inViewTitle.velocity(
					{
					opacity: [1, "ease-in", 0],
					translateY: [0, descriptionYChange],
					},
					{
					duration: enterExitTime,
				})
			}
		});
	};

	// Link Changes
	if (firstGoToCall) {

		countChange(nextItem)
		setTimeout(function(){
			linkEnter(nextItem);
		}, enterExitTime);

	} else if (currentItemTitle == nextItemTitle) {

		changeHyperlinkURL(itemIndex);

	} else {

		inViewLink.velocity(
			{
			opacity: [0, "ease-in", 1],
			translateY: [descriptionYChange, 0],
			},
			{
			duration: enterExitTime,
			complete: function() {
				linkEnter(nextItem);
			}
		});
	}

	// Change the count: timer makes sure that the hyperlink.svg is fadedOut before countChange because countChange has dynamic width that visibly shifts hyperlink.svg over without this timer.
	if (firstGoToCall == false) {

		setTimeout(function() {
			countChange(itemIndex);
		}, enterExitTime)

	};

	// Make the nextItem .active
	items.removeClass('active')
		.eq(nextItem).addClass('active');

	currentItem = nextItem;


	firstGoToCall = false;


};





function changeHyperlinkURL (itemIndex) {

	var itemURL = links.eq(itemIndex).html();
	linkImage.unwrap();
	linkImage.wrap('<a href="' + itemURL + '" target="_blank"></div>');

}




function linkEnter (itemIndex) {

	// Change the link
	changeHyperlinkURL(itemIndex);

	// If the item doesn't have URL, hide the link img.
	if ($.trim(links.eq(itemIndex).html()).length == 0) {
		linkImage.css('display', 'none');
	} else {
		linkImage.css('display', 'initial');
	};

	// Enter Animation
	inViewLink.velocity(
		{
		opacity: [1, "ease-in", 0],
		translateY: [0, descriptionYChange],
		},
		{
		duration: enterExitTime,
	})
};




// Count Change
function countChange (itemIndex) {

	count.html(function() {
		return (itemIndex + 1) + "/" + pictures.length;
	});

	if (firstGoToCall == true) {

		count.velocity({
			opacity:[1, 'ease-in', 0],
			translateY: [0, descriptionYChange],
		},
		{
			duration: enterExitTime,
			delay: enterExitTime,
		})
	};
};




function carouselIntroduction (itemIndex) {
	// console.log("carouselIntroduction("+itemIndex+")");
	nextHitbox.css('display', 'inherit');
	previousHitbox.css('display', 'inherit');

	goTo(itemIndex);
};




// Loading Behavior
loader.velocity("fadeIn", {
	duration: loaderEnterExitTime
});



// defaultIntervalTime = 1000;
// intervalTime = defaultIntervalTime;

setTimeout(function () {
	pictures.eq(currentItem).imagesLoaded( function() {
	      loader.velocity("fadeOut",
	      {
	      duration: loaderEnterExitTime,
	      complete: function() {
				carouselIntroduction(currentItem);
				setIntervalTime(nextImage);
			},
		});
	})
}, 1100);




var autoCycleIsOff = false;
var autoCycleOff = function(){};

var turnAutoCycleOff = function(){
	autoCycleOff();
	autoCycleIsOff = true;
	$('video').attr('loop', 'true');
};

function setIntervalTime (element) {
	if (element.children().attr('isVideo') == 'true') {
		var video = element.children()[0];

		function onEnd(e) {
			// console.log('On End.... huge big log. dark pump.');
			intervalAdvance();
		};

		video.onended = onEnd;

		autoCycleOff = function(){
			// video.onended = null;
		};

	} else {
		var timeout = setTimeout(intervalAdvance, 7000);
		// console.log('timeout called');

		autoCycleOff = function(){
			clearTimeout(timeout);
		};
	};
};



function intervalAdvance() {
	// clearInterval(autoCycle);
	next();
	// console.log(nextImage.children().attr('isVideo') == 'true');

	setIntervalTime(nextImage);
}




function next(){
	if (currentItem < items.length-1 && animationComplete){
		goTo(currentItem + 1);

	} else if (animationComplete) {
		goTo(0)
	}

};




function previous(){

	if (currentItem == 0 && animationComplete){
		goTo(items.length-1);
	} else if (animationComplete){
		goTo(currentItem - 1);
	}

}




// Click Behavior
nextHitbox.on('click', function() {

	if (animationComplete) {
		turnAutoCycleOff();
		next();
		return false;
	}

});




previousHitbox.on('click', function() {

	if (animationComplete) {
		turnAutoCycleOff();
		previous();
		return false;
	}

});




//Swipe Behavior
inViewImage.on('swipeleft', function () {

	// clearInterval(autoCycle);
	turnAutoCycleOff();
	if (animationComplete) {
		next();
	}

});




inViewImage.on('swiperight', function () {

	// clearInterval(autoCycle);
	turnAutoCycleOff();
	if (animationComplete) {
		previous();
	}

});




$(document).keydown(function(e) {

	switch(e.which) {
		case 37: // left arrow key
			// clearInterval(autoCycle);
			turnAutoCycleOff();
			previous();
			break;

		case 39: // right arrow key
			// clearInterval(autoCycle);
			autoCycleOff();
			next();
			break;

		default: return; // exit this handler for other keys
	}

	e.preventDefault(); // prevent the default action (scroll / move caret)

});
