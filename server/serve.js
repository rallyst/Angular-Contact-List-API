const fs = require("fs");
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors')
const path = require('path');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/users', (req, res) => {
    let {search, quantity, page, sort } = req.query;
    let users = JSON.parse(fs.readFileSync('users.json'));
    const length = users.length;
    users = users.filter(user => {
        if(user.name.indexOf(search)!=-1) {
            return true;
        }
        for (let i=0;i < user.phoneNumbers.length; i++){
            if(user.phoneNumbers[i].indexOf(search)!=-1) {
                return true;
            }
        }
        return false;
    })
    if(sort) {
        users = users.sort((a, b) => (sort=='desc' ? sortName(a,b) : sortName(b,a)));
    }
    users = users.splice((page -1 ) * quantity, quantity);
    res.send({users, length})
})

app.get('/userbyid/:uid', (req, res) => {
    let users = JSON.parse(fs.readFileSync('users.json'));
    res.send(users.find(user => user.id == req.params.uid));
})


app.put('/updateuser/:uid', (req, res) => {
    let users = JSON.parse(fs.readFileSync('users.json'));
    users = users.map(user => {
        if(user.id == req.params.uid){
            user.name = req.body.name;
            user.phoneNumbers = req.body.phoneNumbers;
        }
        return user;
    });
    fs.writeFile('users.json', JSON.stringify(users),()=>{
        res.send('User updated successfully')
    });
})

app.post('/adduser', (req, res) => {
    let users = JSON.parse(fs.readFileSync('users.json'));
    users.push({
        id: new Date().getTime().toString(),
        name: req.body.name,
        phoneNumbers: req.body.phoneNumbers
    })
    fs.writeFile('users.json', JSON.stringify(users),()=>{
        res.send('User added successfully')
    });
})

app.delete('/deleteuser/:uid', (req, res) => {
    let users = JSON.parse(fs.readFileSync('users.json'));
    users = users.filter(user => user.id != req.params.uid);
    fs.writeFile('users.json', JSON.stringify(users),()=>{
        res.send('User deleted successfully')
    });
})


app.listen('8000', () => {
    console.log(`Example app listening on port 8000`)
})

function sortName(a, b) {
    var nameA = a.name.toUpperCase();
    var nameB = b.name.toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
}
