var superDirty = function(/* arguments */) {
  var self = this;

  // _super() is always the 2nd last argument to addedAt/movedTo/removedAt
  arguments[arguments.length-2]();

  // only after _super()'s deferred stuff
  famous.core.Engine.defer(function() {
    self.view._isDirty = true;
  });
};

var extension = {

  create: function(options) {
    options = _.extend({
      layoutOptions: {
          itemSize: [100, 100],
          margins: [20, 20],
          spacing: [20, 20],
          justify: true,
          cells: [3,3],
          ratios: [0.2, 0.5, 0.3]
      },
      flow: true,    // smoothly animates renderables when changing the layout
      direction: undefined,   // 0 = X, 1 = Y, undefined = use default from selected layout-function
      //autoPipeEvents: true,
      alignment: 0
    }, options);

    if (typeof options.layout === 'string') {
      if (Flex[options.layout])
        options.layout = Flex[options.layout];
      else
        throw new Error("[FlexLayoutController] No such Layout " + options.layout);
    }

    var node = new this._view.constructor(options);

    /*
     * If no dataSource is specified, expect a typical famousEach setup
     */
    if (!options.dataSource) {
      // Quick hack for init order
      node.sequenceFrom = function(source) {
        node.setDataSource(source);
      };
    }

    return node;
  },

  famousCreatedPost: function() {
    this.pipeChildrenTo = this.parent.pipeChildrenTo ?
      [ this.view, this.parent.pipeChildrenTo[0] ] :
      [ this.view ];
  },

  attrUpdate: function(key, value, oldValue, data, firstTime) {

    if (key === 'layout') {
      if (typeof value === 'string') {
        if (Flex[value])
          return this.view.setLayout(Flex[value]);
        else
          throw new Error("[FlexLayoutController] No such Layout " + value);
      } else
        return this.setLayout(value);
    }

    if (key === 'direction')
      return this.view.setDirection(value);

    if (key === 'layoutOptions')
      return this.view.setLayoutOptions(value);

  },

  addedAt: superDirty,
  movedTo: superDirty,
  removedAt: superDirty
};

FView.registerView('FlexLayoutController', Flex.LayoutController, extension);
FView.registerView('FlexScrollView', Flex.FlexScrollView, extension);