const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

(async () => {
  try {
    const db = await open({
      filename: './cmi.sqlite.db',
      driver: sqlite3.Database
    });
    // The position to change every user location to
    // <world_name>:<x>:<y>:<z>:<pitch>:<yaw>
    const spawnPos = 'world:275:202:242:69:-278';
    // The world to look for • Change this to the world you need to remove homes and locations from
    const world = 'world_nether';
    // Get every user from the database
    const users = await db.all('SELECT * FROM users');
    for (const user of users) {
      let needsChange = false;
      let { id, username, LogOutLocation, DeathLocation, TeleportLocation, Homes } = user;
      // Did the user logout in the world?
      if (LogOutLocation && LogOutLocation.includes(world)) {
        LogOutLocation = spawnPos;
        needsChange = true;
      }
      // Did the user die in the world?
      if (DeathLocation && DeathLocation.includes(world)) {
        DeathLocation = spawnPos;
        needsChange = true;
      }
      // Is the users last teleport location in the world?
      if (TeleportLocation && TeleportLocation.includes(world)) {
        TeleportLocation = spawnPos;
        needsChange = true;
      }
      // Does the user have any active homes?
      if (Homes && Homes.includes(world)) {
        // Remove all homes in the world
        Homes = Homes.split(';').filter((home) => !home.includes(world)).join(';');
        needsChange = true;
      }
      // Prepare the UPDATE statement for the user with the new locations and homes
      if(needsChange) {
        const stmt = await db.prepare('UPDATE users SET LogOutLocation = @logout, DeathLocation = @death, TeleportLocation = @tp, Homes = @homes WHERE id = @id');
        await stmt.bind({ '@logout': LogOutLocation, '@death': DeathLocation, '@tp': TeleportLocation, '@homes': Homes, '@id': id});
        await stmt.run();
        await stmt.finalize();
        console.log(`Update finished for ${username}`);
      }
    }
    await db.close();
  } catch (err) {
    // Log any errors
    console.log(err);
  }
})();
