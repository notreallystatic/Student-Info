const express			= require('express'),
	  app				= express(),
	  mongoose			= require('mongoose'),
	  bodyParser		= require('body-parser'),
	  Student			= require('./models/student'),
	  Documents			= require('./models/document');

mongoose.connect('mongodb://localhost:27017/Student-info', {useNewUrlParser: true},function(error) {});

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));
// LOGIN ROUTE
app.get('/login', (req, res) => {
	res.render('login');
});

// INDEX ROUTE
app.get('/', (req, res) => {
	res.render('index');
});

// SHOW ROUTE
app.get('/show', (req, res) => {
	res.render('findStudent');
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

app.get('/students',function(req,res){
	Student.find({},function(err, docs){
		if(err) {
			cnosole.log(err);
		} else {
			console.log(res.json(docs));
		}
  });
});

// Post route to add a new Student to our DB
app.post('/addStudent', (req, res) => {
	let student = new Student();
	student = req.body;
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
	student.save();
	
	res.send("Student post route");
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
app.get('/submitDocument', (req, res) => {
	Student.find({},function(err, data){
		if (err) {
			console.log(err);
		}	else {
			res.render('submitDocument', {students: data});
		}
 	});
});

app.post('/submitDocument/searchById', (req, res) => {
	res.redirect('/submitDocument/' + req.body.id);
})

// This route will take the admin to submit the documents of the selected/searched student.
app.get('/submitDocument/:id', (req, res) => {
	res.render('submitDocumentID', {id: req.params.id});
})
app.post('/submitDocument/:id', (req, res) => {
	res.redirect('/');
})


app.listen(3000, () => {	
	console.log('Server is running...');
})