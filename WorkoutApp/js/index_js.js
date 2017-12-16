$(document).ready(function() {
      var navHeight = $("nav").height();
      $("nav li").show();
      $(".dropdown").hide();
  $(window).scroll(function() {
    // if scrolled a greater amount then the initial height of the nav..
      if ($(document).scrollTop() > navHeight){
          //shrink icon
           $(".logo").addClass("logoShrink");
           //shrink nav
           $("nav").addClass("navShrink");
           // keep the links centered in the nav
           $(".navLogo").addClass("keepCenter");
           $(".nameTag").addClass("nameTagShrink");
           // move the dropdown up so it is still on the lower edge of the nav
           $(".dropdown").css("top","69px"); //equal to nav height-1
       
      } else {
     // otherwise if no scroll or scroll back up take off the settings
        $(".logo").removeClass("logoShrink");
        $("nav").removeClass("navShrink");
        $(".navLogo").removeClass("keepCenter");
        $(".nameTag").removeClass("nameTagShrink");

        $(".dropdown").css("top","77px");//equal to nav height
      }
    });
}); 
//end document ready