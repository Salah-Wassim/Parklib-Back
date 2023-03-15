const Picture = require("../models").Picture;
const Post = require("../models").Post;
const HttpStatus = require('../utils/httpStatus.util.js');
const formidable = require("formidable");
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require("../utils/logger.util.js");
const Response = require('../utils/response.util.js');

exports.uploadPicture = (req, res) => {
  // Create a new IncomingForm object to parse the incoming form data
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(
          new Response(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            HttpStatus.INTERNAL_SERVER_ERROR.message,
            `Some error occurred while uploading picture.`,
            err
          )
        );
    }

    // Get the value of postid from the form data
    const postid = fields.postid;

    // Check if postid is a valid integer
    if (!Number.isInteger(Number(postid))) {
      return res.status(HttpStatus.BAD_REQUEST.code)
        .send(
          new Response(
            HttpStatus.BAD_REQUEST.code,
            HttpStatus.BAD_REQUEST.message,
            `postid must be a valid integer`
          )
        );
    }
    
    // Check if the corresponding post exists in the database
    Post.findByPk(postid)
      .then(post => {
        if (!post) {
          return res.status(HttpStatus.BAD_REQUEST.code)
            .send(
              new Response(
                HttpStatus.BAD_REQUEST.code,
                HttpStatus.BAD_REQUEST.message,
                `postid does not correspond to an existing post`
              )
            );
        }

        // Check if the postid already has 3 pictures
        Picture.count({
          where: {
            postid: postid
          }
        })
          .then(count => {
            if (count >= 3) {
              return res.status(HttpStatus.BAD_REQUEST.code)
                .send(
                  new Response(
                    HttpStatus.BAD_REQUEST.code,
                    HttpStatus.BAD_REQUEST.message,
                    `There are already 3 pictures for this postid`
                  )
                );
            }

            // Set the new path for the uploaded file
            const ext = path.extname(files.url.originalFilename);
            const destinationFolder = path.join(__dirname, '../public/post_picture/');
            const newpath = path.join(destinationFolder, `${uuidv4()}${ext}`);

            // Rename the uploaded file and move it to the public/post_picture folder
            fs.rename(files.url.filepath, newpath, function (err) {
              if (err) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                  .send(
                    new Response(
                      HttpStatus.INTERNAL_SERVER_ERROR.code,
                      HttpStatus.INTERNAL_SERVER_ERROR.message,
                      `Some error occurred while moving picture to public folder.`,
                      err
                    )
                  );
              }

              Picture.create({
                url: path.relative(destinationFolder, newpath),
                postid: postid
              })
                .then(data => {
                  const picture = {
                    url: data.url
                  };
                  res.status(HttpStatus.CREATED.code)
                    .send(
                      new Response(
                        HttpStatus.CREATED.code,
                        HttpStatus.CREATED.message,
                        'Picture created',
                        picture
                      )
                    );
                });
            });
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
          .send(
            new Response(
            HttpStatus.NOT_FOUND.code,
            HttpStatus.NOT_FOUND.message,
            `Picture with ID ${pictureId} not found.`
            )
          );
      }
      
      res.status(HttpStatus.OK.code)
        .send(
          new Response(
          HttpStatus.OK.code,
          HttpStatus.OK.message,
          'Picture retrieved',
          picture 
          )
        );
    })
    .catch(error => {
      logger.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
         .send(
          new Response(
          HttpStatus.INTERNAL_SERVER_ERROR.code,
          HttpStatus.INTERNAL_SERVER_ERROR.message,
          `Some error occurred while retrieving picture.`,
          err
         )
      );
    });
};


