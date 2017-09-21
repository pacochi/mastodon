onerror = message => {
  console.error(message);
  close();

  return true;
};

onunhandledrejection = event => {
  console.error(event.reason);
  close();

  return true;
};

const { RgbaEmitter } = require('albumart-video');
const { webFrame } = require('electron');
const path = require('path');
const url = require('url');
const yargs = require('yargs');
const { argv } = yargs(location.hash.slice(1).split('&').map(decodeURIComponent));

function parseLimit(bottom, top, threshold) {
  const band = argv[bottom] === undefined && argv[top] === undefined ?
    undefined :
    { bottom: argv[bottom], top: argv[top] };

  return band === undefined && argv[threshold] === undefined ?
    undefined : { band, threshold: argv[threshold] };
}

const blurMovement = parseLimit('blurMovementBandBottom',
                                'blurMovementBandTop',
                                'blurMovementThreshold');

const blurBlink = parseLimit('blurBlinkBandBottom',
                             'blurBlinkBandTop',
                             'blurBlinkThreshold');

const blur = blurMovement === undefined && blurBlink === undefined ?
  undefined : { movement: blurMovement, blink: blurBlink };

const particleLimit = parseLimit('particleLimitBandBottom',
                                 'particleLimitBandTop',
                                 'particleLimitThreshold');

const particle = particleLimit === undefined && argv.particleColor === undefined ?
  undefined: { limit: particleLimit, color: argv.particleColor };

const spectrum =
  argv.spectrumMode === undefined && argv.spectrumColor === undefined ?
    undefined : { mode: argv.spectrumMode, color: argv.spectrumColor };

const text = argv.textTitle === undefined && argv.textSub === undefined ?
  undefined : { title: argv.textTitle, sub: argv.textSub };

const image = argv.image === undefined ? undefined : url.format({
  pathname: path.resolve(argv.image),
  protocol: 'file:',
});

webFrame.registerURLSchemeAsPrivileged('file');

fetch(url.format({ pathname: path.resolve(argv._[0]), protocol: 'file:' }))
  .then(response => response.arrayBuffer())
  .then(audio => {
    const audioContext = new AudioContext;
    return audioContext.decodeAudioData(audio);
  })
  .then(audio => {
    const emitter = new RgbaEmitter(audio, { image, blur, particle, spectrum, text });

    // XXX: The documentation says the default value of end is true, but somehow
    // it does not trigger finish event nor flush the stream. Ignore it.
    emitter.pipe(process.stdout, { end: false });

    emitter.on('end', () => process.stdout.end(close));
    emitter.on('error', console.error);
    process.stdout.on('error', console.error);
  });
