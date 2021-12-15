const router = require("express").Router();
const Country = require("../models/country")

const {
    verifyToken,
    verifyTokenAndOperator,
  } = require("./verifyToken");

//ADD A NEW DISTINCTION
router.post("/", verifyTokenAndOperator, async (req, res) => {
  const newCountry = new Country(req.body);
  try {
    const savedCountry = await newCountry.save();
    res.status(200).
    json({
        message: "New country has been added",
        body: savedCountry
      });
  } catch (err) {
    res.status(500).json(
      {
          message: "There is an error for this operation",
          body:err
      }
    );
  }
});

//UPDATE A COUNTRY
router.put("/:id", verifyTokenAndOperator, async (req, res) => {
  try {
    const updatedCountry = await Country.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    if (updatedCountry != null) {
      res.status(200).json(
        {
            message: "Country has been successfully updated",
            body: updatedCountry,
        }
      );
    } else {
      res.status(404).json(
        {
            message: "The resource not found",
        }
      );
    }
  
  } catch (err) {
    res.status(500).json(
      {
          message: "There is an error for this operation",
          body:err
      }
    );
  }
});

//GET A COUNTRY
router.get("/:id",async (req, res) => {
    try {
      const country = await Country.findById(req.params.id);

      if(country != null){
        res.status(200).json(
          {
            message: "Successfully operation",
            body:country
          }
        );

      } else {
        res.status(404).json(
          {
            message: "The resource not found",
          }
        );
      }
     
    } catch (err) {
      res.status(500).json(
        {
            message: "There is an error for this operation",
            body:err
        }
      );
    }
  });

  router.get("/",async (req, res) => {
    try {
   
        countries = await Country.find();
    
        res.status(200).json(
            {
                message: "Successfully operation",
                body: countries
            }
          );
    } catch (err) {
      res.status(500).json(
        {
            message: "There is an error for this operation",
            body:err
        }
      );
    }
  });

  //DELETE
router.delete("/:id", verifyTokenAndOperator, async (req, res) => {
  try {
    deletedCountry = await Country.findByIdAndDelete(req.params.id);
   
    if(deletedCountry != null){
      res.status(200).json(
        {
          message: "Country has been successfully deleted",
          body: deletedCountry,
        }
      );
    } else {
      res.status(404).json(
        {
          message: "The resource not found",
        }
      );
    }

  } catch (err) {
    res.status(500).json(
      {
          message: "There is an error for this operation",
          body:err
      }
    );
  }
});

module.exports = router