exports.updatePicture = (req, res) => {
  const { id } = req.params;
  const form = formidable({ multiples: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(
          new Response(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            HttpStatus.INTERNAL_SERVER_ERROR.message,
            `Some error occurred while uploading picture.`,
            err
          )
        );
    }

    // Check if the picture exists in the database
    Picture.findByPk(id)
      .then(picture => {
        if (!picture) {
          return res.status(HttpStatus.BAD_REQUEST.code)
            .send(
              new Response(
                HttpStatus.BAD_REQUEST.code,
                HttpStatus.BAD_REQUEST.message,
                `Picture not found`
              )
            );
        }

        // Check if postid is a valid integer
        const postid = fields.postid;
        if (postid && !Number.isInteger(Number(postid))) {
          return res.status(HttpStatus.BAD_REQUEST.code)
            .send(
              new Response(
                HttpStatus.BAD_REQUEST.code,
                HttpStatus.BAD_REQUEST.message,
                `postid must be a valid integer`
              )
            );
        }

        // Move the uploaded file to the public/post_picture folder if a new file was uploaded
        if (files.url) {
          const ext = path.extname(files.url.originalFilename);
          const destinationFolder = path.join(__dirname, '../public/post_picture/');
          const newpath = path.join(destinationFolder, `${uuidv4()}${ext}`);
          const oldpath = path.join(destinationFolder, picture.url);

          fs.unlink(oldpath, function (err) {
            if (err && err.code !== 'ENOENT') {
              return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
                new Response(
                  HttpStatus.INTERNAL_SERVER_ERROR.code,
                  HttpStatus.INTERNAL_SERVER_ERROR.message,
                  `Error occurred while deleting old picture`,
                  err
                )
              );
            }
          });

          fs.rename(files.url.filepath, newpath, function (err) {
            if (err) {
              return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                .send(
                  new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.code,
                    HttpStatus.INTERNAL_SERVER_ERROR.message,
                    `Some error occurred while moving picture to public folder.`,
                    err
                  )
                );
            }

            Picture.update({
              url: path.relative(destinationFolder, newpath),
              postid: postid
            }, {
              where: { id: picture.id }
            })
            
              .then(data => {
                const updatedPicture = {
                  url: data.url
                };
                res.status(HttpStatus.OK.code)
                  .send(
                    new Response(
                      HttpStatus.OK.code,
                      HttpStatus.OK.message,
                      'Picture updated',
                      updatedPicture
                    )
                  );
              });
          });
        } else {
          // Update the picture in the database without moving the file
          Picture.update({
            postid: postid
          })
            .then(data => {
              const updatedPicture = {
                url: data.url
              };
              res.status(HttpStatus.OK.code)
                .send(
                  new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.message,
                    'Picture updated',
                    updatedPicture
                  )
                );
            });
        }
      });
  });
};

exports.deletePicture = (req, res) => {
  Picture.findByPk(req.params.id)
    .then(picture => {
      if (!picture) {
        return res.status(HttpStatus.NOT_FOUND.code)
                  .send(
                    new Response(
                    HttpStatus.NOT_FOUND.code,
                    HttpStatus.NOT_FOUND.message,
                    `Picture with id ${req.params.id} not found.`
                  )
                );
      }

      // Set the path to the image to be deleted
      const imagePath = path.join(__dirname, '../public/post_picture/', picture.url);

      // Remove the image file
      fs.unlink(imagePath, (err) => {
        if (err) {
          logger.error(`Error while deleting image file for picture with id ${req.params.id}: ${err.message}`);
          res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
             .send(
              new Response(
              HttpStatus.INTERNAL_SERVER_ERROR.code,
              HttpStatus.INTERNAL_SERVER_ERROR.message,
              `Some error occurred while deleting picture with id ${req.params.id}.`,
              err
              )
            );
        } else {
          // If image file deletion is successful, delete the Picture object from the database
          picture.destroy()
            .then(() => {
              res
                .status(HttpStatus.NO_CONTENT.code)
                .json({ message: `Picture with id ${req.params.id} has been deleted.` });
            })
            .catch(err => {
              logger.error(`Error while deleting picture with id ${req.params.id}: ${err.message}`);
              res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                 .send(
                  new Response(
                  HttpStatus.INTERNAL_SERVER_ERROR.code,
                  HttpStatus.INTERNAL_SERVER_ERROR.message,
                  `Some error occurred while deleting picture with id ${req.params.id}.`,
                  err
                  )
                );
            });
        }
      });
    })
    .catch(err => {
      logger.error(`Error while finding picture with id ${req.params.id}: ${err.message}`);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
         .send(
          new Response(
          HttpStatus.INTERNAL_SERVER_ERROR.code,
          HttpStatus.INTERNAL_SERVER_ERROR.message,
          `Some error occurred while finding picture with id ${req.params.id}.`,
          err
          )
        );
    });
};

