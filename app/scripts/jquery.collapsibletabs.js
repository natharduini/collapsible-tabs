/*
 *  Project: Collapsible Tabs
 *  Author: Nath Arduini
 *  License: Unlicensed
 */
;(function ($, window, document, undefined) {
    'use strict';
    var pluginName = 'collapsibleTabs',
        dataKey = 'plugin_' + pluginName;

    var Plugin = function (element, options) {

        this.element = element;
        this.options = {
            activeClass: 'active',
            collapsedClass: 'collapsed',
            collapseIcon: '<span class="collapse-icon">-</span>',
            expandIcon: '<span class="expand-icon">+</span>',
            animateCollapse: true
        };
        this.init(options);
    };

    Plugin.prototype = {
        init: function (options) {
            $.extend(this.options, options);
            var opts = this.options;

            this.element.find('li > a').each(function() {
                $(this).append(opts.collapseIcon + opts.expandIcon);
            });
            var toggleTabContent = function($tabLink, $tabContent) {
              $tabContent.toggleClass(opts.collapsedClass);
              $tabLink.parent().toggleClass(opts.collapsedClass);
              if ($tabContent.hasClass(opts.collapsedClass)) {
                $.event.trigger({
                  type: 'collapse.collapsibletabs',
                  message: 'Collapsed tab',
                  tab: $tabContent
                });
              } else {
                $.event.trigger({
                  type: 'expand.collapsibletabs',
                  message: 'Expanded tab',
                  tab: $tabContent
                });
              }
            };
            this.element.find('li > a').on('click', function(event) {
                event.preventDefault();
                var href = $(this).attr('href');
                var $tabLink = $(this),
                    $tabContent = $(href);

                if ($tabLink.parent().hasClass(opts.activeClass)) {
                    if (opts.animateCollapse) {
                      if ($tabContent.hasClass('collapsed')) {
                        // Animated opening
                        $tabContent.slideDown(function() {
                          toggleTabContent($tabLink, $tabContent);
                        });
                      } else {
                        // Animated closing
                        $tabContent.slideUp(function() {
                          toggleTabContent($tabLink, $tabContent);
                        });
                      }
                    } else {
                        // Opening / closing without animation
                        toggleTabContent($tabLink, $tabContent);
                    }
                } else {
                    // Tab reset
                    $tabLink.parent().siblings('li').removeClass(opts.activeClass + ' ' + opts.collapsedClass).css('display', '');
                    $tabContent.siblings('.tab-content').removeClass(opts.activeClass + ' ' + opts.collapsedClass).css('display', '');

                    // Tab behaviour
                    $tabLink.parent().addClass(opts.activeClass);
                    $tabContent.addClass(opts.activeClass);
                    
                    $.event.trigger({
                      type: 'show.collapsibletabs',
                      message: 'Shown tab',
                      tab: $tabContent
                    });
                }
            });
        }
    };
    /*
     * Plugin wrapper, preventing against multiple instantiations and
     * return plugin instance.
     */
    $.fn[pluginName] = function (options) {
        var plugin = this.data(dataKey);
        if (plugin instanceof Plugin) {
            if (typeof options !== 'undefined') {
                plugin.init(options);
            }
        } else {
            plugin = new Plugin(this, options);
            this.data(dataKey, plugin);
        }
        return plugin;
    };
}(jQuery, window, document));