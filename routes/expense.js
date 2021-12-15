const Expense = require("../models/expense")
const router = require("express").Router();

const {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndOperator,
  } = require("./verifyToken");

//CREATE AN EXPENSE
router.post("/", verifyTokenAndOperator, async (req, res) => {
    const expense = new Expense(req.body);
    try {
      const savedExpense= await expense.save();
      res.status(200).
      json({
          message: "Expense have been successfully created",
          body: savedExpense
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
      const updatedExpense = await Expense.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      if (updatedExpense != null){

        res.status(200).json(
            {
                message: "Expense has been successfully updated",
                body: updatedExpense,
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
      deletedExpense = await Expense.findByIdAndDelete(req.params.id);
      
      if (deletedExpense != null){
        res.status(200).json(
            {
              message: "Expense has been deleted",
              body: deletedExpense,
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
      const expense = await Expense.findById(req.params.id);
      if(expense != null){
        res.status(200).json(
            {
              message: "Successfully operation",
              body:expense
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
    const qType = req.query.type;
    const qStaff = req.query.staff;

    try {
    let expenses;
       
     if (qCountry) {
        expenses = await Expense.find({
          country: {
            $in: [qCountry],
          },
        });
      } else if (qType){
        expenses = await Expense.find({
            expenseType: {
                $in: [qType],
            }
        });
      } else if (qStaff){
        expenses = await Expense.find({
            staffId: {
                $in: [qStaff],
            }
        });
      } else {
        expenses = await Expense.find();
      }
      res.status(200).json(
        {
            message: "Successfully operation",
            body: expenses
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


