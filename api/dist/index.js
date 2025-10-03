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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)({ origin: '*' }));
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.json({
        status: true,
        message: "Server is online! 😘"
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
        res.json({
            output: "Output from NASM",
            errors: "YESS"
        });
        // const dockerCommand = `docker run --rm -v ./:/app --memory=100m --cpus=0.5 --name rumbly-runner-${uuid} rumbly-runner:latest sh -c 'nasm -f elf64 -o ${uuid}.o ${uuid}.asm && ld -o ${uuid} ${uuid}.o && ./${uuid}'`;
        // exec(dockerCommand, (error, stdout, stderr) => {
        //   if (error) {
        //     console.error(`exec error: ${error}`);
        //     return res.status(500).json({
        //       errors: stderr
        //     })
        //   }
        //   res.status(200).json({
        //     output: stdout,
        //     errors: stderr
        //   });
        // });
    }
    catch (error) {
        console.error('Error writing to file:', error);
        res.status(500).send('Internal Server Error: Could not write data to file.');
    }
}));
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
