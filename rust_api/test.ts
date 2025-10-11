import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  // Key configurations for Stress in this section
  stages: [
    { duration: '10s', target: 500 }, // traffic ramp-up from 1 to a higher 200 users over 10 minutes.
    { duration: '15s', target: 3000 }, // stay at higher 200 users for 30 minutes
    { duration: '5s', target: 0 }, // ramp-down to 0 users
  ],
};

export default () => {
  const urlRes = http.get('http://127.0.0.1:8080/100');
  sleep(1);
};

