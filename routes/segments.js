var express = require('express');
var router = express.Router();

var Segment = require("../models/Segment");

/* GET list of segments. */
router.get('/', function(req, res) {
	  Segment.find({}).exec(function(err, segments, next) {
	    if (err) {
	      console.log("db error in GET /segments: " + err);
	      next(err);
	    } else {
	      res.render('segments/list', {segments: segments});
	    }
	  });
});

router.get('/json', function(req, res) {
	  Segment.find({}).exec(function(err, segments, next) {
	    if (err) {
	      console.log("db error in GET /segments/json: " + err);
	      next(err);
	    } else {
	      res.json(segments);
	    }
	  });
});


/*Show the new segment form*/
router.get('/new', function(req, res, next) {
	console.log("In the new function");
	var segment = new Segment();
	res.render('segments/new', {segment: segment});
});

/* GET information on a particular segment by id. */
router.get('/:segment_id', function(req, res, next) {
	Segment.findById(req.params.segment_id, function(err, segment) {
	     if (err){
	         res.send(err);
	         console.log(err);
	     }
	    // res.json(segment);
	     res.render('segments/show', { segment: segment});
	});
});

router.get('/:segment_id/json', function(req, res, next) {
	Segment.findById(req.params.segment_id, function(err, segment) {
	     if (err){
	         res.send(err);
	         console.log(err);
	     }
	     res.json(segment);
	});
});

/*Edit information of an existing segment */
router.get('/:id/edit', function(req, res) {
	  Segment.findById(req.params.id).exec(function(err, segment) {
	    if (err) {
	      console.log("db error in GET /segments: " + err);
	      res.render('500');
	    } else if (!segment) {
	      res.render('404');
	    } else {
	      res.render('segments/edit', {segment: segment});
	    }
	  });
});

/* Post a new segment */
router.post('/', function(req, res) {
	Segment.create(req.body, function(err, segment) {
	    if (err) {
	      console.log("db error in POST /segments: " + err);
	      res.render('error');
	    } else {
		      var url = "/segments/";
		      req.flash('success', segment.title + ' was created');
		      res.redirect(url);
	    }
	  });
});

/*Update an existing segment */
router.put('/:id', function(req, res) {
	Segment.findById(req.params.id, function(err, segment) {
	    if (err) {
	      console.log("db find error in PUT /segments/" + req.params.id + ": " + err);
	      res.render('500');
	    } else if (!segment) {
	      res.render('404');
	    } else {
	      // update properties that can be modified. assumes properties are set in request body
	      segment.title = req.body.title;

		      segment.save(function(err) {
			        if (err) {
			          console.log("db save error in PUT /segments/" + req.params.id + ": " + err);
			          res.render('500');
			        } else {
			          var url = '/segments/';
			          req.flash('success', segment.title + ' was updated');
			          res.redirect(url);
			        }
		      });
	    }
	  });
});

/*Delete a particular segment */
router.get('/delete/:id', function(req, res) {
	 console.log("Inside delete" + req.params.id);
	 Segment.findByIdAndRemove(req.params.id, function(err) {
		    if (err) {
		      console.log("db save error in DELETE /segments/" + req.params.id + ": " + err);
		      res.render('500');
		    } else {
		      req.flash('success', 'Segment deleted');
		      res.redirect('/segments');
		    }
	 });
});


module.exports = router;