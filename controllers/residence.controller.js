const Residence = require("../models/Residence");

async function getResidences(req, res){
  const residences = await Residence.find();

  res.render('residences', {residences: residences });
};

// to insert new residence in the database

async function newResidence(req, res){
  const residenceImage = req.file;

  const residence = {
    title: req.body.title,
    description: req.body.description,
    rooms: req.body.rooms,
    roomsType: req.body.roomsType,
    gender: req.body.gender,
    imagePath: residenceImage.path,
  }

  const newResidence = new Residence(residence);

  try {
    await newResidence.save();
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};



module.exports = {
  getResidences: getResidences,
  newResidence: newResidence
}; 