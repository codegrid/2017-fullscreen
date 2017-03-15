(function(){

  var NAME_MAP = {

    /**
     * document properties
     */
    fullscreenEnabled: {
      webkit: 'webkitFullscreenEnabled',
      moz: 'mozFullscreenEnabled',
      ms: 'msFullscreenEnabled'
    },

    fullscreenElement: {
      'webkit': 'webkitFullscreenElement',
      'moz': 'mozFullScreenElement',
      'ms': 'msFullscreenElement'
    },

    /**
     * element method
     */
    requestFullscreen: {
      'webkit': 'webkitRequestFullScreen',
      'moz': 'mozRequestFullScreen',
      'ms': 'msRequestFullscreen'
    },

    /**
     * document method
     */

    exitFullscreen: {
      'webkit': 'webkitCancelFullScreen',
      'moz': 'mozCancelFullScreen',
      'ms': 'msExitFullscreen'
    },

    /**
     * document event
     */
    fullscreenchange: {
      webkit: 'webkitfullscreenchange',
      moz: 'mozfullscreenchange',
      ms: 'MSFullscreenChange'
    },

    fullscreenerror: {
      webkit: 'webkitfullscreenerror',
      moz: 'mozfullscreenerror',
      ms: 'MSFullscreenError'
    }
  };

  var VENDOR_PREFIX = Object.keys(NAME_MAP.requestFullscreen).filter(function(prefix){
    return NAME_MAP.requestFullscreen[prefix] in Element.prototype;
  })[0];

  if(!VENDOR_PREFIX){
    return;
  }

  document.VENDOR_PREFIX = VENDOR_PREFIX;

  function getVendorSpecName(name){
    return NAME_MAP[name][VENDOR_PREFIX];
  }

  function bindStandardSpecName(target, name){
    var vendorSpecName = getVendorSpecName(name);
    if(vendorSpecName in target){
      target[name] = target[vendorSpecName];
    }
  }

  /**
   * document.fullscreenEnabled
   */
  bindStandardSpecName(document, 'fullscreenEnabled');

  /**
   * Element.prototype.requestFullscreen
   */
  bindStandardSpecName(Element.prototype, 'requestFullscreen');

  /**
   * document.exitFullscreen
   */
  bindStandardSpecName(document, 'exitFullscreen');



  var lastFullscreenElement;
  document.addEventListener(getVendorSpecName('fullscreenchange'), function(){
    /**
     * document.fullscreenElement
     */
    bindStandardSpecName(document, 'fullscreenElement');

    /**
     * fullscreen class
     */
    if(document.fullscreenElement){
      document.fullscreenElement.classList.add('fullscreen');
      lastFullscreenElement = document.fullscreenElement;
      document.body.classList.add('full-screen-ancestor');
    }
    else{
      lastFullscreenElement.classList.remove('fullscreen');
      document.body.classList.remove('full-screen-ancestor');
    }
  }, false);

  var addEventListener = document.addEventListener;
  document.addEventListener = function(){
    var eventNameAdjusted = false;
    var params = [].map.call(arguments, function(param, index){
      if(VENDOR_PREFIX && !index && /^(fullscreenchange|fullscreenerror)$/.test(param)){
        eventNameAdjusted = true;
        return getVendorSpecName(param);
      }
      else if(eventNameAdjusted && index === 1){
        return function(event){
          param.call(document, event);
        }
      }
      return param;
    });
    return addEventListener.apply(this, params);
  };

  /**
   * remove fullscreenchange event
   */
  var removeEventListener = document.removeEventListener;
  document.removeEventListener = function(){
    var params = [].map.call(arguments, function(param, index){
      if(VENDOR_PREFIX && !index && /^(fullscreenchange|fullscreenerror)$/.test(param)){
        return getVendorSpecName(param);
      }
      return param;
    });
    return addEventListener.apply(this, params);
  };

})();
