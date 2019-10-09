const express			= require('express'),
	  app				= express(),
	  mongoose			= require('mongoose'),
	  bodyParser		= require('body-parser'),
	  Student			= require('./models/student'),
	  Documents			= require('./models/document'),
	  multer			=require('multer'),
	  xlstojson         = require("xls-to-json-lc"),
      xlsxtojson        = require("xlsx-to-json-lc"),
	  path				= require('path');

mongoose.connect('mongodb://localhost:27017/Student-info', {useNewUrlParser: true},function(error) {});

// app.use(express.static(path.join(/partials,"public")));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('./views'));
app.use(express.static(__dirname + "/public"));

    var storage = multer.diskStorage({ //multers disk storage settings
        destination:'./uploads',
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
        }
    });

    var upload = multer({ //multer settings
                    storage: storage,
                    fileFilter : function(req, file, callback) { //file filter
                        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
                            return callback(new Error('Wrong extension type'));
                        }
                        callback(null, true);
                    }
                }).single('file');
// LOGIN ROUTE
app.get('/login', (req, res) => {
	res.render('login');
});

// INDEX ROUTE
app.get('/', (req, res) => {
	res.render('index');
});
app.post('/show', (req, res) => {
	//Fetch the Student ID and show the coresponding details
	let id = req.body.id;
	// Search for this id in the DB and return the Student object
	res.render('show', {student: id});
})

// Add Student Route
app.get('/addStudent', (req, res) => {
	res.render('addStudent');
})

app.get('/students', (req,res) => {
	Student.find({}, (err, docs) =>{
		if(err) {
			cnosole.log(err);
		} else {
			console.log(res.json(docs));
		}
  });
});

// Post route to add a new Student to our DB
app.post('/addStudent', (req, res) => {
	let student = new Student(req.body);
	
	//console.log(req.body.Branch);
	if (req.body.Course === "BTech"){
		student.Branch =req.body.Branch[0];
	}

	else if (req.body.Course === "MTech"){
		student.Branch =req.body.Branch[1];
	}
	else{
			student.Branch = req.body.Branch[2];
	}
	console.log(student);
	student.save();
	res.redirect("/");
});

