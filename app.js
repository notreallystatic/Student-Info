const express	 =	 require('express'),
	  app        =	 express(),
	  mongoose	 = 	 require('mongoose'),
	  bodyParser =   require('body-parser'),
	  Student 	 =	 require('./models/student'),
	  Document   =   require('./models/document');

mongoose.connect('mongodb://localhost:27017/Student-info', {useNewUrlParser: true},function(error) {});


app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

// LOGIN ROUTE
app.get('/login', (req, res) => {
	res.render('login');
})

// INDEX ROUTE
app.get('/', (req, res) => {
	res.render('index');
})

// SHOW ROUTE
app.get('/show', (req, res) => {
	res.render('findStudent');
})

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
// Post route to add a new Student to our DB
app.post('/addStudent', (req, res) => {
 console.log(req.body);
	let student = new Student();
	student.RegnNo=req.body.RegnNo;
	student.AadhaarNo=req.body.AadhaarNo;
	student.Name=req.body.Name;
	student.Fname=req.body.Fname;
	student.AdmissionYear=req.body.AdmissionYear;
	student.Gender=req.body.Gender;
	student.Course=req.body.Course;
	student.AllotmentCategory=req.body.AllotmentCategory;
	student.AdmissionMode=req.body.AdmissionMode;
	student.Contact1=req.body.Contact1;
	student.Contact2=req.body.Contact2;
	student.Email=req.body.Email;
	console.log(req.body.Branch);
	
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
})


// Edit Student Route
app.get('/edit', (req, res) => {
	
	Student.findOne({"RegnNo": "121"}, (err, student) => {
		if (err) {
			res.redirect('/');
		} else {
			res.render('edit', {student: student});	
		}
	});
});


// Submit Document Route
// This route will allow the admin to Submit Documents of a Student, either by searching a Student using his id or by selecting one from the given table.
app.get('/submitDocument', (req, res) => {
	res.render('submitDocument');
})

app.post('/submitDocument', (req, res) => {
	console.log(req.body);
	res.render('submitDocuments');
})

// This route will take the admin to submit the documents of the selected/searched student.
app.get('/submitDocument/:id', (req, res) => {
	res.render('submitDocumentID');
})

app.listen(3000, () => {	
	console.log('Server is running...');
})