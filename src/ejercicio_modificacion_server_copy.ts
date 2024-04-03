import net from 'net';
import {watchFile} from 'fs';
import fs from 'fs';
import {spawn} from 'child_process';

if (process.argv.length !== 3) {
  console.log('Please, provide a filename.');
} else if ( !fs.existsSync(process.argv[2]) ) {
  console.log('File doesnt exists.');
} else {
  const fileName = process.argv[2];
	
  net.createServer((connection) => {
    console.log('A client has connected.');
    
    const catCommand = spawn('cat', [fileName]);
    const wcCommand = spawn('wc');

    catCommand.stdout.pipe(wcCommand.stdin);
		
	  wcCommand.stdout.on('data', (data) => {
      const [lines, words, characters] = data.toString().trim().split(/\s+/);
      connection.write(JSON.stringify({'type': 'watch', 'file': fileName, 'lines': lines, 'words': words, 'characters': characters }) + '\n');
    });
    

    watchFile(fileName, (curr, prev) => {
      const catCommand = spawn('cat', [fileName]);
      const wcCommand = spawn('wc');

      catCommand.stdout.pipe(wcCommand.stdin);
      
      wcCommand.stdout.on('data', (data) => {
        const [lines, words, characters] = data.toString().trim().split(/\s+/);
        connection.write(JSON.stringify({'type': 'change', 'file': fileName, 'lines': lines, 'words': words, 'characters': characters, 'prevSize': prev.size, 'currSize': curr.size }) + '\n');
      });
    });

    connection.on('close', () => {
      console.log('A client has disconnected.');
    });
  }).listen(60300, () => {
    console.log('Waiting for clients to connect.');
  });
}
