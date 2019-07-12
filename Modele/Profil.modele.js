const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
// const Schema = mongoose.Schema;
// const ObjectId = Schema.ObjectId;
const ProfilSchema = mongoose.Schema({
  _id:Number,
  nom: String,
  email: String,
  password: String


}, {
  timestamps: true
});


ProfilSchema.methods.generateHash =  function(password){
  return bcrypt.hash(password, bcrypt.genSaltSync(8), null);
}

  module.exports=mongoose.model('Profil',ProfilSchema)