const multer = require('multer');
const uuid = require('uuid').v4

const upload = multer({
  storage: multer.diskStorage({
    destination: 'public/images',
    filename: (req, file, cb)=> {
      cb(null, uuid() + '-' + file.originalname);
    }
  })
});

const configuredMulter = upload.single('residenceImage');

module.exports = configuredMulter;