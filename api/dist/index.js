"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const crypto_1 = require("crypto");
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const ws_1 = require("ws");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const server = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server });
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.json({
        status: true,
        message: "Server is online! 😘"
    });
});
wss.on('connection', (ws) => {
    const uuid = (0, crypto_1.randomUUID)();
    console.log('Client connected');
    let hasReceivedCode = false;
    let childProcess = null;
    let tempDir = null;
    ws.on('message', (message) => {
        if (!hasReceivedCode) {
            hasReceivedCode = true;
            const code = message.toString();
            try {
                tempDir = path_1.default.join(__dirname, '..', 'nasm');
                const asmPath = path_1.default.join(tempDir, `${uuid}.asm`);
                fs_1.default.writeFileSync(asmPath, code);
                const dockerCommand = 'docker';
                const dockerArgs = [
                    'run',
                    `--name`,
                    `${uuid}-container`,
                    '--rm', // Automatically remove the container when it exits
                    '-i', // Crucial for interactivity: keeps STDIN open
                    '--network=none', // Disable networking for security
                    `--memory=64m`, // Set a 128MB memory limit
                    `--cpus=0.3`, // Limit to half a CPU core
                    `-v`, `${tempDir}:/app`, // Mount the temp directory into the container
                    'rumbly-runner', // The image to use
                    'sh', '-c', `nasm -f elf64 ${uuid}.asm -o ${uuid}.o && ld -m elf_x86_64 ${uuid}.o -o ${uuid} && ./${uuid}`
                ];
                childProcess = (0, child_process_1.spawn)(dockerCommand, dockerArgs);
                childProcess.stdout.on('data', (data) => {
                    ws.send(data.toString());
                });
                childProcess.stderr.on('data', (data) => {
                    ws.send(`stderr: ${data.toString()}`);
                    ws.close();
                });
                childProcess.on('close', (code) => {
                    ws.send(`\n[Program exited with code ${code !== null && code !== void 0 ? code : 'unknown'}]`);
                    ws.close();
                });
            }
            catch (err) {
                ws.send(`Server Error: ${err.message}`);
                ws.close();
            }
        }
        else {
            if (childProcess && childProcess.stdin) {
                childProcess.stdin.write(message.toString() + '\n');
            }
        }
    });
    ws.on('close', () => {
        console.log('Client disconnected');
        if (childProcess) {
            childProcess.kill();
            (0, child_process_1.exec)(`docker rm -f ${uuid}-container`, (err) => {
                if (err) {
                    console.error(`Failed to remove Docker container ${uuid}-container:`, err);
                }
                else {
                    console.log(`Docker container ${uuid}-container removed.`);
                }
            });
        }
        if (tempDir) {
            // fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });
    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
        if (childProcess) {
            childProcess.kill();
            (0, child_process_1.exec)(`docker rm -f ${uuid}-container`, (err) => {
                if (err) {
                    console.error(`Failed to remove Docker container ${uuid}-container:`, err);
                }
                else {
                    console.log(`Docker container ${uuid}-container removed.`);
                }
            });
        }
        if (tempDir) {
            fs_1.default.rmSync(tempDir, { recursive: true, force: true });
        }
    });
});
app.post('/run', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = (0, crypto_1.randomUUID)();
    try {
        const data = req.body;
        const filePath = path_1.default.join(__dirname, '..', `${uuid}.asm`);
        fs_1.default.writeFile(filePath, data.code, (err) => {
            if (err) {
                console.error('Failed to save data:', err);
                return res.status(500).send('Error saving data.');
            }
        });
        const dockerCommand = `docker run --rm -v ./:/app --memory=100m --cpus=0.5 --name rumbly-runner-${uuid} rumbly-runner:latest sh -c "nasm -f elf64 -o ${uuid}.o ${uuid}.asm && ld -o ${uuid} ${uuid}.o && ./${uuid}"`;
        (0, child_process_1.exec)(dockerCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return res.status(500).json({
                    errors: stderr
                });
            }
            res.status(200).json({
                output: stdout,
                errors: stderr
            });
        });
    }
    catch (error) {
        console.error('Error writing to file:', error);
        res.status(500).send('Internal Server Error: Could not write data to file.');
    }
}));
server.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
