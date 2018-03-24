// agenda
  // title: string
  // created at: date
    // item
      // title: string
      // created at: date
      // updated at: date
        // sub-item
          // title: string
          // created at: date
          // updated at: date 

'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const SubSchema = new Schema({
  title: String, 
  createdAt: {type: Date, default: Date.now}, 
  updatedAt: {type: Date, default: Date.now},
  deleted: {type: Boolean, default: false}
});

const ItemSchema = new Schema({
  title: String, 
  createdAt: {type: Date, default: Date.now}, 
  updatedAt: {type: Date, default: Date.now},
  deleted: {type: Boolean, default: false},
  subs: [SubSchema]
});

ItemSchema.method("update", function(updates, callback) {
  Object.assign(this, updates, {updatedAt: new Date()});
  this.parent().save(callback);
});

const AgendaSchema = new Schema({
  title: String, 
  createdAt: {type: Date, default: Date.now}, 
  updatedAt: {type: Date, default: Date.now},
  deleted: {type: Boolean, default: false},
  items: [ItemSchema]
});



const Agenda = mongoose.model("Agenda", AgendaSchema);

module.exports.Agenda = Agenda;