const Profil = require('../Modele/Profil.modele');
var bcrypt = require('bcryptjs');
const zoho = require('@trifoia/zcrmsdk');
const config = require('../Config/zoho.config');
exports.getProfil = (req, res) => {

    Profil.find()
        .then(prof => {

            res.send(prof);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
};

exports.postProfil = (req, res) => {
    // Validate request
    console.log(req.body.nom);
    

    Profil.find()
        .then(prof => {
            var id2;
            if (prof.length == 0) {
                id2 = 0
            }
            else {

                id2 = parseInt(prof[prof.length - 1].id) + 1
            }
            
           
            const prf = new Profil({
                _id: id2,
                nom: req.body.nom || "Untitled Note",
                email: req.body.email,
                password: req.body.password
            }); 
          /*   bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(prf.password, salt, (err, hash) => {
                  if (err) throw err;
                  prf.password = hash; */
                  prf
                    .save()
                    .then(data => {
                        prof.push(prf)
                        
                       res.send(prof)
                    }
                      ).catch(err => console.log(err));
                });
            //   });
            //        })
}

exports.login = (req, res) => {
    const prf = new Profil({
          
        nom: req.body.nom ||req.body.email, 
        password: req.body.password
    }); 
   
    /* const saltRounds = 10;
    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(prf.password, salt); */
    Profil.find( )
        .then(prof => {
            var tab=[]
            for(let i=0;i<prof.length;i++){
                
                
                     if(prof[i].nom==prf.nom || prof[i].email==prf.nom){
                        tab.push(prof[i])   
                    //console.log('tab: ',tab[0].password);
                    /* console.log('hash: ',hash); */
                    
                                  }
                }
          
            //if(bcrypt.compareSync(tab[0].password, hash)){
                if(tab[0].password==prf.password){
                    res.send("ok");
            }
            else{
                res.send("mot de passe ou utilisateur incorrect")
            }
        })
}
exports.send=(req,res)=>{
    var nodemailer = require('nodemailer');
    var xoauth2 = require("xoauth2"),

// Create a SMTP transport object



  transport = nodemailer.createTransport( {
       service:"Gmail",
        host: 'smtp.gmail.com',
        port: 465,
        secure:false,
        auth:
      {user: "rakotonindrinasandiarivelo12@gmail.com",
            pass:"Point2vue"
        }
               
            
        
    });

console.log(transport);

// Message object
var message = {

    // sender info
    from: 'rakotonindrinasandiarivelo12@gmail.com',

    // Comma separated list of recipients
    to: 'jacky.hans22@gmail.com',

    // Subject of the message
    subject: 'Nodemailer is unicode friendly ✔', //

    text: "plaintext alternative",

    // An array of alternatives
    alternatives:[
        {
            contentType: "text/x-web-markdown",
            contents: '**markdown** alternative'
        },
        {
            contentType: "text/html; charset=utf-8",
            contentEncoding: "7bit",
            contents: '<h1>html alternative</h1>'
        }
    ]
};

console.log('Sending Mail');
transport.sendMail(message, function(error){
    if(error){
        console.log('Error occured');
        console.log(error.message);
        return;
    }
    console.log('Message sent successfully!');

    // if you don't want to use this transport object anymore, uncomment following line
    transport.close(); // close the connection pool
});
}



exports.put = (req, res) => {
    // Validate Request
    if (!req.body.prenom) {
        return res.status(400).send({
            message: "Note content can not be empty"
        });
    }

    // Find note and update it with the request body
    Profil.findByIdAndUpdate(req.body._id, {
        nom: req.body.nom || "Untitled Note",
        email: req.body.email
    }, { new: true })
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + req.body._id
                });
            }
            res.send(note);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            return res.status(500).send({
                message: "Error updating note with id " + req.params.noteId
            });
        });
};

exports.deleteProfil = (req, res) => {
    Profil.findByIdAndRemove(req.body._id)
        .then(prof => {
            if (!prof) {
                return res.status(404).send({
                    message: "Note not found with id " + req.body._id
                });
            }
            res.send({ message: "Note deleted successfully!" });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Note not found with id " + req.body._id
                });
            }
            return res.status(500).send({
                message: "Could not delete note with id " + req.body._id
            });
        });
};
exports.findOne = (req, res) => {
    const tab = []
    
    Profil.findById(req.params._id)
        .then(eleve => {
            if (!eleve) {
                return res.status(404).send({
                    message: "Note not found with id " + req.body._id
                });
            }

            Profil.find()
                .then(prof => {
                    tab.push(eleve)
                   


                    res.send(tab)
                }
                )
            })

        .catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.body._id
                });
            }
            return res.status(500).send({
                message: "Error retrieving note with id " + req.body._id
            });
        });
};
exports.crm=(req,res)=>{
    zoho.initialize(config).then((client) => {
        client.API.MODULES.post({
            module: 'Contacts',
            body: {
                // Pay ATTENTION! Data is an array!
                data: [
                  {
                    nom: req.body.nom,
                    email: req.body.email,
                   
                  }
                ],
            },
        }).then(() => {
            const { data } = JSON.parse(response.body);

            res.json({ data });
        });
    });
     
}
exports.crmget=(req,res,next)=>{
    
   

    zoho.initialize(config).then((client) => {
    
            client.API.MODULES.get({
                module: 'Contacts', // Module name
                params: {
                    page:0,
                    per_page:5,
                },
            }).then((response) => {
                console.log(response);
                // const { data } = JSON.parse(response.body);
                res.json(JSON.parse(response.body));
                console.log(reponse);
                
            }).catch(next)
       
    
    }).catch(next);
     
}