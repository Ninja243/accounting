const BaseMeta = require('frappejs/model/meta');
const BaseDocument = require('frappejs/model/document');

class ItemMeta extends BaseMeta {
    setupMeta() {
        Object.assign(this, require('./item.json'));
    }
}

class Item extends BaseDocument {
}

module.exports = {
    Document: Item,
    Meta: ItemMeta
};
