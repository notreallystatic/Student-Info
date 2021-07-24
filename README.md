# Student-Info
During the admission time of a student in college, a student need to submit various documents like *Secondary Marksheet, Higher Secondary Marksheet, Domicile Certificate, Birth Certificate, Aadhar Card, etc*. The documents submitted are either original or are a photocopy. The documents are returned after one year and in case a student needs a particular document before that period, then the admin issues that particular document to him/her. Now, there are around 4000 admissions per year in my college and it is really hard for the admin to keep track of all the submitted, pending & issued documents. So, any admin could use this web-app to carry out these tasks without dropping a sweat.
## Features provided:
1. Add a student either by filling a form or importing an excel file.
2. Submit Documents of any student.
3. Issue Documents to a particular Student.
4. Show the list of Students who have pending documents.
5. Delete a student.
6. Further, authentication is also provided so that only an admin can make changes in the DB.<br/>
To build the web-app we have used a theme by "https://startbootstrap.com/", rest of the front-end is build using Bootstrap.
In the backend, we have used Node JS, Express JS, MonogDB.
### Other Resoruces used:
1. To add advanced interaction controls in out HTML tables, we have used DataTables(https://datatables.net/).
2. To upload an excel file, we have used Multer(https://www.npmjs.com/package/multer).
3. We used "xlsx-to-json" to convert an excel file into a JSON object(https://www.npmjs.com/package/xlsx-to-json).
4. And to add authetication in our web-app, we used Passport JS(http://www.passportjs.org/).

### *Contributors*
Himanshu Modi : https://github.com/Himanshu-Modi<br/>
Sachin Kumar : https://github.com/sk92907
