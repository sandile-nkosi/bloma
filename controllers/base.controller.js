function getIndex(req, res){
  res.render('index');
};

function getResidences(req, res){
  res.render('residences');
};

function getAbout(req, res){
  res.render('about');
};






module.exports = {
  getIndex: getIndex,
  getResidences: getResidences,
  getAbout: getAbout
};