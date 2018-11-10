const express = require('express')
const crypto = require('crypto')
const cookieParser = require('cookie-parser');
const app = express()
const port = 8080

class User {
  constructor(username, id) {
    this.username = username;
    this.polen = 0;
    this.id = id;
  }

}


class Users {
  constructor(){
    this.users = [];
  }

  addUser(username, id){
    console.log(this.users)
    if(this.isUser(username)){
      return false;
    }

    this.users.push(new User(username, id));
    return true;
  }

  isUser(username){
    for(let i = 0; i < this.users.length; i++){
      if(this.users[i].username === username){
        return true;
      }
    }
    return false;
  }

  getIndexByUsername(username){
    for(let i = 0; i < this.users.length; i++){
      if(this.users[i].username === username){
        return i;
      }
    }
    return -1;
  }

  getIndexById(id){
    for(let i = 0; i < this.users.length; i++){
      if(this.users[i].id === id){
        return i;
      }
    }
    return -1;
  }
}



function checkHash(){
  const hash = crypto.createHash('sha1');

  hash.update('abc');
  console.log("HEllo:", hash.digest('hex'));
}


checkHash();

let users = new Users();


app.use(cookieParser());

app.get('/', (req, res) => {
  if(typeof req.cookies.beeID != "undefined"){
    res.send(200, "Your ID:" + req.cookies.beeID)
  } else {
    res.send(200, "Hi");
  }
})

app.use('/static', express.static('static'))


app.get("/new", (req, res) => {


  if(typeof req.param("username") == 'undefined') {
    return res.send(404, "Provide username")
  }

  let username = req.param("username");

  crypto.randomBytes(48, function(err, buffer) {
    var id = buffer.toString('hex');
    //console.log(token);
    if(users.addUser(username, id)){
      let options = {
        maxAge: 1000 * 60 * 60, // would expire after 15 minutes
        //httpOnly: true, // The cookie only accessible by the web server
        signed: true // Indicates if the cookie should be signed
      }

      res.cookie('beeID', id);


      res.send(200, "Success");
    } else {
      res.send(400, "Username exists");
    }




  });
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))
