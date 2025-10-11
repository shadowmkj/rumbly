import ws from 'k6/ws';
import { check, sleep } from 'k6';

const WS_URL = 'wss://api.codenik.in';

export const options = {
  scenarios: {
    constant_vus_test: {
      executor: 'constant-vus', // Keeps a constant number of VUs running for the duration
      vus: 20,                 // 100 concurrent Virtual Users = 100 concurrent WebSocket connections
      duration: '25s',           // Run the test for 3 minutes
    },
  },
  thresholds: {
    'checks': ['rate>0.99'],              // 99% of checks must pass
  },
};

export default function () {
  const nasm = "\
section .data\
msg : db 'Enter a number: '\
msglen equ $-msg\
section .text\
 global _start\
_start:\
mov eax , 4\
mov ebx , 1\
mov ecx , msg\
mov edx , msglen\
int 80h\
mov eax , 1\
mov ebx , 0\
int 80h\
"
  const response = ws.connect(WS_URL, {}, (socket) => {
    // --- 1. Connection Open Event ---
    socket.on('open', () => {
      console.log(`VU ${__VU}: successfully connected.`);
      socket.send(nasm);
    });

    // --- 2. Message Event ---
    socket.on('message', (data) => {
      console.log(`VU ${__VU} received message: ${data}`);
    });

    // --- 3. Close Event ---
    socket.on('close', () => {
      console.log(`VU ${__VU} disconnected.`);
    });

    // --- 4. Error Event ---
    socket.on('error', (e) => {
      console.error(`VU ${__VU} WebSocket error: ${e.error}`);
    });

    // Keep the VU/connection alive for the duration of the iteration
    socket.setTimeout(() => {
      socket.close();
    }, 3600);
  });

  // Check that the initial connection was successful (status 101 for switching protocols)
  check(response, { 'WS status is 101': (r) => r && r.status === 101 });
}
