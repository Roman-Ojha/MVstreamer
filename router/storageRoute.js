import express from "express";
import storage from "../db/FirebaseConn.js";
import authAdmin from "../middleware/authAdmin.js";
import compressImage from "../functions/compressImage.js";
import uploadImage from "../middleware/uploadImage.js";
import fs from "fs";
import path from "path";
import uuid from "uuid-v4";
import MVDetail from "../models/Mv_Models.js";
const router = express.Router();
const bucket = storage.bucket();

router.post(
  "/upload",
  authAdmin,
  uploadImage.fields([
    { name: "image", maxCount: 1 },
    { name: "media", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      if (
        req.files.image === undefined ||
        req.files.media === undefined ||
        req.body.title === "" ||
        req.body.singerName === ""
      ) {
        return res
          .status(401)
          .json({ success: false, msg: "Please Fill the field properly" });
      }
      await compressImage(req.files.image[0].path);
      fs.unlink(`./db/Images/${req.files.image[0].filename}`, (err) => {});
      const metadata = {
        metadata: {
          firebaseStorageDownloadTokens: uuid(),
        },
        cacheControl: "public, max-age=31536000",
      };
      // uploading song images
      const uploadImgInFirebase = await bucket.upload(
        `./db/build/${req.files.image[0].filename}`,
        {
          destination: `Images/${req.files.image[0].filename}`,
          gzip: true,
          metadata: metadata,
        }
      );
      fs.unlink(`./db/build/${req.files.image[0].filename}`, (err) => {});

      // uploading Media
      // if uploading media is audio then we will upload it in different destination if uploading media is video then we will put it in different destination
      const mediaType = req.files.media[0].mimetype.split("/")[0];
      // here we are getting the type of file "audio/video"
      const uploadMediaInFirebase = await bucket.upload(
        `./db/Media/${req.files.media[0].filename}`,
        {
          destination:
            mediaType === "audio"
              ? `Audio/${req.files.media[0].filename}`
              : `Video/${req.files.media[0].filename}`,
          // if media type is audio then we are uploading it in "Audio/" if not "Video/"
          gzip: true,
          metadata: metadata,
        }
      );
      // deleting file from directory after upload
      fs.unlink(`./db/Media/${req.files.media[0].filename}`, (err) => {});
      const title = req.body.title;
      const singerName = req.body.singerName;
      const imgToken =
        uploadImgInFirebase[0].metadata.metadata.firebaseStorageDownloadTokens;
      const imgPath = `Images/${req.files.image[0].filename}`;
      const imgBucket = process.env.FIREBASE_STORAGE_BUCKET;
      const imgUrl = `https://firebasestorage.googleapis.com/v0/b/${imgBucket}/o/${encodeURIComponent(
        imgPath
      )}?alt=media&token=${imgToken}`;
      const mediaPath =
        mediaType === "audio"
          ? `Audio/${req.files.media[0].filename}`
          : `Video/${req.files.media[0].filename}`;

      const newSong = new MVDetail({
        title,
        singerName,
        imgUrl,
        mediaPath,
      });
      // saving songs info in mongodb
      const resSong = await newSong.save();
      return res
        .status(200)
        .json({ success: true, msg: "Song Upload Successfully" });
    } catch (err) {
      return res.status(500)({
        success: false,
        msg: "Sorry, Please try again letter😥😥😥",
      });
    }
  }
);

export default router;
