
const express = require("express");
const cors = require("cors");
require("dotenv").config();
// const admin = require("firebase-admin");

// const serviceAccount = require("./survicekey.json");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

// Middleware   8pi0F5rqKqKWPV1l
app.use(cors());
app.use(express.json());



// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });



// MongoDB Connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.neniktd.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});



async function run() {
  try {
    await client.connect();
    console.log(" Connected to MongoDB");

    const db = client.db("zap-shift");
    const ParcelsCollection = db.collection("parcels"); 
    
    // Default route
    app.get("/", (req, res) => {
      res.send("zap-shift API running ");
    });

    app.post("/parcels",async (req, res) => {
      const parcel = req.body;
      parcel.createdAt=new Date();
      const result = await ParcelsCollection.insertOne(parcel);
      res.send(result);
    });
    app.get("/parcels",async (req, res) => {
    try {
      
      const query ={}
      const {email}=req.query;
      if (email) {
        query.EmailAddress=email
        
      }
      const option={sort:{createdAt:-1}}

      const result = await ParcelsCollection.find(query,option).toArray();
      res.send(result);
    } catch (err) {
      console.error(err);
      res.status(500).send({ message: "Failed to fetch user issues" });
    }
  });

  app.get("/parcels/:id",async (req, res)=>{

    try {
     const id = req.params.id;
     const result = await ParcelsCollection.findOne({
       _id: new ObjectId(id),
     });
     res.send(result);
   } catch (err) {
     console.error(err);
     res.status(500).send({ message: "Failed to delete issue" });
   }

  })

  // delete 
  app.delete("/parcels/:id",async (req, res) => {
   try {
     const id = req.params.id;
     const result = await ParcelsCollection.deleteOne({
       _id: new ObjectId(id),
     });
     res.send(result);
   } catch (err) {
     console.error(err);
     res.status(500).send({ message: "Failed to delete issue" });
   }
 });

    // //  All Public Issues
    // app.get("/issues", async (req, res) => {
    //   const result = await issuesCollection.find().toArray();
    //   res.send(result);
    // });

  app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

run().catch(console.dir);
    

// issu details 


// app.get("/issues/:id",verifyToken,async (req, res) => {
//   try {
//     const id = req.params.id;
//     const issue = await issuesCollection.findOne({ _id: new ObjectId(id) });
//     if (!issue) return res.status(404).send({ message: "Issue not found" });

//     // console.log(" Issue fetched by:", req.user.email);
//     res.send(issue);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: "Server error" });
//   }
// });

    
// app.post("/userissues", verifyToken, async (req, res) => {
//   try {
//     const issue = req.body;

   
//     const userIssue = {
//       ...issue,
//       email: req.user.email,
//       createdAt: new Date(),
//       status: "ongoing",
//     };

    
//     const userResult = await userIssuesCollection.insertOne(userIssue);

   
//     const publicIssue = {
//       ...issue,
//       createdAt: new Date(),
//       status: "ongoing",
//       userIssueId: userResult.insertedId, 
//     };

    
//     const publicResult = await issuesCollection.insertOne(publicIssue);

//     res.send({
//       success: true,
//       message: "Issue added successfully",
//       userIssueId: userResult.insertedId,
//       publicIssueId: publicResult.insertedId,
//     });
//   } catch (err) {
//     console.error("Error adding issue:", err);
//     res.status(500).send({ message: "Failed to add issue" });
//   }
// });

//     //Get (My Issues)
//     app.get("/userissues", verifyToken,async (req, res) => {
//       try {
//         const email = req.query.email;
//         const query = email ? { email } : {};
//         const result = await userIssuesCollection.find(query).toArray();
//         res.send(result);
//       } catch (err) {
//         console.error(err);
//         res.status(500).send({ message: "Failed to fetch user issues" });
//       }
//     });

//     // Edit 
//     app.put("/userissues/:id",verifyToken, async (req, res) => {
//       try {
//         const id = req.params.id;
//         const updatedIssue = req.body;
//         const result = await userIssuesCollection.updateOne(
//           { _id: new ObjectId(id) },
//           { $set: updatedIssue }
//         );
//         res.send(result);
//       } catch (err) {
//         console.error(err);
//         res.status(500).send({ message: "Failed to update issue" });
//       }
//     });

//     // Delete 
//     app.delete("/userissues/:id",async (req, res) => {
//       try {
//         const id = req.params.id;
//         const result = await userIssuesCollection.deleteOne({
//           _id: new ObjectId(id),
//         });
//         res.send(result);
//       } catch (err) {
//         console.error(err);
//         res.status(500).send({ message: "Failed to delete issue" });
//       }
//     });

//     //  Contributes
//     app.post("/contribute",verifyToken,async (req, res) => {
//       const contribution = req.body;
//       const result = await contributionsCollection.insertOne(contribution);
//       res.send(result);
//     });


//     // all contributors information
// app.get("/contributions/:issueId", verifyToken, async (req, res) => {
//   try {
//     const issueId = req.params.issueId;
//     const result = await contributionsCollection.find({ issueId }).toArray();
//     res.send(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send({ message: "Failed to fetch contributions" });
//   }
// });


//     app.get("/mycontributions/:email",verifyToken,async (req, res) => {
//       const email = req.params.email;
//       const result = await contributionsCollection.find({ userEmail: email }).toArray();
//       res.send(result);
//     });

//     app.put("/mycontributions/:id",async (req, res) => {
//       const id = req.params.id;
//       const { amount } = req.body;
//       const result = await contributionsCollection.updateOne(
//         { _id: new ObjectId(id) },
//         { $set: { amount } }
//       );
//       res.send(result);
//     });

//     app.delete("/mycontributions/:id",verifyToken,async (req, res) => {
//       const id = req.params.id;
//       const result = await contributionsCollection.deleteOne({ _id: new ObjectId(id) });
//       res.send(result);
//     });

  