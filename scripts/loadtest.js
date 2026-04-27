// k6 Load-Test (optional, nur bei "Stress-Test --mit-load")
// Defaults bewusst niedrig: 50 VU, 30s. Vercel-Quota-freundlich.
// Anpassbar via ENV: K6_VUS, K6_DURATION, TEST_BASE_URL

import { check } from "k6";
import http from "k6/http";

export const options = {
  vus: Number(__ENV.K6_VUS ?? 50),
  duration: __ENV.K6_DURATION ?? "30s",
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500", "p(99)<1000"],
  },
};

const baseUrl = __ENV.TEST_BASE_URL ?? "http://localhost:3000";

export default function () {
  const res = http.get(`${baseUrl}/`);
  check(res, {
    "Status 200": (r) => r.status === 200,
    "HTML enthaelt <html>": (r) => (r.body ?? "").includes("<html"),
  });
}
