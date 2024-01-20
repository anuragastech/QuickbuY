const mongoose = require("mongoose");

const HomepageSchema = mongoose.Schema({
  h1: {
    type: String,
    required: true,
  },
  h2: {
    type: String,
    required: true,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Homepagepic", HomepageSchema);
