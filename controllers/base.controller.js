function getIndex(req, res){
  res.render('index');
};

function getAbout(req, res){
  res.render('shared/about');
};

function getError(req, res){
  res.render('shared/500');
};





module.exports = {
  getIndex,
  getAbout,
  getError
};