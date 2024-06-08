(function ($) {
  "use strict";

  $.Common = function () {
    // Common elements
    this.elements = {
      body: $("body"),
      preloader: $("div.preloader"),
      anchorLink: $('a[href*="#"]:not([href="#"])'),
    };

    // Default variables
    this.pageFunction = {};

    this.window = $(window);
    this.windowWidth = $(window).width();
    this.windowHeight = $(window).height();
    this.device = {
      desktop: this.windowWidth >= 1024 ? true : false,
      tablet: this.windowWidth >= 768 && this.windowWidth < 1024 ? true : false,
      smartphone: this.windowWidth < 768 ? true : false,
    };

    // Init
    this.init();
  };

  $.Common.prototype = {
    init: function () {
      var self = this;

      $.extend(this.elements, {
        header: $("header"),
        navMain: $("nav.nav-main"),
        sidemenu: $(".sidemenu"),
        sidemenuToggle: $("a.sidemenu-toggle"),
        settingsMenu: $(".settings-menu"),
        settingsToggle: $("a.settings-toggle"),
        switchNightMode: $('[data-toggle="night-mode"]'),
        switchSecretPunchline: $('[data-toggle="secret-punchline"]'),
        switchEarlyAccess: $('[data-toggle="early-access"]'),
        cookie: $(".cookie"),
        cookieValidator: $(".cookie a:last"),
        overlay: $("div.header-overlay"),
        backTop: $("a.btn-up"),
        scrollDownArrow: $("a.icon-down-arrow"),
        parallaxedBackground: $("section.is-parallaxed"),
        punchline: $("#punchline"),
        earlyAccess: $("#early-access"),
        steamGotIt: $("a.btn-steam"),
        workFilter: $(".list-filters"),
        workSample: $(".list-works"),
        listSkill: $(".list-skills"),
        skill: $("div.list-skills-header"),
      });

      // Smooth scroll
      this.elements.anchorLink.smoothScroll();

      // Header resize on scroll
      this.headerResize();

      // Responsive header
      this.responsiveHeader();

      // Settings menu
      this.sideMenus();

      // Settings
      this.customSettings();

      // Background parallaxes
      this.parallaxBackground();

      // Steam 'Got it'
      this.gotIt();

      // Works filters
      this.worksFilters();

      // Reveal skills on click
      this.skillsReveal();

      // Ripple effect
      this.rippleEffect();

      // Leaflet map
      // this.leafletMap();
    },
    headerResize: function () {
      var self = this;

      if (self.windowWidth >= 768) {
        self.window.scroll(function () {
          self.elements.header.toggleClass(
            "reduced",
            $(document).scrollTop() >= self.windowHeight - 50
          );
          self.elements.backTop.toggleClass(
            "is-visible",
            $(document).scrollTop() >= self.windowHeight - 50
          );
        });
      }
    },
    responsiveHeader: function () {
      var self = this;

      if (self.windowWidth <= 767) {
        self.elements.sidemenuToggle.on("click", function () {
          self.elements.navMain.toggleClass("open");
          return false;
        });
      }
    },
    sideMenus: function () {
      var self = this;

      function openSideMenu() {
        self.elements.settingsMenu.toggleClass("open");
        self.elements.sidemenu.toggleClass("open");
        self.elements.overlay
          .fadeToggle("fast", "swing")
          .css("display", "block")
          .on("click", function () {
            self.elements.navMain.removeClass("open");
            self.elements.settingsMenu.removeClass("open");
            $(this).fadeOut("fast", "swing");
            return false;
          });
      }

      function openSettingsMenu() {
        self.elements.settingsMenu.toggleClass("open");
        self.elements.overlay.fadeToggle("fast", "swing");
      }

      function reinitAllMenus() {
        self.elements.navMain.removeClass("open");
        self.elements.settingsMenu.removeClass("open");
        self.elements.overlay.fadeOut("fast", "swing");
      }

      if (self.windowWidth >= 767) {
        self.elements.sidemenuToggle.on("click", function () {
          openSideMenu();
          return false;
        });
      } else {
        self.elements.sidemenuToggle.on("click", function () {
          if (self.elements.settingsMenu.hasClass("open")) {
            reinitAllMenus();
          } else {
            openSideMenu();
            self.elements.settingsMenu.removeClass("open");
            return false;
          }
        });
        self.elements.settingsToggle.on("click", function () {
          openSettingsMenu();
          return false;
        });
      }
    },
    customSettings: function () {
      var self = this;

      // Night mode
      function toggleNightMode() {
        self.elements.body.toggleClass("night-mode");
      }

      self.elements.switchNightMode.change(function () {
        toggleNightMode();
        return false;
      });

      // Secret punchline
      function toggleSecretPunchline() {
        self.elements.punchline.toggleClass("is-hidden");
      }

      self.elements.switchSecretPunchline.change(function () {
        toggleSecretPunchline();
        return false;
      });

      // Early Access
      function toggleEarlyAccess() {
        self.elements.earlyAccess.slideToggle("500", "swing");
      }

      self.elements.switchEarlyAccess.change(function () {
        toggleEarlyAccess();
        return false;
      });
    },
    parallaxBackground: function () {
      var self = this;

      self.window.scroll(function () {
        if (self.windowWidth >= 768) {
          var top = $(this).scrollTop();
          self.elements.parallaxedBackground.css(
            "background-position",
            "center " + top / -3 + "px"
          );
          self.elements.cookie.fadeOut("fast");
        } else {
          self.elements.cookie.fadeOut("fast");
        }
      });
    },
    gotIt: function () {
      var self = this;

      self.elements.steamGotIt.on("click", function (event) {
        event.preventDefault();

        self.elements.switchEarlyAccess.prop("checked", false);
        self.elements.earlyAccess.slideToggle("500", "swing", function () {
          self.elements.scrollDownArrow.attr("href", "#about");
        });
      });
    },
    worksFilters: function () {
      var self = this;

      self.elements.workFilter.on("click", function (event) {
        event.preventDefault();
        var filterCategory = $(this).data("category");

        self.elements.workFilter.removeClass("active-filter");
        $(this).addClass("active-filter");

        self.elements.workSample.each(function () {
          var category = $(this).attr("class");

          if (!$(this).hasClass(filterCategory)) {
            $(this).addClass("hidden-work");
          } else {
            $(this).removeClass("hidden-work");
          }
        });
      });
      self.elements.workFilter.eq(0).on("click", function (event) {
        event.preventDefault();
        self.elements.workSample.removeClass("hidden-work");
      });
    },
    skillsReveal: function () {
      var self = this;

      self.elements.skill.on("click", function (event) {
        event.preventDefault();

        self.elements.listSkill.find($("section")).slideUp("500", "swing");
        $(this).parent().find($("section")).stop().slideToggle("500", "swing");
      });
    },
    rippleEffect: function () {
      var self = this;
      var ripple, d, x, y;

      $(self.elements.skill).click(function (e) {
        var skill = $(this).find(".ripple-mask");

        if (skill.find(".ripple-effect").length == 0) {
          skill.append("<span class='ripple-effect'></span>");
        }

        ripple = skill.find(".ripple-effect");
        ripple.removeClass("animate");

        if (!ripple.height() && !ripple.width()) {
          d = Math.max(skill.innerWidth(), skill.innerHeight());
          ripple.css({
            height: d,
            width: d,
          });
        }

        x = e.pageX - skill.offset().left - ripple.width() / 2;
        y = e.pageY - skill.offset().top - ripple.height() / 2;

        ripple
          .css({
            top: y + "px",
            left: x + "px",
          })
          .addClass("animate");
      });
    },
    leafletMap: function () {
      var map = L.map("map").setView([44.837789, -0.57918], 13),
        marker = L.icon({
          iconUrl: "/images/icons/icon-map-marker.svg",
          iconSize: [41, 51],
          iconAnchor: [22, 58],
        });

      L.tileLayer(
        "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
        {
          id: "oldsunflush.4b3b09f8",
          accessToken:
            "pk.eyJ1Ijoib2xkc3VuZmx1c2giLCJhIjoiZTNjOWNhMjhlMmExYTdiNzMzOTNmODRhZjFiNmFmYjUifQ.ASWmDJD_WvO8tRkaWxW_Og",
          attributionControl: false,
          zoomControl: false,
        }
      ).addTo(map);

      L.marker([44.837789, -0.57918], { icon: marker }).addTo(map);

      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();

      if (map.tap) map.tap.disable();
      document.getElementById("map").style.cursor = "default";
    },
  };

  /**
   * Smooth scroll
   */
  $.fn.smoothScroll = function () {
    var self = this;

    $(this).click(function (event) {
      if (
        location.pathname.replace(/^\//, "") ==
          this.pathname.replace(/^\//, "") &&
        location.hostname == this.hostname
      ) {
        var target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");

        if (target.length) {
          event.preventDefault();

          $("html, body").animate(
            {
              scrollTop: target.offset().top - 50,
            },
            300
          );
        }
      }
    });
  };

  /**
   * onReady
   */
  $(document).ready(function () {
    new $.Common();
  });
})(jQuery);
