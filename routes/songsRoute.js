import express from 'express'
import validate from '../middlewares/validate.js';
import SongModel from '../models/songModel.js';
import UserModel from '../models/userModel.js';



const router = express.Router();
router.post("/get-all-songs", validate, async (req, res) => {
  try {
    const songs = await SongModel.find();
    res.status(200).send({
      message: "Songs fetched successfully",
      success: true,
      data: songs,
    });
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error fetching songs", success: false, data: error });
  }
});

router.post("/add-playlist", validate, async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userId);
    const existingPlaylists = user.playlists;
    existingPlaylists.push({
      name: req.body.name,
      songs: req.body.songs,
    });
    const updatedUser = await UserModel.findByIdAndUpdate(
      req.body.userId,
      {
        playlists: existingPlaylists,
      },
      { new: true }
    );
    res.status(200).send({
      message: "Playlist created successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      message: "Error creating playlist",
      success: false,
      data: error,
    });
  }
});

router.post("/update-playlist", validate, async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userId);
    let existingPlaylists = user.playlists;
    existingPlaylists = existingPlaylists.map((playlist) => {
      if (playlist.name === req.body.name) {
        playlist.songs = req.body.songs;
      }
      return playlist;
    });

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.body.userId,
      {
        playlists: existingPlaylists,
      },
      { new: true }
    );
    res.status(200).send({
      message: "Playlist updated successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error updating playlist",
      success: false,
      data: error,
    });
  }
});

router.post("/delete-playlist", validate, async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userId);
    let existingPlaylists = user.playlists;
    existingPlaylists = existingPlaylists.filter((playlist) => {
      if (playlist.name === req.body.name) {
        return false;
      }
      return true;
    });

    const updatedUser = await UserModel.findByIdAndUpdate(
      req.body.userId,
      {
        playlists: existingPlaylists,
      },
      { new: true }
    );
    res.status(200).send({
      message: "Playlist deleted successfully",
      success: true,
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error deleting playlist",
      success: false,
      data: error,
    });
  }
});

export default router
