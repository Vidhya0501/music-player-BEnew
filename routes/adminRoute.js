import express from 'express'
import multer from 'multer'
import validate from '../middlewares/validate.js';
import cloudinary from '../cloudinary.js';
import SongModel from '../models/songModel.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });
router.post(
  "/add-song",
  validate,
  upload.single("file"),
  async (req, res) => {
    try {
      cloudinary.v2.uploader.upload(
        req.file.path,
        {
          folder: "music",
          use_filename: true,
          resource_type: "raw",
        },
        async (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).json({ message: "Something went wrong" });
          } else {
            const newsong = new SongModel({
              title: req.body.title,
              artist: req.body.artist,
              src: result.url,
              album: req.body.album,
              duration: req.body.duration,
              year: req.body.year,
            });
            await newsong.save();
            const allSongs = await SongModel.find();
            res.status(200).send({
              message: "Song added successfully",
              success: true,
              data: allSongs,
            });
          }
        }
      );
    } catch (error) {
      res.status(500).send({
        message: "Error adding song",
        success: false,
        data: error,
      });
    }
  }
);

router.post(
  "/edit-song",
  validate,
  upload.single("file"),
  async (req, res) => {
    try {
      let response = null;
      if (req.file) {
        response = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "music",
          use_filename: true,
          resource_type: "raw",
        });
      }
      await Song.findByIdAndUpdate(req.body._id, {
        title: req.body.title,
        artist: req.body.artist,
        src: response ? response.url : req.body.src,
        album: req.body.album,
        duration: req.body.duration,
        year: req.body.year,
      });
      const allSongs = await SongModel.find();
      res.status(200).send({
        message: "Song edited successfully",
        success: true,
        data: allSongs,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error adding song",
        success: false,
        data: error,
      });
    }
  }
);

export default router