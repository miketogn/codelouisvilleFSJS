'use strict';

var express = require("express");
var router = express.Router();
const mongoose = require('mongoose');
var Agenda = require('../models').Agenda;

router.param("agenda", function(req, res, next, id){
  Agenda.findById(id, function(err, doc){
    if(err) return next(err);
    if(!doc) {
      err = new Error("Not Found");
      err.status = 404;
      return next(err);
    }
    req.agenda = doc;
    return next();
  });
});

router.param("item", function(req, res, next, id){
  req.item = req.agenda.items.id(id); 
  if(!req.item) {
    err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});

// GET /agendas
// Route for agendas collection
router.get("/", function(req, res, next){
  
  Agenda.find({deleted: {$ne: true}}, function(err, agendas) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    
    res.json(agendas);
  });
});


// Create an agenda

router.post('/', function(req, res, next) {
  const Agenda = mongoose.model('Agenda');
  const AgendaData = {
    title: req.body.title,
  };

  Agenda.create(AgendaData, function(err, newAgenda) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }

    res.json(newAgenda);
  });
});

// Route for a specific agenda
router.get("/:agenda", function(req, res){
  res.json(req.agenda);
});

// Route for creating an agenda item
router.post("/:agenda/items", function(req, res, next){
  req.agenda.items.push(req.body);
  req.agenda.save(function(err, agenda){
    if(err) return next(err);
    res.status(201);
    res.json(agenda);
  });
});

// PUT /agenda/:agenda/items/:item
// Edit a specific item
router.put("/:agenda/items/:item", function(req, res, next){
  req.item.update(req.body, function(err, result){
    if(err) return next(err);
    res.json(result);
  });
});


// Delete a specific item

router.delete("/:agenda/items/:item", function(req, res, next){
  req.item.remove(function(err){
    req.agenda.save(function(err, agenda){
      if(err) return next(err);
      res.json(agenda);
    });
  });
});

// Delete a specific agenda

router.delete('/:agendaId', function(req, res, next) {
  const Agenda = mongoose.model('Agenda');
  const agendaId = req.params.agendaId;

  Agenda.findById(agendaId, function(err, agenda) {
    if (err) {
      console.log(err);
      return res.status(500).json(err);
    }
    if (!agenda) {
      return res.status(404).json({message: "File not found"});
    }

    agenda.deleted = true;

    agenda.save(function(err, doomedAgenda) {
      res.json(doomedAgenda);
    })

  })
});


// Edit a specific agenda 

router.put('/:agendaId', function(req, res, next) {
  const Agenda = mongoose.model('Agenda');
  const agendaId = req.params.agendaId;

  Agenda.findById(agendaId, function(err, agenda) {
    if (err) {
      console.error(err);
      return res.status(500).json(err);
    }
    if (!agenda) {
      return res.status(404).json({message: "File not found"});
    }

    agenda.title = req.body.title;
    
    agenda.save(function(err, savedAgenda) {
      if (err) {
        console.error(err);
        return res.status(500).json(err);
      }
      res.json(savedAgenda);
    })

  })
});


// Route for creating an agenda sub item

router.post("/:agenda/items/:item/", function(req, res, next){
  req.agenda.items.id(req.params.item).subs.push(req.body);
  req.agenda.save(function(err, agenda){
    if(err) return next(err);
    res.status(201);
    res.json(agenda);
  });
});

// // PUT /agenda/:agenda/items/:item/subs/:subID  ******** GETS ERROR "The #update method is not available on EmbeddedDocuments" *********
// // Edit a specific sub-item
router.put("/:agenda/items/:item/subs/:sub", function(req, res, next){
  req.agenda.items.id(req.params.item).subs.id(req.params.sub).update(req.body, function(err, result){
    if(err) return next(err);
    res.json(result);
  });
});


// // Delete a specific sub item

router.delete("/:agenda/items/:item/subs/:sub", function(req, res, next){
  req.agenda.items.id(req.params.item).subs.id(req.params.sub).remove(function(err){
    req.agenda.save(function(err, agenda){
      if(err) return next(err);
      res.json(agenda);
    });
  });
});

module.exports = router;