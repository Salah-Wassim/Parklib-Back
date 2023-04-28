const User = require("../models").User;
const HttpStatus = require('../utils/httpStatus.util.js');
const formidable = require("formidable");
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require("../utils/logger.util.js");
const Response = require('../utils/response.util.js');

exports.updateProfilePicture = (req, res) => {
  const { id } = req.params;
  const form = formidable({ multiples: true });

  logger.info(`Updating the profile picture for the user ${id}`);

  form.parse(req, (err, fields, files) => {
    if (err) {
      logger.error(`Error while downloading the image : ${err}`);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(
          new Response(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            HttpStatus.INTERNAL_SERVER_ERROR.message,
            `An error occurred while downloading the image.`,
            err
          )
        );
    }

    // Check if the user exists in the database
    User.findByPk(id)
      .then(user => {
        if (!user) {
          logger.warn(`User not found for ID ${id}`);
          return res.status(HttpStatus.BAD_REQUEST.code)
            .send(
              new Response(
                HttpStatus.BAD_REQUEST.code,
                HttpStatus.BAD_REQUEST.message,
                `User not found`
              )
            );
        }

        // Move the downloaded file to the public/profile_picture folder if there is a new file
        if (files.picture) {
          const ext = path.extname(files.picture.originalFilename);
          const destinationFolder = path.join(__dirname, '../public/profile_picture/');
          const newpath = path.join(destinationFolder, `${uuidv4()}${ext}`);

          if (user.picture) {
            const oldpath = path.join(destinationFolder, user.picture);

            fs.unlink(oldpath, function (err) {
              if (err && err.code !== 'ENOENT') {
                logger.error(`Error when deleting the old image : ${err}`);
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
                  new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.code,
                    HttpStatus.INTERNAL_SERVER_ERROR.message,
                    `Error when deleting the old image`,
                    err
                  )
                );
              }
            });
          }

          fs.rename(files.picture.filepath, newpath, function (err) {
            if (err) {
              logger.error(`Error when moving the image to the public folder : ${err}`);
              return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                .send(
                  new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.code,
                    HttpStatus.INTERNAL_SERVER_ERROR.message,
                    `An error occurred when moving the image to the public folder.`,
                    err
                  )
                );
            }

            User.update({
              picture: path.relative(destinationFolder, newpath)
            }, {
              where: { id: user.id }
            })
              .then(data => {
                const updatedUser = {
                  picture: data.picture
                };
                logger.info(`Updated image for the user ${id}`);
                res.status(HttpStatus.OK.code)
                  .send(
                    new Response(
                      HttpStatus.OK.code,
                      HttpStatus.OK.message,
                      'Updated image',
                      updatedUser
                    )
                  );
              });
          });
        } else {
          // Update the image in the database without moving the file
          logger.info(`No image to update for the user ${id}`);
          res.status(HttpStatus.OK.code)
            .send(
              new Response(
                HttpStatus.OK.code,
                HttpStatus.OK.message,
                'No images to update'
              )
            );
        }
      });
  });
};


exports.getProfilePicture = (req, res) => {
  const { id } = req.params;

  logger.info(`Retrieving the profile picture for the user ${id}`);

  User.findByPk(id)
    .then(user => {
      if (!user) {
        logger.warn(`User not found for ID ${id}`);
        return res.status(HttpStatus.BAD_REQUEST.code)
          .send(
            new Response(
              HttpStatus.BAD_REQUEST.code,
              HttpStatus.BAD_REQUEST.message,
              `User not found`
            )
          );
      }

      if (!user.picture) {
        logger.warn(`No profile picture for the user ${id}`);
        return res.status(HttpStatus.NOT_FOUND.code)
          .send(
            new Response(
              HttpStatus.NOT_FOUND.code,
              HttpStatus.NOT_FOUND.message,
              `No profile picture for this user`
            )
          );
      }

      res.status(HttpStatus.OK.code)
        .send(
          new Response(
            HttpStatus.OK.code,
            HttpStatus.OK.message,
            'Profile picture retrieved',
            { imageName: user.picture }
          )
        );
    })
    .catch(err => {
      logger.error(`An error occurred while retrieving the profile image: ${err}`);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(
          new Response(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            HttpStatus.INTERNAL_SERVER_ERROR.message,
            `An error occurred while retrieving the profile image.`,
            err
          )
        );
    });
};


exports.deleteProfilePicture = (req, res) => {
  const { id } = req.params;

  logger.info(`Removing the profile picture for the user ${id}`);

  User.findByPk(id)
    .then(user => {
      if (!user) {
        logger.warn(`User not found for ID ${id}`);
        return res.status(HttpStatus.BAD_REQUEST.code)
          .send(
            new Response(
              HttpStatus.BAD_REQUEST.code,
              HttpStatus.BAD_REQUEST.message,
              `Utilisateur non trouvé`
            )
          );
      }

      if (!user.picture) {
        logger.warn(`No profile picture for the user to delete ${id}`);
        return res.status(HttpStatus.NOT_FOUND.code)
          .send(
            new Response(
              HttpStatus.NOT_FOUND.code,
              HttpStatus.NOT_FOUND.message,
              `No profile picture to delete for this user`
            )
          );
      }

      const destinationFolder = path.join(__dirname, '../public/profile_picture/');
      const imagePath = path.join(destinationFolder, user.picture);

      fs.unlink(imagePath, function (err) {
        if (err && err.code !== 'ENOENT') {
          logger.error(`Error when deleting the profile picture : ${err}`);
          return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
            new Response(
              HttpStatus.INTERNAL_SERVER_ERROR.code,
              HttpStatus.INTERNAL_SERVER_ERROR.message,
              `Error when deleting the profile picture`,
              err
            )
          );
        }

        User.update({
          picture: null
        }, {
          where: { id: user.id }
        })
          .then(() => {
            logger.info(`Profile image successfully deleted for the user ${id}`);
            res.status(HttpStatus.OK.code)
              .send(
                new Response(
                  HttpStatus.OK.code,
                  HttpStatus.OK.message,
                  'Profile image successfully deleted'
                )
              );
          });
      });
    })
    .catch(err => {
      logger.error(`An error occurred while deleting the profile picture: ${err}`);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
        .send(
          new Response(
            HttpStatus.INTERNAL_SERVER_ERROR.code,
            HttpStatus.INTERNAL_SERVER_ERROR.message,
            `An error occurred while deleting the profile picture.`,
            err
          )
        );
    });
};






  



