ht.Views.CreateGameView = Backbone.View.extend({

  className: 'create-game',

  template: ht.Templates.CreateGameTemplate,

  initialize: function(options) {
    _.bindAll(this, 'addInvited');
    ht.dispatcher.bind('addInvited', this.addInvited);

    this.render();
  },

  events: {
    'click #cancel': 'cancel',
    'click .avatar-contain': 'searchStart',
    'click #start': 'sendInvitations'
  },

  render: function () {
    this.$el.empty();
    this.$el.append(this.template(this.model.attributes));
  },

  cancel: function() {
    this.remove();
    ht.router.back();
  },

  sendInvitations: function(){
    $('#startGameButton').hide();
    var self = this;
    var obj = {};
    obj.author = this.model.get('username');
    obj.gameAdmin = this.model.get('_id');
    obj.player2 = this.player2._id;
    obj.player3 = this.player3._id;
    obj.player4 = this.player4._id;
    obj.title = $('#gameTitle').val();
    console.log(obj);
    $.ajax({
      url: '/invite/create',
      type:'POST',
      data: obj,
      success: function(){
        self.remove();
        ht.router.navigate('/lobby/'+self.model.get('_id'), {trigger: true});
      },
      error: function(a, b, err){
        console.log(err);
      }
    });
  },

  addInvited: function(data, player){
    this.search.remove();
    this[player] = data;
    $('#'+player).attr('src', data.avatarURL);
    if(this.player2 && this.player3 && this.player4){
      $('#startGameButton').show();
    }
  },

  searchStart: function(e) {
    this.search = new ht.Views.CreateGameSearchView({attributes: {player: e.target.id}});
    this.$el.find('form').after(this.search.el);
  }

});