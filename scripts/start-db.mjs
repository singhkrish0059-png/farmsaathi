import EmbeddedPostgres from "embedded-postgres";

async function startDb() {
  const pg = new EmbeddedPostgres({
    databaseDir: "./.postgres-data",
    user: "postgres",
    password: "password",
    port: 5432,
    persistent: true,
    autoRehydrateSymlinks: true
  });

  console.log("Initializing PostgreSQL cluster...");
  await pg.initialise();
  console.log("Starting PostgreSQL server...");
  await pg.start();
  try {
    console.log("Creating database farmsaathi...");
    await pg.createDatabase("farmsaathi");
    console.log("Database farmsaathi created successfully.");
  } catch (err) {
    console.log("Database creation notice:", err.message);
  }
  console.log("READY: PostgreSQL is running on port 5432");

  // Keep process alive indefinitely
  setInterval(() => {}, 60000);
}

startDb().catch((err) => {
  console.error("Failed to start PostgreSQL:", err);
  process.exit(1);
});
