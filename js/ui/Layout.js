/* global define, $ */
define([
  'ui/EditorsPanel', 'ui/FilesTree', 'ui/Toolbar'
], function(
  EditorsPanel, FilesTree, Toolbar
) {

  /**
  * ArduIDE Layout
  */
  var Layout = function(app) {
    this.app = app;
    this.el = $('.layout');
    this.initSliders();
    this.initEventHandlers();
    this.toolbar = new Toolbar(this.app);
    this.filesTree = new FilesTree(this.app);
    this.editorsPanel = new EditorsPanel(this.app);
  };


  /**
  * Initialize Panel Resisizing Sliders
  */
  Layout.prototype.initSliders = function() {

    // Resize layout
    this.resize();

    // Init slider for panel resizing
    $('.layout-slider').mousedown(function(e_down) {
      e_down.preventDefault();
      var width = $('body').width();
      var westOffset = e_down.pageX - $('.layout-west').width();
      var separatorWidth = 5;
      $(document).mousemove(function(e_move) {
        var westWidth = e_move.pageX - westOffset;
        if(westWidth < 150) westWidth = 150;
        $('.layout-west').css('width', westWidth+'px');
        $('.layout-center').css('width', (width - westWidth - separatorWidth)+'px' );
      });
    });
  };


  /**
  *
  */
  Layout.prototype.initEventHandlers = function() {
    $(document).mouseup(function() {
      $(document).unbind('mousemove');
    });

    $(window).resize((function() {
      this.resize();
    }).bind(this));
  };


  /**
  *
  */
  Layout.prototype.resize = function() {
    var width = $('body').width();
    var westWidth = 200;
    var separatorWidth = 5;
    $('.layout-west').css('width', westWidth+'px');
    $('.layout-separator').css('width', separatorWidth+'px');
    $('.layout-center').css('width', (width - westWidth - separatorWidth)+'px' );
    $('.tree-scroll').css('height', $('.files-tree').height()+'px');
  };


  return Layout;
});