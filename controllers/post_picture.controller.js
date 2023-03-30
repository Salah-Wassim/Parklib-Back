const Picture = require("../models").Picture;
const Post = require("../models").Post;
const HttpStatus = require("../utils/httpStatus.util.js");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const logger = require("../utils/logger.util.js");
const Response = require("../utils/response.util.js");

// exports.uploadPostPicture = (req, res) => {
//   logger.info("Uploading post picture");
//   // Create a new IncomingForm object to parse the incoming form data
//   const form = formidable({ multiples: true });
//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       logger.error(`Error occurred while uploading picture: ${err}`);
//       return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
//         .send(
//           new Response(
//             HttpStatus.INTERNAL_SERVER_ERROR.code,
//             HttpStatus.INTERNAL_SERVER_ERROR.message,
//             `Some error occurred while uploading picture.`,
//             err
//           )
//         );
//     }
//     // Get the value of postid from the form data
//     const postid = parseInt(fields.postid);
//     // Check if postid is a valid integer
//     if (!Number.isSafeInteger(postid)) {
//       logger.warn(`Invalid postid: ${postid}`);
//       return res.status(HttpStatus.BAD_REQUEST.code)
//         .send(
//           new Response(
//             HttpStatus.BAD_REQUEST.code,
//             HttpStatus.BAD_REQUEST.message,
//             `postid must be a valid integer`
//           )
//         );
//     }
//     // Check if the corresponding post exists in the database
//     await Post.findByPk(postid)
//       .then(async post => {
//         if (!post) {
//           logger.warn(`Post not found with postid: ${postid}`);
//           return res.status(HttpStatus.BAD_REQUEST.code)
//             .send(
//               new Response(
//                 HttpStatus.BAD_REQUEST.code,
//                 HttpStatus.BAD_REQUEST.message,
//                 `postid does not correspond to an existing post`
//               )
//             );
//         }
//         // upload ALL files sended
//         const datas = [];
//         const urls = files.url;
//         const results = await Promise.all(urls.map(async (element) => {
//         const ext = path.extname(element.originalFilename);
//         const destinationFolder = path.join(__dirname, '../public/post_picture/');
//         const newpath = path.join(destinationFolder, `${uuidv4()}${ext}`);

//         // Rename the uploaded file and move it to the public/post_picture folder
//         fs.rename(element.filepath, newpath, async function (err) {
//           if (err) {
//             logger.error(`Error occurred while moving picture to public folder: ${err}`);
//             return res.status(HttpStatus.INTERNAL_SERVER_ERROR.code)
//               .send(
//                 new Response(
//                   HttpStatus.INTERNAL_SERVER_ERROR.code,
//                   HttpStatus.INTERNAL_SERVER_ERROR.message,
//                   `Some error occurred while moving picture to public folder.`,
//                   err
//                 )
//               );
//           }
//           else {
//             logger.info("Picture moved to public folder");
//             const createResp = await Picture.create({
//               url: path.relative(destinationFolder, newpath),
//               postid: postid
//             })
//               .then(data => {
//                 // console.log(data) // OK : display Picture datas
//                 let len = datas.push(data);
//                 logger.info("Picture " + len + " created");
//                 console.log(data)
//                 resolve(data);
//               })
//               .catch(error => {
//                 console.log(error);
//                 // reject(error);
//               });
//           }
//         });
//       }));

//         console.log(results) // NOT OK : return array of 'null' , good length
//         res.status(HttpStatus.CREATED.code)
//             .send(
//               new Response(
//                 HttpStatus.CREATED.code,
//                 HttpStatus.CREATED.message,
//                 'Picture(s) created',
//                 results
//               )
//             );
//       })
//   });
// };

exports.getPostPicture = (req, res) => {
    const pictureId = req.params.id;

    logger.info(`Retrieving the post picture with ID ${pictureId}`);

    Picture.findByPk(pictureId, { include: Post })
        .then((picture) => {
            if (!picture) {
                logger.warn(`Picture not found with ID ${pictureId}`);
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
            logger.info(`Picture with ID ${pictureId} retrieved successfully`);
            res.status(HttpStatus.OK.code).send(
                new Response(
                    HttpStatus.OK.code,
                    HttpStatus.OK.message,
                    "Picture retrieved",
                    picture
                )
            );
        })
        .catch((error) => {
            logger.error(`Error occurred while retrieving picture: ${error}`);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
                new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.code,
                    HttpStatus.INTERNAL_SERVER_ERROR.message,
                    `Some error occurred while retrieving picture.`,
                    err
                )
            );
        });
};

