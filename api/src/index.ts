import express, { Express, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs'
const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.json({
    status: true,
    message: "Server is online! 😘"
  })
});

app.post('/run', async (req, res) => {
  const uuid = randomUUID();
  console.log(req.body)
  try {
    const data = req.body;
    if (!data || Object.keys(data).length === 0) {
      return res.status(400).send('Bad Request: Request body is empty.');
    }
    const content = JSON.stringify(data.code, null, 2);
    const filePath = path.join(__dirname, '..', `${uuid}.asm`);

    fs.writeFile(filePath, content, (err) => {
      if (err) {
        console.error('Failed to save data:', err);
        return res.status(500).send('Error saving data.');
      }
    });

    console.log(`Data saved to ${filePath}`);
    res.status(200).send('Success: Data has been written to the file.');
  } catch (error) {
    console.error('Error writing to file:', error);
    res.status(500).send('Internal Server Error: Could not write data to file.');
  }
})



app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
