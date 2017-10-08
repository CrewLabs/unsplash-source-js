(function (root, undefined) {
  "use strict";

  var UnsplashPhoto = function () {
    this.version = "1.0.0";
    this.url = "https://source.unsplash.com";
    this.dimensions = {};
    this.scope = "all";
    this.randomizationInterval = "perRequest";

    return this;
  };

  /**
   * Finds a photo by its specific public ID
   * @param  {Int} id
   * @return {UnsplashPhoto}
   */
  UnsplashPhoto.prototype.find = function (id) {
    this.id = id;

    return this;
  };

  /**
   * Sets the width of the photo
   *
   * Note: crops if necessary to maintain the aspect ratio
   * 
   * @param  {Int} width
   * @return {UnsplashPhoto}
   */
  UnsplashPhoto.prototype.width = function (width) {
    this.dimensions.width = width;

    return this;
  };

  /**
   * Sets the height of the photo
   *
   * Note: crops if necessary to maintain the aspect ratio
   * 
   * @param  {Int} height
   * @return {UnsplashPhoto}
   */
  UnsplashPhoto.prototype.height = function (height) {
    this.dimensions.height = height;

    return this;
  };

  /**
   * Shorthand for setting the photo dimensions
   *
   * Note: crops if necessary to maintain the aspect ratio
   * 
   * @param  {Int} width
   * @param  {Int} height (optional)
   * @return {UnsplashPhoto}
   */
  UnsplashPhoto.prototype.size = function (width, height) {
    this.dimensions = {
      width: width,
      height: height || width
    };

    return this;
  };

  /**
   * Sets the randomization interval
   *
   * Note: only accepts three possible values (null, daily, or weekly)
   * @param  {String} interval
   * @return {UnsplashPhoto}
   */
  UnsplashPhoto.prototype.randomize = function (interval) {
    if (interval == "daily" || interval == "weekly") {
      this.randomizationInterval = interval;
    } else {
      this.randomizationInterval = "perRequest";
    }

    return this;
  };

  /**
   * Sets the scope to `featured` (instead of `all`)
   * @return {UnsplashPhoto}
   */
  UnsplashPhoto.prototype.featured = function () {
    this.scope = "featured";

    return this;
  };

  /**
   * Limits the photo to having tags or locations matching the keywords
   * @param  {[Array || String]} keywords
   * @return {UnsplashPhoto}
   */
  UnsplashPhoto.prototype.of = function (keywords) {
    var sanitizedKeywords = [];

    // Handle a string of comma-separated keywords
    if (!Array.isArray(keywords)) {
      keywords = keywords.split(",");
    }

    // Remove any leading or trailing whitespace from each keyword
    keywords.forEach(function (keyword) {
      sanitizedKeywords.push(keyword.trim());
    });

    this.keywords = sanitizedKeywords.join(",");
    this.keywords = encodeURI(this.keywords);

    return this;
  };

  /**
   * Limits the photos to a specific photographer
   * @param  {String} username 
   * @return {UnsplashPhoto}
   */
  UnsplashPhoto.prototype.fromUser = function (username) {
    this.username = username;

    return this;
  };

  /**
   * Limits the photos to a specific category
   * @param  {String} category
   * @return {UnsplashPhoto}
   */
  UnsplashPhoto.prototype.fromCategory = function (category) {
    this.category = category;

    return this;
  };

  /**
   * Limits photos to a specific collection
   * @param {String} collectionId
   * @return {UnsplashPhoto}
   */
  UnsplashPhoto.prototype.fromCollection = function (collectionId) {
    this.collection = collectionId;

    return this;
  };

  /**
   * Returns true if the photo has dimensions set
   * @return {Boolean}
   */
  UnsplashPhoto.prototype._hasDimensions = function () {
    return !!this.dimensions.width && !!this.dimensions.height;
  };

  /**
   * Appends the photo dimensions to the URL
   * @return {String} the photo URL
   */
  UnsplashPhoto.prototype._appendDimensions = function () {
    if (this._hasDimensions()) {
      this.url += "/" + this.dimensions.width + "x" + this.dimensions.height;
    }

    return this.url;
  };

  /**
   * Appends the scope to the URL
   * @return {String} the photo URL
   */
  UnsplashPhoto.prototype._appendScope = function () {
    if (this.scope == "featured") {
      this.url += "/featured";
    }

    return this.url;
  };

  /**
   * Appends the keywords to the URL
   * @return {String} the photo URL
   */
  UnsplashPhoto.prototype._appendKeywords = function () {
    if (this.keywords) {
      this.url += "?" + this.keywords;
    }

    return this.url;
  };

  /**
   * Appends the randomization interval to the URL
   * @param  {Boolean} includeRandomPath include the `/random` path in the URL
   * @return {String} the photo URL
   */
  UnsplashPhoto.prototype._appendRandomization = function (includeRandomPath) {
    if (includeRandomPath && this.randomizationInterval == "perRequest") {
      this.url += "/random";
    } else if (this.randomizationInterval == "daily") {
      this.url += "/daily";
    } else if (this.randomizationInterval == "weekly") {
      this.url += "/weekly";
    }

    return this.url;
  };

  /**
   * Creates the URL based on the previous actions
   * @return {String} the photo URL
   */
  UnsplashPhoto.prototype.fetch = function () {
    if (!!this.id) {
      this.url += "/" + this.id;
      this._appendDimensions();
      return this.url;

    } else if (!!this.username) {
      this.url += "/user/" + this.username;
      this._appendScope();
      this._appendDimensions();
      this._appendRandomization(false);
      this._appendKeywords();
      return this.url;

    } else if (!!this.category) {
      this.url += "/category/" + this.category;
      this._appendScope();
      this._appendDimensions();
      this._appendRandomization(false);
      this._appendKeywords();
      return this.url;

    } else if (!!this.collection) {
      this.url += "/collection/" + this.collection;
      this._appendScope();
      this._appendDimensions();
      this._appendRandomization(false);
      this._appendKeywords();
      return this.url;
      
    } else {
      this._appendScope();
      this._appendDimensions();
      this._appendRandomization(true);
      this._appendKeywords();
      return this.url;

    }
  };

  root.UnsplashPhoto = UnsplashPhoto;

})(this);
