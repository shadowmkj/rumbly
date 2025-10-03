import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs'
import { exec } from 'child_process';
const app: Express = express();
const port = process.env.PORT || 3000;


app.use(cors({ origin: '*' }));
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
  res.json({
    status: true,
    message: "Server is online! 😘"
  })
});

app.post('/run', async (req, res) => {
  const uuid = randomUUID();
  try {
    const data = req.body;
    const filePath = path.join(__dirname, '..', `${uuid}.asm`);

    fs.writeFile(filePath, data.code, (err) => {
      if (err) {
        console.error('Failed to save data:', err);
        return res.status(500).send('Error saving data.');
      }
    });

    const dockerCommand = `docker run --rm -v ./:/app --memory=100m --cpus=0.5 --name rumbly-runner-${uuid} rumbly-runner:latest sh -c "nasm -f elf64 -o ${uuid}.o ${uuid}.asm && ld -o ${uuid} ${uuid}.o && ./${uuid}"`;


    exec(dockerCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).json({
          errors: stderr
        })
      }
      res.status(200).json({
        output: stdout,
        errors: stderr
      });
    });
  } catch (error) {
    console.error('Error writing to file:', error);
    res.status(500).send('Internal Server Error: Could not write data to file.');
  }
})



app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
