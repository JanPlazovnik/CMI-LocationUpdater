# CMI-LocationUpdater
Replaces any nether location to a predefined value and removes nether homes to prepare for 1.16 update on servers using CMI.

**Be sure to backup your database file before you run this.** The script should work without a problem but it has not been extensively tested.


## Requirements
You need to have a recent version of Node.js installed to run this.

## Installation

Use git to clone the repository.

```bash
git clone https://github.com/JanPlazovnik/CMI-LocationUpdater.git
```
Install the depencies.
```bash
npm install
```

## Usage
Place the `cmi.sqlite.db` database file inside the root folder and edit the coordinates for the new location inside `index.js`.
```js
// The position to change every user location to
// <world_name>:<x>:<y>:<z>:<pitch>:<yaw>
const spawnPos = 'world:275:202:242:69:-278';
```  
Run the script using
```bash
npm run start
```

After it's done, you can close the script and upload the database file to your server.
## Contributing
Pull requests are welcome but please open an issue first to discuss what you would like to change.
