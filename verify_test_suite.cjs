const { io } = require("./client/node_modules/socket.io-client");
const axios = require("./client/node_modules/axios");

const SERVER_URL = "http://localhost:5000";
const CLIENT_URL = "http://localhost:5173";

async function runTests() {
  console.log("==================================================");
  console.log("STARTING FULL END-TO-END VERIFICATION TEST SUITE");
  console.log("==================================================");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    console.log("\n--- Step 1: Backend Health Check ---");
    const health = await axios.get(`${SERVER_URL}/health`);
    assert(health.status === 200 && health.data.status === "ok", "Server /health endpoint returns 200 { status: 'ok' }");

    // 2. Frontend web server check
    console.log("\n--- Step 2: Frontend Server Check ---");
    const frontend = await axios.get(CLIENT_URL);
    assert(frontend.status === 200 && frontend.data.includes("<div id=\"root\"></div>"), "Vite frontend is serving index.html on port 5173");

    // 3. REST API Validation tests
    console.log("\n--- Step 3: REST API Input Validation & Error Handling ---");
    try {
      await axios.post(`${SERVER_URL}/api/messages`, { username: "alice", message: "" });
      assert(false, "POST with empty message should fail");
    } catch (err) {
      assert(err.response && err.response.status === 400, "POST with empty message returns HTTP 400 Bad Request");
    }

    try {
      await axios.post(`${SERVER_URL}/api/messages`, { username: "", message: "Hello" });
      assert(false, "POST with empty username should fail");
    } catch (err) {
      assert(err.response && err.response.status === 400, "POST with empty username returns HTTP 400 Bad Request");
    }

    // 4. REST API Valid POST
    console.log("\n--- Step 4: REST API POST Message ---");
    const restPost = await axios.post(`${SERVER_URL}/api/messages`, {
      username: "SystemTester",
      message: "Initial REST seeded message"
    });
    assert(restPost.status === 201 && restPost.data._id && restPost.data.createdAt, "POST /api/messages creates message with _id and createdAt (201)");

    // 5. REST API GET Messages
    console.log("\n--- Step 5: REST API GET Chat History ---");
    const history = await axios.get(`${SERVER_URL}/api/messages`);
    assert(Array.isArray(history.data) && history.data.length > 0, "GET /api/messages returns array of messages");
    const foundSeeded = history.data.find(m => m.username === "SystemTester");
    assert(!!foundSeeded, "Seeded message is present in GET /api/messages history");

    // 6. Socket.io Client A ("Alice") & Client B ("Bob") Real-time Simulation
    console.log("\n--- Step 6: Socket.io Multi-Client Setup & Online Status ---");
    const socketA = io(SERVER_URL, { transports: ["websocket"] });
    const socketB = io(SERVER_URL, { transports: ["websocket"] });

    await Promise.all([
      new Promise(res => socketA.on("connect", res)),
      new Promise(res => socketB.on("connect", res))
    ]);
    assert(socketA.connected && socketB.connected, "Socket.io Clients A and B connected successfully");

    // Listen for users:online
    let onlineListA = null;
    let onlineListB = null;
    socketA.on("users:online", users => { onlineListA = users; });
    socketB.on("users:online", users => { onlineListB = users; });

    socketA.emit("user:join", { username: "Alice" });
    socketB.emit("user:join", { username: "Bob" });

    // Wait 500ms for online broadcast
    await new Promise(r => setTimeout(r, 600));
    assert(
      onlineListA && onlineListA.some(u => u.username === "Alice") && onlineListA.some(u => u.username === "Bob"),
      "Client A received users:online containing both Alice and Bob"
    );
    assert(
      onlineListB && onlineListB.some(u => u.username === "Alice") && onlineListB.some(u => u.username === "Bob"),
      "Client B received users:online containing both Alice and Bob"
    );

    // 7. Typing Indicator Test
    console.log("\n--- Step 7: Typing Indicator Real-time Events ---");
    let typingReceivedByB = null;
    socketB.on("typing:update", update => { typingReceivedByB = update; });

    socketA.emit("typing:start", { username: "Alice" });
    await new Promise(r => setTimeout(r, 300));
    assert(
      typingReceivedByB && typingReceivedByB.username === "Alice" && typingReceivedByB.isTyping === true,
      "Client B received typing:start event from Alice"
    );

    socketA.emit("typing:stop", { username: "Alice" });
    await new Promise(r => setTimeout(r, 300));
    assert(
      typingReceivedByB && typingReceivedByB.username === "Alice" && typingReceivedByB.isTyping === false,
      "Client B received typing:stop event from Alice"
    );

    // 8. Real-time message broadcast (Test 3)
    console.log("\n--- Step 8: Real-Time Instant Delivery (Socket.io) ---");
    const testMsgText = `Realtime test message at ${Date.now()}`;
    let msgReceivedByA = null;
    let msgReceivedByB = null;

    socketA.on("message:receive", msg => { msgReceivedByA = msg; });
    socketB.on("message:receive", msg => { msgReceivedByB = msg; });

    socketA.emit("message:send", { username: "Alice", message: testMsgText });

    await new Promise(r => setTimeout(r, 800));

    assert(
      msgReceivedByB && msgReceivedByB.message === testMsgText && msgReceivedByB.username === "Alice",
      "Client B received Client A's message in real-time via Socket.io without refreshing"
    );
    assert(
      msgReceivedByA && msgReceivedByA.message === testMsgText,
      "Client A also received confirmation broadcast of its own message"
    );
    assert(
      msgReceivedByB && !!msgReceivedByB.createdAt && msgReceivedByB.delivered === true,
      "Message contains server-generated timestamp (createdAt) and delivered status"
    );

    // 9. Database persistence (Test 4 & Test 9)
    console.log("\n--- Step 9: Database Persistence Verification ---");
    const historyAfterSocket = await axios.get(`${SERVER_URL}/api/messages`);
    const foundSocketMsg = historyAfterSocket.data.find(m => m.message === testMsgText);
    assert(
      !!foundSocketMsg && foundSocketMsg.username === "Alice",
      "Socket-sent message was persisted to MongoDB and retrieved via GET /api/messages"
    );

    // 10. Socket Input Validation & Error Handling (Test 6)
    console.log("\n--- Step 10: Socket Input Validation (Empty Message Rejection) ---");
    let socketError = null;
    socketA.once("message:error", err => { socketError = err; });
    socketA.emit("message:send", { username: "Alice", message: "   " });
    await new Promise(r => setTimeout(r, 400));
    assert(
      socketError && socketError.error === "Message must not be empty.",
      "Empty message sent over socket was rejected with descriptive error"
    );

    // 11. Disconnect and Reconnection Handling (Test 7 & Test 8)
    console.log("\n--- Step 11: Disconnection & Online Status Update ---");
    socketB.disconnect();
    await new Promise(r => setTimeout(r, 600));
    assert(
      onlineListA && !onlineListA.some(u => u.username === "Bob"),
      "Client B disconnection triggered broadcast and Bob is no longer in online users list"
    );

    // Clean up
    socketA.disconnect();

  } catch (error) {
    console.error("Test execution encountered an error:", error.message);
    failed++;
  }

  console.log("\n==================================================");
  console.log(`TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==================================================");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
