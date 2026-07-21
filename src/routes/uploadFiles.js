const express = require("express");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { v4: uuid } = require("uuid");
const sharp = require("sharp");

const upload = require("../middlewares/upload");
const s3 = require("../config/s3");
const { userAuth } = require("../middlewares/auth");

const uploadRouter = express.Router();

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

uploadRouter.post(
  "/upload/profile-picture",
  userAuth,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No file uploaded",
        });
      }

      if (!ALLOWED_IMAGE_TYPES.includes(req.file.mimetype)) {
        return res.status(400).json({
          message: "Unsupported image format",
        });
      }

      if (req.file.size > MAX_FILE_SIZE) {
        return res.status(400).json({
          message: "Image size should be less than 10 MB",
        });
      }

      const optimizedImage = await sharp(req.file.buffer)
        .rotate()
        .resize({
          width: 512,
          height: 512,
          fit: "cover",
          position: "center",
          withoutEnlargement: true,
        })
        .webp({
          quality: 75,
          effort: 6,
        })
        .toBuffer();

      console.info(
        `Image optimized from ${(req.file.size / 1024).toFixed(1)} KB to ${(
          optimizedImage.length / 1024
        ).toFixed(1)} KB`
      );

      const key = `profile-pictures/${uuid()}.webp`;

      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: key,
          Body: optimizedImage,
          ContentType: "image/webp",
          CacheControl: "public, max-age=31536000",
          Metadata: {
            uploadedBy: req.user._id.toString(),
            uploadedAt: Date.now().toString(),
          },
        })
      );

      const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

      // Save old image URL before updating
      const oldPhotoUrl = req.user.photoUrl;

      // Update MongoDB
      req.user.photoUrl = imageUrl;
      await req.user.save();

      // Delete previous image from S3 (ignore failures)
      if (
        oldPhotoUrl &&
        oldPhotoUrl.includes(
          `${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com`
        )
      ) {
        try {
          const oldKey = oldPhotoUrl.split(".amazonaws.com/")[1];

          if (oldKey) {
            await s3.send(
              new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: oldKey,
              })
            );

            console.info(`Deleted old profile picture: ${oldKey}`);
          }
        } catch (err) {
          console.error("Unable to delete previous image:", err.message);
        }
      }

      return res.status(200).json({
        message: "Profile picture updated successfully",
        imageUrl,
        user: req.user,
      });
    } catch (err) {
      console.error("Profile picture upload failed:", err);

      return res.status(500).json({
        message: "Failed to upload profile picture",
      });
    }
  }
);

module.exports = uploadRouter;
