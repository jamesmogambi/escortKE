// In MongoDB Compass Aggregation tab
[
  // Stage 1: Find documents with issues
  {
    $match: {
      $or: [
        { previewPhoto: { $regex: /\s/ } },
        { previewPhoto: { $regex: /https:\/\/https:\/\// } },
        { images: { $elemMatch: { $regex: /\s/ } } },
        { images: { $elemMatch: { $regex: /https:\/\/https:\/\// } } },
      ],
    },
  },

  // Stage 2: Clean previewPhoto
  {
    $addFields: {
      cleanedPreviewPhoto: {
        $let: {
          vars: {
            // Split by space and get the last part
            parts: { $split: ["$previewPhoto", " "] },
            // Check if it has double https
            hasDoubleHttps: {
              $regexMatch: {
                input: "$previewPhoto",
                regex: /https:\/\/https:\/\//,
              },
            },
          },
          in: {
            $cond: {
              if: "$$hasDoubleHttps",
              then: {
                $replaceAll: {
                  input: "$previewPhoto",
                  find: "https://https://",
                  replacement: "https://",
                },
              },
              else: {
                $cond: {
                  if: { $gt: [{ $size: "$$parts" }, 1] },
                  then: {
                    $arrayElemAt: ["$$parts", -1],
                  },
                  else: "$previewPhoto",
                },
              },
            },
          },
        },
      },
    },
  },

  // Stage 3: Clean images array
  {
    $addFields: {
      cleanedImages: {
        $map: {
          input: "$images",
          as: "img",
          in: {
            $let: {
              vars: {
                parts: { $split: ["$$img", " "] },
                hasDoubleHttps: {
                  $regexMatch: {
                    input: "$$img",
                    regex: /https:\/\/https:\/\//,
                  },
                },
              },
              in: {
                $cond: {
                  if: "$$hasDoubleHttps",
                  then: {
                    $replaceAll: {
                      input: "$$img",
                      find: "https://https://",
                      replacement: "https://",
                    },
                  },
                  else: {
                    $cond: {
                      if: { $gt: [{ $size: "$$parts" }, 1] },
                      then: {
                        $arrayElemAt: ["$$parts", -1],
                      },
                      else: "$$img",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },

  // Stage 4: Remove empty strings and duplicates
  {
    $addFields: {
      cleanedImages: {
        $reduce: {
          input: "$cleanedImages",
          initialValue: [],
          in: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$$this", ""] },
                  { $not: [{ $in: ["$$this", "$$value"] }] },
                ],
              },
              then: { $concatArrays: ["$$value", ["$$this"]] },
              else: "$$value",
            },
          },
        },
      },
    },
  },

  // Stage 5: Update the documents
  {
    $merge: {
      into: "escorts",
      on: "_id",
      whenMatched: [
        {
          $set: {
            previewPhoto: "$cleanedPreviewPhoto",
            images: "$cleanedImages",
          },
        },
      ],
      whenNotMatched: "discard",
    },
  },
];
