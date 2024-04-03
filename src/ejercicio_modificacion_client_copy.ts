import net from 'net';
const client = net.connect({port: 60300});

client.on('data', (dataJSON) => {
  const message = JSON.parse(dataJSON.toString());

  if (message.type === 'watch') {

    console.log(`Connection established: watching file ${message.file}`);

    console.log(`First command wc:\nLines: ${message.lines},\nWords: ${message.words},\nCharacters: ${message.characters}\n`);


  } else if (message.type === 'change') {

    console.log(`Command wc:\nLines: ${message.lines},\nWords: ${message.words},\nCharacters: ${message.characters}\n`);


  } else {

    console.log(`Message type ${message.type} is not valid`);

  }
});