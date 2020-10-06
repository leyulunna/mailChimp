const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require("request");
const https= require("https");
const { url } = require("inspector");
const port = 3000;

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.post("/", function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    const data = {
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url =  "https://us2.api.mailchimp.com/3.0/lists/9604759901";
    const options = {
        method: "POST",
        auth: "lena1732:0a17f4e95646a7337462bc85e99c1fa2-us2"
    }

    const request = https.request(url, options, function(response) {
        response.on("data", function(data){
            console.log("========================")
            console.log(JSON.parse(data))
            console.log("========================")
            const statusCode = Number(response.statusCode);
            if(statusCode === 200){
                res.sendFile(__dirname+"/success.html");
            }else{
                res.sendFile(__dirname+"/failure.html");
            }

        })
    })

    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("server is running on 3000");
});

// API Key
// 0a17f4e95646a7337462bc85e99c1fa2-us2
