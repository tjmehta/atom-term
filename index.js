var url = require('url');
var TermView = require('./lib/TermView');

module.exports = {
    termViews: [],
    config: {
      "autoRunCommand": {
        "type": "string",
        "default": null
      }
    },
    activate: function (state) {
      this.state = state;
      var self = this;
      atom.commands.add('atom-workspace','term:open', self.openTerm.bind(self));
      ['up', 'right', 'down', 'left'].forEach(function (direction) {
        atom.commands.add('atom-workspace','term:open-split-'+direction, self.splitTerm.bind(self, direction));
      });
      if (state.termViews) {
        // TODO: restore
      }
    },
    createTermView: function () {
      var opts = {
        runCommand: atom.config.get('term.autoRunCommand')
      };
      var termView = new TermView(opts);
      termView.on('remove', this.handleRemoveTerm.bind(this));
      this.termViews.push(termView);
      return termView;
    },
    splitTerm: function (direction) {
      var termView = this.createTermView();
      direction = capitalize(direction);
      atom.workspace.getActivePane()['split'+direction]({
        items: [termView]
      });
    },
    openTerm: function() {
      var termView = new TermView();
      activePane = atom.workspace.getActivePane();
      activePane.addItem(termView);
      activePane.activateNextItem();
    },
    handleRemoveTerm: function (termView) {
      var termViews = this.termViews;
      termViews.splice(termViews.indexOf(termView), 1); // remove
    },
    deactivate: function () {
      this.termViews.forEach(function (view) {
        view.deactivate();
      });
    },
    serialize: function () {
      var termViewsState = this.termViews.map(function () {
        return termViews.serialize();
      });
      return {
        termViews: termViewsState
      };
    }
};

function capitalize (str) {
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}
