var express = require('express');
var router = express.Router();

var Company = require("../models/Company");

/* GET list of companies. */
router.get('/', function(req, res) {
	  Company.find({}).exec(function(err, companies, next) {
	    if (err) {
	      console.log("db error in GET /companies: " + err);
	      next(err);
	    } else {
	      res.render('companies/list', {companies: companies});
	    }
	  });
});


/*Show the new company form*/
router.get('/new', function(req, res, next) {
	console.log("In the new function");
	var company = new Company();
	res.render('companies/new', {company: company});
});

/* GET information on a particular company by id. */
router.get('/:company_id', function(req, res, next) {
	Company.findById(req.params.company_id, function(err, company) {
	     if (err){
	         res.send(err);
	         console.log(err);
	     }
	    // res.json(company);
	     res.render('companies/show', { company: company});
	});
});


/*Edit information of an existing company */
router.get('/:id/edit', function(req, res) {
	  Company.findById(req.params.id).exec(function(err, company) {
	    if (err) {
	      console.log("db error in GET /companies: " + err);
	      res.render('500');
	    } else if (!company) {
	      res.render('404');
	    } else {
	      res.render('companies/edit', {company: company});
	    }
	  });
});

/* Post a new company */
router.post('/', function(req, res) {
	Company.create(req.body, function(err, company) {
	    if (err) {
	      console.log("db error in POST /companies: " + err);
	      res.render('error');
	    } else {
		      var url = "/companies/";
		      req.flash('success', company.title + ' was created');
		      res.redirect(url);
	    }
	  });
});

/*Update an existing company */
router.put('/:id', function(req, res) {
	Company.findById(req.params.id, function(err, company) {
	    if (err) {
	      console.log("db find error in PUT /companies/" + req.params.id + ": " + err);
	      res.render('500');
	    } else if (!company) {
	      res.render('404');
	    } else {
	      // update properties that can be modified. assumes properties are set in request body
	      company.title = req.body.title;
	      company.description = req.body.description;

		      company.save(function(err) {
			        if (err) {
			          console.log("db save error in PUT /companies/" + req.params.id + ": " + err);
			          res.render('500');
			        } else {
			          var url = '/companies/';
			          req.flash('success', company.title + ' was updated');
			          res.redirect(url);
			        }
		      });
	    }
	  });
});

/*Delete a particular company */
router.get('/delete/:id', function(req, res) {
	 console.log("Inside delete" + req.params.id);
	 Company.findByIdAndRemove(req.params.id, function(err) {
		    if (err) {
		      console.log("db save error in DELETE /companies/" + req.params.id + ": " + err);
		      res.render('500');
		    } else {
		      req.flash('success', 'Company deleted');
		      res.redirect('/companies');
		    }
	 });
});






module.exports = router;