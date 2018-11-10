const express = require('express')
const crypto = require('crypto')
const cookieParser = require('cookie-parser');
const app = express()
const port = 8080

const SECRET="69696969";


class User {
  constructor(username, id) {
    this.username = username;
    this.polen = 0;
    this.id = id;
  }

  addPolen(polen){
    this.polen += polen
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

  isUserID(id){
    for(let i = 0; i < this.users.length; i++){
      if(this.users[i].id === id){
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
  addPolen(id, polen){
    this.users[this.getIndexById(id)].addPolen(polen);
  }
}

class Flower{
  constructor(id){
    this.id = id;
    this.usedCounts = [];
  }
  checkCount(count){
    for(let i = 0; i < this.usedCounts.length; i++){
      if(this.usedCounts[i] == count){
        return false;
      }
    }
    return true;
  }
  appendCount(count){
    this.usedCounts.push(count)
  }
}

class Flowers{
  constructor(n){
    this.flowers = []
    for(let i = 0; i < n ; i++){
      this.addFlower(i);
    }
  }
  addFlower(id){
    this.flowers.push(new Flower(id))
  }

  checkFlower(id, count){
    if(id < this.flowers.length && this.flowers[id].checkCount(count)){
      this.flowers[id].appendCount(count)
      return true;
    } else {
      return false;
    }
  }



}

function checkHash(token){
  const hash = crypto.createHash('sha1');
  let things = token.split(',');
  let text = things[0] + "," + things[1] + "," + things[2] + "," + SECRET;
  hash.update(text);
  return (hash.digest('hex') === things[3]);
}


//checkHash();

let users = new Users();
let flowers = new Flowers(3);


app.use(cookieParser());

app.use('/static', express.static('static'))

app.get('/deposit', (req, res) => {

  if(typeof req.cookies.beeID === "undefined" || !users.isUserID(req.cookies.beeID)) {
    res.redirect(302, '/new');
  } else {
    //console.log(req.query.token)
    if(typeof req.query.token === "undefined" ||  req.query.token.split(",").length != 4){
      res.send(404, "No token");
    } else if(checkHash(req.query.token)){ // Authenticate
      let things = req.query.token.split(",");
      let id = parseInt(things[0])
      let count = parseInt(things[1])
      let polen = parseInt(things[2])

      //console.log(id, count, polen);

      if(flowers.checkFlower(id, count)){
        users.addPolen(req.cookies.beeID, polen);
        res.send(200, "Token submitted")
      } else {
        res.send(404, "Token reused")
      }
    } else {
      res.send(404, "Wrong hash")
    }

  }
})


app.get("/new", (req, res)=>{

  res.send("Create new account!");
})

app.get("/newUser", (req, res) => {


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

app.get("/stats",(req, res)=>{
  let resData = [];
  for(let user in users.users){
    resData.push({"username":users.users[user].username, "polen":users.users[user].polen})
  }

  res.json(200, resData)
})

app.get("/clear", (req, res) => {
  res.clearCookie("beeID")
  res.send("Cleard ID");
  res.end();
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
