'use strict';

var chai = require('chai');
var chaihttp = require('chai-http');

var server = 'http://localhost:' + (process.env.PORT || 3000);
var expect = chai.expect;
var id;

require('../../index');
chai.use(chaihttp);

describe('Basic notes CRUD', function() {
  it('should be able to create a note', function(done) {
    chai.request(server).
    post('/api/notes').
    send({noteBody: 'hello world'}).
    end(function(err, res) {
      expect(err).equals(null);
      expect(res).to.be.a('object');
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('Notes');
      expect(Array.isArray(res.body.Notes)).equals(true);
      expect(res.body.Notes.length).equals(1);
      expect(res.body.Notes[0]).to.have.property('noteBody');
      expect(res.body.Notes[0].noteBody).equals('hello world');
      expect(res.body.Notes[0]).to.have.property('_id');
      id = '/' + res.body.Notes[0]._id;
      done();
    });
  });

  it('is not authorized to get an index', function(done) {
    chai.request('http://localhost:3000').
    post('/api/notes/get').
    end(function(err, res) {
      expect(err).equals(null);
      expect(res).to.be.a('object');
      expect(res).to.have.status(500);
      done();
    });
  });

  it('should be able to get a single note', function(done) {
    chai.request(server).
    post('/api/notes/get' + id).
    end(function(err, res) {
      expect(err).equals(null);
      expect(res).to.be.a('object');
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('Notes');
      expect(Array.isArray(res.body.Notes)).equals(true);
      expect(res.body.Notes.length).equals(1);
      expect(res.body.Notes[0]).to.have.property('noteBody');
      expect(res.body.Notes[0].noteBody).equals('hello world');
      done();
    });
  });

  it('should be able to update a note', function(done) {
    chai.request(server).
    put('/api/notes' + id).
    send({noteBody: 'new note body'}).
    end(function(err, res) {
      expect(err).equals(null);
      expect(res).to.be.a('object');
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('Notes');
      expect(Array.isArray(res.body.Notes)).equals(true);
      expect(res.body.Notes.length).equals(1);
      expect(res.body.Notes[0]).to.have.property('noteBody');
      expect(res.body.Notes[0].noteBody).equals('new note body');
      done();
    });
  });

  it('should be able to delete a note', function(done) {
    chai.request(server).
    delete('/api/notes' + id).
    end(function(err, res) {
      expect(err).equals(null);
      expect(res).to.be.a('object');
      expect(res).to.have.status(200);
      done();
    });
  });

  it('should reject creating a note with invalid words', function(done) {
    chai.request(server).
    post('/api/notes').
    send({noteBody: 'jap'}).
    end(function(err, res) {
      expect(err).equals(null);
      expect(res).to.be.a('object');
      expect(res).to.have.status(500);
      done();
    });
  });

  it('should reject a note longer than 140 characters', function(done) {
    chai.request(server).
    post('/api/notes').
    send({noteBody:
      '12345678901234567890123456789012345678901234567890' +
      '12345678901234567890123456789012345678901234567890' +
      '12345678901234567890123456789012345678901234567890'}).
    end(function(err, res) {
      expect(err).equals(null);
      expect(res).to.be.a('object');
      expect(res).to.have.status(500);
      done();
    });
  });

  it('should reject an empty note', function(done) {
    chai.request(server).
    post('/api/notes').
    send({noteBody: ''}).
    end(function(err, res) {
      expect(err).equals(null);
      expect(res).to.be.a('object');
      expect(res).to.have.status(500);
      done();
    });
  });
});
