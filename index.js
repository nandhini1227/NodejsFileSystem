const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const outputFolder = "./output";

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

const PORT = 3040;

app.get("/", (req, res) => {
  res.send("Hello from the server!"); 
});

app.post("/createFile", (req, res) => {
  const currentTime = new Date();
  const year = currentTime.getFullYear().toString();
  const month = (currentTime.getMonth() + 1).toString().padStart(2, '0'); 
  const date = currentTime.getDate().toString().padStart(2, '0'); 
  const hrs = currentTime.getHours().toString().padStart(2, '0'); 
  const mins = currentTime.getMinutes().toString().padStart(2, '0'); 
  const secs = currentTime.getSeconds().toString().padStart(2, '0'); 

  const dateTimeForFileName = `${year}-${month}-${date}-${hrs}-${mins}-${secs}.txt`;

  const filePath = path.join(outputFolder, dateTimeForFileName);

  fs.writeFile(filePath, currentTime.toISOString(), (err) => {
    if (err) {
      res.status(500).send(`Error creating file: ${err.message}`);
      return;
    }

    res.send(`File created successfully at: ${filePath}`);
  });
});


app.get("/getFiles", (req, res) => {
 
  fs.readdir(outputFolder, (err, files) => {
    if (err) {
      
      res.status(500).send(`Error reading files: ${err.message}`);
      return;
    }
    console.log("List of files:", files);
    const textFiles = files.filter((file) => path.extname(file) === ".txt");

    res.json(textFiles);
  });
});


app.listen(PORT, () => {
  console.log("Server is running on PORT", PORT);
});
