const Picture = require("../models").Picture;
const Post = require("../models").Post;
const HttpStatus = require('../utils/httpStatus.util.js');
const formidable = require("formidable");
const logger = require("../utils/logger.util.js");
const Response = require('../utils/response.util.js');

exports.uploadPicture = (req, res) => {
  // Create a new IncomingForm object to parse the incoming form data
  let form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message,`Some error occurred while uploading picture.`, err));
    }

    // Get the value of postid from the form data
    const postid = fields.postid;

    // Check if postid is a valid integer
    if (!Number.isInteger(Number(postid))) {
      return res.status(HttpStatus.BAD_REQUEST.code)
                .send(new Response(HttpStatus.BAD_REQUEST.code,HttpStatus.BAD_REQUEST.message,`postid must be a valid integer` ));
    }

    // Check if the corresponding post exists in the database
    Post.findByPk(postid)
      .then(post => {
        if (!post) {
          return res.status(HttpStatus.BAD_REQUEST.code)
                    .send(new Response(HttpStatus.BAD_REQUEST.code,HttpStatus.BAD_REQUEST.message,`postid does not correspond to an existing post` ));
        }

        // If postid is valid and corresponds to an existing post,
        // create a new Picture object and save it to the database
        Picture.create({
          url: files.url.filepath,
          postid: postid
        })
          .then(data => {
            const picture = {
              url: data.url
            };
            res.status(HttpStatus.CREATED.code)
               .send(new Response(HttpStatus.CREATED.code,HttpStatus.CREATED.message,'Picture created',{ picture }));
          });
      });
  });
};




exports.getPicture = (req, res) => {
  const pictureId = req.params.id;

  Picture.findByPk(pictureId, { include: Post })
    .then(picture => {
      if (!picture) {
        return res
          .status(HttpStatus.NOT_FOUND.code)
          .send(new Response(HttpStatus.NOT_FOUND.code,HttpStatus.NOT_FOUND.message, `Picture with ID ${pictureId} not found.`));
      }
      
      res.status(HttpStatus.OK.code)
        .send(new Response(HttpStatus.OK.code,HttpStatus.OK.message,'Picture retrieved',{ picture }));
    })
    .catch(error => {
      logger.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
         .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message,`Some error occurred while retrieving picture.`, err));
    });
};


exports.updatePicture = (req, res) => {
  let form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message,`Some error occurred while updating picture.`, err));
        
    }

    // Check if the image exists in the database
    Picture.findByPk(req.params.id)
      .then(picture => {
        if (!picture) {
          return res.status(HttpStatus.NOT_FOUND.code)
                    .send(new Response(HttpStatus.NOT_FOUND.code,HttpStatus.NOT_FOUND.message, `Picture with id ${req.params.id} not found.`));
        }

        // Mettre à jour l'image avec les nouvelles valeurs
        picture.update({ url: files.url.filepath })
          .then(data => {
            const updatedPicture = {
              id: data.id,
              url: data.url
            };
            res.status(HttpStatus.OK.code)
               .send(new Response(HttpStatus.OK.code,HttpStatus.OK.message,'Picture updated',{ updatedPicture }));
          })
          .catch(err => {
            logger.error(`Error while updating picture with id ${req.params.id}: ${err.message}`);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
               .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message,`Some error occurred while updating picture with id ${req.params.id}.`, err));
          });
      })
      .catch(err => {
        logger.error(`Error while finding picture with id ${req.params.id}: ${err.message}`);
        res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
           .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message,`Some error occurred while finding picture with id ${req.params.id}.`, err));
      });
  });
};

exports.deletePicture = (req, res) => {
  Picture.findByPk(req.params.id)
    .then(picture => {
      if (!picture) {
        return res.status(HttpStatus.NOT_FOUND.code)
                  .send(new Response(HttpStatus.NOT_FOUND.code,HttpStatus.NOT_FOUND.message, `Picture with id ${req.params.id} not found.`));
      }

      picture.destroy()
        .then(() => {
          res
            .status(HttpStatus.NO_CONTENT.code)
            .send();
        })
        .catch(err => {
          logger.error(`Error while deleting picture with id ${req.params.id}: ${err.message}`);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
             .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message,`Some error occurred while deleting picture with id ${req.params.id}.`, err));
        });
    })
    .catch(err => {
      logger.error(`Error while finding picture with id ${req.params.id}: ${err.message}`);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
         .send(new Response(HttpStatus.INTERNAL_SERVER_ERROR.code,HttpStatus.INTERNAL_SERVER_ERROR.message,`Some error occurred while finding picture with id ${req.params.id}.`, err));
    });
};