exports.updatePostPicture = (req, res) => {
    const { id } = req.params;
    const form = formidable({ multiples: true });

    form.parse(req, (err, fields, files) => {
        if (err) {
            logger.error(`Error while uploading the image : ${err}`);
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
                .send(
                    new Response(
                        HttpStatus.INTERNAL_SERVER_ERROR.code,
                        HttpStatus.INTERNAL_SERVER_ERROR.message,
                        `An error occurred while uploading the image.`,
                        err
                    )
                );
        }
        logger.info(`Update the post image with the ID ${id}`);
        // Check if the image exists in the database
        Picture.findByPk(id).then((picture) => {
            if (!picture) {
                logger.warn(`Image not found with ID ${id}`);
                return res
                    .status(HttpStatus.BAD_REQUEST.code)
                    .send(
                        new Response(
                            HttpStatus.BAD_REQUEST.code,
                            HttpStatus.BAD_REQUEST.message,
                            `Image not found`
                        )
                    );
            }

            // Check if postid is a valid integer
            const postid = fields.postid;
            if (postid && !Number.isInteger(Number(postid))) {
                logger.warn(`invalid postid provided : ${postid}`);
                return res
                    .status(HttpStatus.BAD_REQUEST.code)
                    .send(
                        new Response(
                            HttpStatus.BAD_REQUEST.code,
                            HttpStatus.BAD_REQUEST.message,
                            `postid must be a valid integer`
                        )
                    );
            }

            // Check if the corresponding post exists in the database
            if (postid) {
                Post.findByPk(postid).then((post) => {
                    if (!post) {
                        logger.warn(
                            `postid does not correspond to an existing post: ${postid}`
                        );
                        return res
                            .status(HttpStatus.BAD_REQUEST.code)
                            .send(
                                new Response(
                                    HttpStatus.BAD_REQUEST.code,
                                    HttpStatus.BAD_REQUEST.message,
                                    `postid does not correspond to an existing post`
                                )
                            );
                    }

                    // Déplacer le fichier téléchargé vers le dossier public/post_picture si un nouveau fichier a été téléchargé
                    if (files.url) {
                        const ext = path.extname(files.url.originalFilename);
                        const destinationFolder = path.join(
                            __dirname,
                            "../public/post_picture/"
                        );
                        const newpath = path.join(
                            destinationFolder,
                            `${uuidv4()}${ext}`
                        );
                        const oldpath = path.join(
                            destinationFolder,
                            picture.url
                        );

                        fs.unlink(oldpath, function (err) {
                            if (err && err.code !== "ENOENT") {
                                logger.error(
                                    `Error when deleting the old image : ${err}`
                                );
                                return res
                                    .status(
                                        HttpStatus.INTERNAL_SERVER_ERROR.code
                                    )
                                    .send(
                                        new Response(
                                            HttpStatus.INTERNAL_SERVER_ERROR.code,
                                            HttpStatus.INTERNAL_SERVER_ERROR.message,
                                            `Error when deleting the old image`,
                                            err
                                        )
                                    );
                            }
                        });

                        fs.rename(files.url.filepath, newpath, function (err) {
                            if (err) {
                                logger.error(
                                    `Error when moving the image to the public folder : ${err}`
                                );
                                return res
                                    .status(
                                        HttpStatus.INTERNAL_SERVER_ERROR.code
                                    )
                                    .send(
                                        new Response(
                                            HttpStatus.INTERNAL_SERVER_ERROR.code,
                                            HttpStatus.INTERNAL_SERVER_ERROR.message,
                                            `An error occurred when moving the image to the public folder.`,
                                            err
                                        )
                                    );
                            }

                            Picture.update(
                                {
                                    url: path.relative(
                                        destinationFolder,
                                        newpath
                                    ),
                                    postid: postid,
                                },
                                {
                                    where: { id: picture.id },
                                }
                            )
                            .then((data) => {
                                logger.info(
                                    `Image with ID ${id} successfully updated`
                                );
                                const updatedPicture = {
                                    url: data.url,
                                };
                                res.status(HttpStatus.OK.code).send(
                                    new Response(
                                        HttpStatus.OK.code,
                                        HttpStatus.OK.message,
                                        "Updated image",
                                        updatedPicture
                                    )
                                );
                            });
                        });
                    } else {
                        // Mettre à jour l'image dans la base de données sans déplacer le fichier
                        Picture.update(
                            {
                                postid: postid,
                            },
                            {
                                where: { id: picture.id },
                            }
                        ).then((data) => {
                            logger.info(
                                `Image with ID ${id} successfully updated`
                            );
                            const updatedPicture = {
                                url: data.url,
                            };
                            res.status(HttpStatus.OK.code).send(
                                new Response(
                                    HttpStatus.OK.code,
                                    HttpStatus.OK.message,
                                    "Updated image",
                                    updatedPicture
                                )
                            );
                        });
                    }
                });
            }
        });
    });
};

