const Expenditure = require("../models/expenditure")
const router = require("express").Router();

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndOperator,
  } = require("./verifyToken");

//CREATE AN EXPENSE
router.post("/", verifyTokenAndOperator, async (req, res) => {
    const expenditure = new Expenditure(req.body);
    try {
      const savedExpenditure= await expenditure.save();
      res.status(200).
      json({
          message: "Expenditure have been successfully created",
          body: savedExpenditure
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

//UPDATE AN EXPENSE
router.put("/:id", verifyTokenAndOperator, async (req, res) => {
    try {
      const updatedExpenditure = await Expenditure.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      if (updatedExpenditure != null){

        res.status(200).json(
            {
                message: "Expenditure has been successfully updated",
                body: updatedExpenditure,
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

  //DELETE AND EXPENSE
router.delete("/:id", verifyTokenAndOperator, async (req, res) => {
    try {
      deletedExpenditure = await Expenditure.findByIdAndDelete(req.params.id);
      
      if (deletedExpenditure != null){
        res.status(200).json(
            {
              message: "Expenditure has been deleted",
              body: deletedExpenditure,
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
router.get("/:id",verifyToken,async (req, res) => {
    try {
      const expenditure = await Expenditure.findById(req.params.id);

      if(expenditure != null){
        res.status(200).json(
            {
              message: "Successfully operation",
              body:expenditure
            }
          );
      } else {
        res.status(404).json(
            {
              message: "The resource is not found",
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

  router.get("/",verifyToken,async (req, res) => {
    const qCountry = req.query.country;
    const qCategory = req.query.category;
    const qStaff = req.query.staff;

    try {
    let expenditures;
       
     if (qCountry) {
      expenditures = await Expenditure.find({
          country: {
            $in: [qCountry],
          },
        });
      } else if (qCategory){
        expenditures = await Expenditure.find({
            category: {
                $in: [qCategory],
            }
        });
      } else if (qStaff){
        expenditures = await Expenditure.find({
            staffId: {
                $in: [qStaff],
            }
        });
      } else {
        expenditures = await Expenditure.find();
      }
      res.status(200).json(
        {
            message: "Successfully operation",
            body: expenditures
        }
        );

    } catch (err) {
        res.status(500).json(
        {
            message: "There is an internal error for this operation",
            body:err
        });
    }
  });

module.exports = router


