const Staff = require("../models/staff")
const router = require("express").Router();
const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndOperator,
  } = require("./verifyToken");

//CREATE A STAFF
router.post("/", verifyTokenAndOperator, async (req, res) => {
    const newStaff = new Staff(req.body);
    try {
      const savedStaff = await newStaff.save();
      res.status(200).
      json({
          message: "Staff have been successfully created",
          body: savedStaff
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

//UPDATE 
router.put("/:id", verifyTokenAndOperator, async (req, res) => {
    try {
      const updatedStaff = await Staff.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      if (updatedStaff != null) {
        res.status(200).json(
          {
              message: "Staff has been successfully updated",
              body: updatedStaff,
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

  //DELETE
router.delete("/:id", verifyTokenAndOperator, async (req, res) => {
    try {
      deletedStaff = await Staff.findByIdAndDelete(req.params.id);
     
      if(deletedStaff != null){
        res.status(200).json(
          {
            message: "Staff has been successfully deleted",
            body: deletedStaff,
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

//GET STAFF
router.get("/:id", async (req, res) => {
    try {
      const staff = await Staff.findById(req.params.id);

      if(staff != null){
        res.status(200).json(
          {
            message: "Successfully operation",
            body:staff
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

  router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCountry = req.query.country;
    try {
      let staffs;
  
      if (qNew) {
        staffs = await Staff.find().sort({ createdAt: -1 }).limit(1);
      } else if (qCountry) {
        staffs = await Staff.find({
          country: {
            $in: [qCountry],
          },
        });
      } else {
        staffs = await Staff.find();
      }
      res.status(200).json(
            {
                message: "Successfully operation",
                body: staffs
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

module.exports = router