exports.deletePostPicture = (req, res) => {
    logger.info(`Deleting post picture with ID ${req.params.id}`);

    Picture.findByPk(req.params.id)
        .then((picture) => {
            if (!picture) {
                logger.warn(`Picture not found with ID ${req.params.id}`);
                return res
                    .status(HttpStatus.NOT_FOUND.code)
                    .send(
                        new Response(
                            HttpStatus.NOT_FOUND.code,
                            HttpStatus.NOT_FOUND.message,
                            `Picture with id ${req.params.id} not found.`
                        )
                    );
            }

            // Set the path to the image to be deleted
            const imagePath = path.join(
                __dirname,
                "../public/post_picture/",
                picture.url
            );

            // Remove the image file
            fs.unlink(imagePath, (err) => {
                if (err) {
                    logger.error(
                        `Error while deleting image file for picture with id ${req.params.id}: ${err.message}`
                    );
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
                        new Response(
                            HttpStatus.INTERNAL_SERVER_ERROR.code,
                            HttpStatus.INTERNAL_SERVER_ERROR.message,
                            `Some error occurred while deleting picture with id ${req.params.id}.`,
                            err
                        )
                    );
                } else {
                    logger.info(
                        `Image file deleted for picture with ID ${req.params.id}`
                    );

                    // If image file deletion is successful, delete the Picture object from the database
                    picture
                        .destroy()
                        .then(() => {
                            logger.info(
                                `Picture with ID ${req.params.id} deleted successfully`
                            );
                            res.status(HttpStatus.NO_CONTENT.code).send(
                                new Response(
                                    HttpStatus.NO_CONTENT.code,
                                    HttpStatus.NO_CONTENT.message,
                                    `Picture with id ${req.params.id} has been deleted.`
                                )
                            );
                        })
                        .catch((err) => {
                            logger.error(
                                `Error while deleting picture with id ${req.params.id}: ${err.message}`
                            );
                            res.status(
                                HttpStatus.INTERNAL_SERVER_ERROR.code
                            ).send(
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
        .catch((err) => {
            logger.error(
                `Error while finding picture with id ${req.params.id}: ${err.message}`
            );
            res.status(HttpStatus.INTERNAL_SERVER_ERROR.code).send(
                new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.code,
                    HttpStatus.INTERNAL_SERVER_ERROR.message,
                    `Some error occurred while finding picture with id ${req.params.id}.`,
                    err
                )
            );
        });
};

exports.uploadPostPicture = async (req, res) => {
    console.log("Uploading post picture");

    try {
        // Create a new IncomingForm object to parse the incoming form data
        const form = formidable({ multiples: true });
        const { fields, files } = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ fields, files });
                }
            });
        });

        // Get the value of postid from the form data
        const postid = parseInt(fields.postid);
        // Check if postid is a valid integer
        if (!Number.isSafeInteger(postid)) {
            logger.error(`Invalid postid: ${postid}`);
            return res
                .status(HttpStatus.BAD_REQUEST.code)
                .send(
                    new Response(
                        HttpStatus.BAD_REQUEST.code,
                        HttpStatus.BAD_REQUEST.message,
                        `postid must be a valid integer`
                    )
                );
        }
        // Check if the corresponding post exists in the database
        const post = await Post.findByPk(postid);
        if (!post) {
            logger.error(`Post not found with postid: ${postid}`);
            return res
                .status(HttpStatus.BAD_REQUEST.code)
                .send(
                    new Response(
                        HttpStatus.BAD_REQUEST.code,
                        HttpStatus.BAD_REQUEST.message,
                        `postid does not correspond to an existing post`
                    )
                );
        }

        // Upload ALL files sended by a map
        const urls = Array.isArray(files.url) ? files.url : [files.url]; // ensure urls is an array
        if (urls.length > 3) {
          urls = urls.slice(0, 3);
        }  
        const newPictures = await Promise.all(
            urls.map(async (file) => {
                try {
                    const ext = path.extname(file.originalFilename);
                    const filename = `${uuidv4()}${ext}`;
                    const destinationFolder = path.join(
                        __dirname,
                        "..",
                        "public",
                        "post_picture"
                    );
                    const filepath = path.join(destinationFolder, filename);
                    await fs.promises.mkdir(destinationFolder, {
                        recursive: true,
                    });
                    await fs.promises.rename(file.filepath, filepath);
                    const newPicture = {
                        url: path.relative(destinationFolder, filepath),
                        postid,
                    };
                    return newPicture;
                } catch (error) {
                    console.error(`Error while creating picture: ${error}`);
                    throw error;
                }
            })
        );
        // console.log(newPictures);
        Picture.bulkCreate(newPictures)
            .then(() => {
                //bug if we defined res.status
                res.send(
                    new Response(
                        HttpStatus.CREATED.code,
                        HttpStatus.CREATED.message,
                        "Picture(s) created",
                        newPictures
                    ))
            })
            .catch(error => console.log(error));

    } catch (error) {
        logger.error(`Error while upload picture : ${error}`);
        return res
            .status(HttpStatus.INTERNAL_SERVER_ERROR.code)
            .send(
                new Response(
                    HttpStatus.INTERNAL_SERVER_ERROR.code,
                    HttpStatus.INTERNAL_SERVER_ERROR.message,
                    `Error while upload picture : ${error}`
                )
            );
    }
};
