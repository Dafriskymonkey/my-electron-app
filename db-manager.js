const loki = require('lokijs');
const LokiFsAdapter = require('lokijs/src/loki-fs-structured-adapter.js');

class DBManager {
    constructor() {
        const adapter = new LokiFsAdapter();
        this.db = new loki('./data.db', {
            adapter
        });
    }

    init() {
        return new Promise((resolve, reject) => {
            this.db.loadDatabase({}, (error) => {
                if (error) {
                    console.error('can not load database');
                    reject(error);
                }
                else {
                    this.items = this.db.getCollection('items');
                    if (!this.items) {
                        console.info('collection does NOT exist');
                        this.items = this.db.addCollection('items', {
                            indices: ['name']
                        });
                        console.info('added collection');
                    }
                    console.info('loaded database');
                    resolve();
                }
            });
        });
    }

    addOne(collection, item) {
        if (!this[collection]) {
            console.warn(`collection "${collection}" does not exist`);
            return;
        }

        this[collection].insert(item);

        return new Promise((resolve, reject) => {
            this.db.saveDatabase((error) => {
                if (error) {
                    console.error('error while saving the database');
                    reject(error);
                } else {
                    console.log('database saved successfully');
                    resolve(item);
                }
            });
        });
    }

    getAll(collection){
        if (!this[collection]) {
            console.warn(`collection "${collection}" does not exist`);
            return;
        }

        return this[collection].find();
    }

}

module.exports = DBManager;