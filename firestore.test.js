const {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} = require("@firebase/rules-unit-testing");
const { test, before, after, beforeEach } = require("node:test");
const fs = require("node:fs");

const rutPath = require.resolve("@firebase/rules-unit-testing");
const firebaseCompat = require(require.resolve("firebase/compat/app", { paths: [rutPath] }));
require(require.resolve("firebase/compat/firestore", { paths: [rutPath] }));
const serverTimestamp = () => firebaseCompat.firestore.FieldValue.serverTimestamp();

let testEnv;
const PROJECT_ID = process.env.GCP_PROJECT || "demo-no-project";
const ALICE_UID = "alice_123";
const BOB_UID = "bob_456";

const [emulatorHost, emulatorPortStr] = (process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1:8085").split(":");
const emulatorPort = parseInt(emulatorPortStr, 10);

function getDb(context) {
  return context.firestore();
}

before(async () => {
  const rules = fs.readFileSync("./firestore.rules", "utf8");
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules,
      host: emulatorHost,
      port: emulatorPort,
    },
  });
});

after(async () => {
  if (testEnv) {
    await testEnv.cleanup();
  }
});

beforeEach(async () => {
  if (testEnv) {
    await testEnv.clearFirestore();
  }
});

test("Unauthenticated user cannot read or list user profile or memories", async () => {
  const unauthDb = getDb(testEnv.unauthenticatedContext());
  await assertFails(unauthDb.collection("users").doc(ALICE_UID).get());
  await assertFails(unauthDb.collection("users").doc(ALICE_UID).collection("memories").get());
  await assertFails(unauthDb.collection("users").doc(ALICE_UID).collection("chats").get());
  await assertFails(unauthDb.collection("users").doc(ALICE_UID).collection("notes").get());
  await assertFails(unauthDb.collection("users").doc(ALICE_UID).collection("routines").get());
});

test("Owner can create and update their own UserProfile with valid schema", async () => {
  const aliceDb = getDb(testEnv.authenticatedContext(ALICE_UID));
  const ref = aliceDb.collection("users").doc(ALICE_UID);
  await assertSucceeds(
    ref.set({
      uid: ALICE_UID,
      email: "alice@example.com",
      displayName: "Alice",
      activePersona: "Jasmine",
      appTheme: "Saree",
      voiceEngine: "LIVE",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );
  await assertSucceeds(
    ref.update({
      displayName: "Alice Updated",
      updatedAt: serverTimestamp(),
    })
  );
});

test("Cross-user access to another user's profile and subcollections fails", async () => {
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = getDb(ctx);
    await db.collection("users").doc(BOB_UID).collection("memories").doc("mem_1").set({
      userId: BOB_UID,
      category: "Personal",
      title: "Secret",
      details: "Bob private memory",
      dateAdded: 1700000000000,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  });

  const aliceDb = getDb(testEnv.authenticatedContext(ALICE_UID));
  await assertFails(aliceDb.collection("users").doc(BOB_UID).collection("memories").doc("mem_1").get());
  await assertFails(aliceDb.collection("users").doc(BOB_UID).collection("memories").get());
  await assertFails(
    aliceDb.collection("users").doc(BOB_UID).collection("memories").doc("mem_2").set({
      userId: BOB_UID,
      category: "Personal",
      title: "Hack",
      details: "Injected",
      dateAdded: 1700000000000,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );
});

test("Owner can create, update, list, and delete MemoryRecord; shadow fields and createdAt mutation rejected", async () => {
  const aliceDb = getDb(testEnv.authenticatedContext(ALICE_UID));
  const memRef = aliceDb.collection("users").doc(ALICE_UID).collection("memories").doc("mem_1");

  await assertSucceeds(
    memRef.set({
      userId: ALICE_UID,
      category: "Preference",
      title: "Chai time",
      details: "Likes masala chai at 5 PM",
      dateAdded: 1700000000000,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );

  // Valid update preserving createdAt
  await assertSucceeds(
    memRef.update({
      title: "Evening Chai",
      updatedAt: serverTimestamp(),
    })
  );

  // Shadow update with ghost field must fail
  await assertFails(
    memRef.update({
      isAdmin: true,
      updatedAt: serverTimestamp(),
    })
  );

  // Overwriting immutable userId must fail
  await assertFails(
    memRef.update({
      userId: BOB_UID,
      updatedAt: serverTimestamp(),
    })
  );

  // Invalid ID poisoning (>128 or invalid chars) must fail
  await assertFails(
    aliceDb.collection("users").doc(ALICE_UID).collection("memories").doc("bad id!").set({
      userId: ALICE_UID,
      category: "Fact",
      title: "Bad ID",
      details: "Invalid",
      dateAdded: 1700000000000,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );

  await assertSucceeds(aliceDb.collection("users").doc(ALICE_UID).collection("memories").get());
  await assertSucceeds(memRef.delete());
});

test("Owner can create ChatRecord, NoteRecord, and RoutineRecord cleanly", async () => {
  const aliceDb = getDb(testEnv.authenticatedContext(ALICE_UID));
  const userDoc = aliceDb.collection("users").doc(ALICE_UID);

  await assertSucceeds(
    userDoc.collection("chats").doc("chat_1").set({
      userId: ALICE_UID,
      sender: "USER",
      text: "Hello Jasmine",
      timestamp: 1700000000000,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );

  await assertSucceeds(
    userDoc.collection("notes").doc("note_1").set({
      userId: ALICE_UID,
      title: "Grocery",
      content: "Milk and Tea",
      isVoiceNote: true,
      tag: "Home",
      timestamp: 1700000000000,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );

  await assertSucceeds(
    userDoc.collection("routines").doc("routine_1").set({
      userId: ALICE_UID,
      title: "Good Morning",
      triggerPhrase: "good morning",
      description: "Tell weather and reminders",
      icon: "wb_sunny",
      isEnabled: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  );
});