app.post('/addStudentFile',(req,res)=>{
 var exceltojson;
        upload(req,res,function(err){
            if(err){
			
                 res.json({error_code:1,err_desc:err});
                 return;
            }
            /** Multer gives us file info in req.file object */
            if(!req.file){
                res.json({error_code:1,err_desc:"No file passed"});
                return;
            }
            /** Check the extension of the incoming file and
             *  use the appropriate module
             */
            if(req.file.originalname.split('.')[req.file.originalname.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            try {
                exceltojson({
                    input: req.file.path,
                    output: null, //since we don't need output.json
                    
                }, function(err,result){
                    if(err) {
                      res.redirect("/addStudent");
                    }
                    
                    for(var i = 0; i < result.length; i++) {
                       var obj = result[i];
						var st= new Student(obj);
						st.save();
                        
                      
                        console.log(obj);
                    }


                   res.redirect("/");



                });

            } catch (e){
                res.json({error_code:1,err_desc:"Corupted excel file"});
            }
        })
    });


// Edit Student Route
// This route will give provide a choice to the user for selecting a student by which he want to Edit any student.
// The user can edit any student, either by searching an id or selecting any one from the given list.
app.get('/edit', (req, res) => {
	Student.find({},function(err, data){
		if (err) {
			console.log(err);
		}	else {
			res.render('edit', {students: data});
		}
  	});
});

app.post('/edit', (req, res) => {
	res.redirect('/edit/' + req.body.id);
})

app.get('/edit/:id', (req, res) => {
	const id = req.params.id;
	Student.findOne({"RegnNo": id}, (err, student) => {
		if (err) {
			res.redirect('/');
		} else {
			if (student)
				res.render('editStudent', {student: student});
		}
	});
});

app.post('/edit/:id', (req, res) => {
	const id = req.params.id;
	let student = req.body;
	if (req.body.Course === "BTech"){
		student.Branch =req.body.Branch[0];
		
	}

	else if (req.body.Course === "MTech"){
		student.Branch =req.body.Branch[1];
	}
	else{
			student.Branch = req.body.Branch[2];
	}
	Student.findByIdAndUpdate(id, student ,(err, student) => {
		if (err) {
			res.redirect('/');
		} else {
			res.redirect('/edit');
		}
	});
});
// Submit Document Route
// This route will allow the admin to Submit Documents of a Student, either by searching a Student using his id or by selecting one from the given table.
app.get('/submitDocuments', (req, res) => {
	Student.find({}, (err, data) => {
		if (err) {
			console.log(err);
		}	else {
			res.render('submitDocuments', {students: data});
		}
 	});
});

app.post('/submitDocuments/searchById', (req, res) => {
	res.redirect('/submitDocuments/' + req.body.id);
});

// This route will take the admin to submit the documents of the selected/searched student.
app.get('/submitDocuments/:id', (req, res) => {
	
	let id = req.params.id;
	Documents.findOne({"StudentID": id}, (err, document) => {
		if (err) {
			res.redirect('/');
		} else {
			if(document){
				Student.findOne({"RegnNo": id}, (err, student) => {
					if (err) {
						res.redirect("/submitDocuments");
					} else {
						res.render('submitDocumentsID', {docs: document,id: id, student: student});	
					}
				});
			}
			else{
				Student.findOne({"RegnNo": id}, (err, student) => {
					if (err) {
						res.redirect("/submitDocuments");
					} else {
						let newdocs= new Documents();
						newdocs.StudentID = id;
						newdocs.save();
						res.render('submitDocumentsID', {docs: newdocs, id: id, student: student});	
					}
				});
			}
		}
	});
})

app.post('/submitDocuments/:id', (req, res) => {
//	let document  = new Documents(req.body);
//	console.log(document);
//	document.StudentID = req.params.id;
	let newDocument = req.body;
	newDocument.Status="false";
	let id = req.params.id;
	// To set the value of Status. True if any of the documents has a pending state, else false..
	function walk(obj) {
		for (var key in obj) {
			if (obj.hasOwnProperty(key)) {
				var val = obj[key];
				for(var t in val){
					if (val.hasOwnProperty(t)) {
						var val1 = val[t];
						if (val1=="Pending"){
							newDocument.Status="true";
						}
					}
				}
			}
		}
	}
	walk(newDocument);
	newDocument.StudentID= id;
	//console.log(newDocument);
	
	 if (newDocument.Status=="true"){
		
		Student.findOne({"RegnNo": id}, (err, student) => {
			if (err) {
			} else {
				student.Status = "true";
				Student.findOneAndUpdate({"RegnNo": id},  student, (err, finalStudent) => {
					if (err) {
						console.log(err);
						
					
					} else {
						
					
					}
				});
			}
		});
	}
	
	else{
			Student.findOne({"RegnNo": id}, (err, student) => {
			if (err) {
			} else {
				student.Status = "false";
				Student.findOneAndUpdate({"RegnNo": id},  student, (err, finalStudent) => {
					if (err) {
						console.log(err);
						
					
					} else {
						
					
					}
				});
			}
		});
	}
	Documents.findOneAndUpdate({"StudentID": id}, newDocument ,(err, newDocument) => {
		if(err){
			res.redirect('/submitDocuments');
		}
		else{
			res.redirect('/');
		}
	});
})
// Pending Documents Route
app.get('/pendingDocuments', (req, res) => {
	Student.find({"Status": "true"}, (err, students) => {
		if (err) {
			res.redirect('/');
		} else {
			res.render('pendingDocuments', {students: students});	
		}
	});
})
// Issue Documents Route
app.get('/issueDocuments', (req, res) => {
	Student.find({}, (err, students) => {
		if (err) {
			console.log(err);
		}	else {
			res.render('issueDocuments', {students: students});
		}
 	});
})
// View Documents
app.get('/viewDocuments', (req, res) => {
	Student.find({}, (err, student) => {
		if (err) {
			console.log(err);
		} else {
			res.render('viewDocuments', {students: student});
		}
	})
})
app.get('/viewDocuments/:id', (req, res) => {
	let id = req.params.id;
	Documents.findOne({"StudentID": id}, (err, document) => {
		if (err) {
			res.redirect('/');
		} else {
			if(document){
				Student.findOne({"RegnNo": id}, (err, student) => {
					if (err) {
						res.redirect("/viewDocuments");
					} else {
						res.render('viewDocumentsID', {docs: document,id: id, student: student});	
					}
				});
			}
			else{
				Student.findOne({"RegnNo": id}, (err, student) => {
					if (err) {
						res.redirect("/viewDocuments");
					} else {
						let newdocs= new Documents();
						newdocs.StudentID = id;
						newdocs.save();
						res.render('viewDocumentsID', {docs: newdocs, id: id, student: student});	
					}
				});
			}
		}
	});
})
// Delete Route
app.get('/delete', (req, res) => {
	Student.find({}, function(err, data){
		if (err) {
			console.log(err);
		} else {
			res.render('delete', {students: data});
		}
  	});
})
app.get('/delete/:id', (req, res) => {
	let id = req.params.id;
	Student.remove({"RegnNo" : id},function(err){
		console.log(err);
	});
	Documents.remove({"StudentID" : id},function(err){
		console.log(err);
	});
	res.redirect("/delete");
})


app.listen(3000, () => {	
	console.log('Server is running...');
})