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
    // Get every user from the database
    const users = await db.all('SELECT * FROM users');
    for (const user of users) {
      let needsChange = false;
      let { id, username, LogOutLocation, DeathLocation, TeleportLocation, Homes } = user;
      // Did the user logout in the nether?
      if (LogOutLocation && LogOutLocation.includes('world_nether')) {
        LogOutLocation = spawnPos;
        needsChange = true;
      }
      // Did the user die in the nether?
      if (DeathLocation && DeathLocation.includes('world_nether')) {
        DeathLocation = spawnPos;
        needsChange = true;
      }
      // Is the users last teleport location in the nether?
      if (TeleportLocation && TeleportLocation.includes('world_nether')) {
        TeleportLocation = spawnPos;
        needsChange = true;
      }
      // Does the user have any active homes?
      if(Homes) {
        // Remove all homes in the nether
        Homes = Homes.split(';').filter((home) => !home.includes('world_nether')).join(';');
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
