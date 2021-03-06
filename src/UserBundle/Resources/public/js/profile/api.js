define(
    ['jquery', 'lodash', 'backbone', 'marionette', 'core/module', 'profile/view/modal/create', 'routing', 'template', 'profile/view/token'],
    function($, _, Backbone, Mn, Module, CreateModal, Routing, Template, TokenView) {
        "use strict";

        return Module.extend({
            regions: {
                'tokenList': '#token-list'
            },
            collection: null,
            initialize: function() {
                var collection = Backbone.Collection.extend({
                    url: Routing.generate('_xhr_api_keys_list'),
                    model: Backbone.Model.extend({
                        destroy: function(options) {
                            var opts = _.extend({url: Routing.generate('_xhr_api_keys_revoke', {'id': this.id})}, options || {});
                            return Backbone.Model.prototype.destroy.call(this, opts);
                        }
                    })
                });

                this.collection = new collection();
                this.collection.fetch();

                var collectionView = new Mn.CollectionView({
                    collection: this.collection,
                    childView: TokenView,
                    emptyView: Mn.View.extend({
                        template: Template.user.empty_tokens
                    })
                });

                this.app.showChildView('tokenList', collectionView);

                $('#create-api-token').on('click', _.bind(this.createToken, this))
            },
            createToken: function(event) {
                event.preventDefault();

                var modal = new CreateModal({
                    route: Routing.generate('_xhr_api_keys_create')
                });

                this.listenTo(modal, 'ajax:response', _.bind(function(response) {
                    this.collection.add(response);
                }, this));
            }
        });
    });
