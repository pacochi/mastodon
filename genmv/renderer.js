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

const { RgbaEmitter } = require('musicvideo-generator');
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

const particle =
  particleLimit === undefined &&
  argv.particleAlpha === undefined && argv.particleColor === undefined ?
    undefined :
    { limit: particleLimit, alpha: argv.particleAlpha, color: argv.particleColor };

const lightLeaks =
  argv.lightleaksAlpha === undefined && argv.lightleaksInterval === undefined ?
    undefined :
    { alpha: argv.lightleaksAlpha, interval: argv.lightleaksInterval };

const spectrum =
  argv.spectrumMode === undefined && argv.spectrumAlpha === undefined &&
  argv.spectrumColor === undefined ?
    undefined :
    { mode: argv.spectrumMode, alpha: argv.spectrumAlpha, color: argv.spectrumColor };

const text =
  argv.textAlpha === undefined && argv.textColor === undefined ?
  argv.textTitle === undefined && argv.textSub === undefined ?
    undefined :
    { alpha: argv.textAlpha, color: argv.textColor, title: argv.textTitle, sub: argv.textSub };

const imageSrc = argv.image === undefined ? undefined : url.format({
  pathname: path.resolve(argv.image),
  protocol: 'file:',
});

webFrame.registerURLSchemeAsPrivileged('file');

Promise.all([
  fetch(url.format({ pathname: path.resolve(argv._[0]), protocol: 'file:' }))
    .then(response => response.arrayBuffer())
    .then(audio => (new AudioContext).decodeAudioData(audio)),
  new Promise((resolve, reject) => {
    if (imageSrc) {
      const image = new Image;

      image.onerror = reject;
      image.onload = () => resolve(image);
      image.src = imageSrc;
    } else {
      resolve();
    }
  }),
]).then(([audio, image]) => {
  const emitter = new RgbaEmitter(audio, {
    image,
    blur,
    particle,
    lightLeaks,
    spectrum,
    text,
  });

  // XXX: The documentation says the default value of end is true, but somehow
  // it does not trigger finish event nor flush the stream. Ignore it.
  emitter.pipe(process.stdout, { end: false });

  emitter.on('end', () => process.stdout.end(close));
  emitter.on('error', console.error);
  process.stdout.on('error', console.error);
});
