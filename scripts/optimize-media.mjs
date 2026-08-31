import sharp from 'sharp';
import { execFileSync } from 'child_process';
import { createRequire } from 'module';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const sourceDir = path.join(root, 'media-src');

const require = createRequire(import.meta.url);
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;

function ffmpeg(args) {
  execFileSync(ffmpegPath, args, { stdio: ['ignore', 'ignore', 'ignore'] });
}

function source(name) {
  const file = path.join(sourceDir, name);
  return existsSync(file) ? file : null;
}

async function buildImages() {
  const jobs = [
    { input: 'sebapicture.jpg', output: 'sebapicture.webp', width: 800, quality: 82 },
    { input: 'owltuah.jpg', output: 'owltuah.webp', width: 256, quality: 80 },
  ];

  for (const job of jobs) {
    const input = source(job.input) ?? path.join(publicDir, job.input);
    if (!existsSync(input)) {
      console.log(`skip   -> ${job.input} not found`);
      continue;
    }

    await sharp(input)
      .resize(job.width, null, { withoutEnlargement: true })
      .webp({ quality: job.quality })
      .toFile(path.join(publicDir, job.output));

    console.log(`image  -> ${job.output}`);
  }

  // A native CSS cursor costs nothing to move; a JS-tracked element repaints
  // on every pointer event, which is what made scrolling feel heavy.
  const pointer = path.join(publicDir, 'PointerP1.svg');
  if (existsSync(pointer)) {
    await sharp(pointer, { density: 300 })
      .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(path.join(publicDir, 'wii-pointer.png'));
    console.log('cursor -> wii-pointer.png');
  }
}

/**
 * Animated GIFs decode frame-by-frame on the main thread, which stalls the
 * whole page. H.264 hands that work to the GPU instead.
 */
function buildChannelVideo() {
  const input = source('climate-first-bank.gif');
  if (!input) {
    console.log('skip   -> climate-first-bank.gif not found');
    return;
  }

  if (existsSync(path.join(publicDir, 'climate-first-bank.mp4')) && !process.env.FORCE) {
    console.log('skip   -> climate-first-bank.mp4 already built (FORCE=1 to rebuild)');
    return;
  }

  ffmpeg([
    '-y',
    '-i', input,
    '-vf', 'fps=15,scale=720:-2:flags=lanczos',
    '-c:v', 'libx264',
    '-crf', '27',
    '-preset', 'slow',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    '-an',
    path.join(publicDir, 'climate-first-bank.mp4'),
  ]);
  console.log('video  -> climate-first-bank.mp4');

  ffmpeg([
    '-y',
    '-i', input,
    '-vframes', '1',
    '-vf', 'scale=720:-2',
    path.join(publicDir, 'climate-first-bank-poster.webp'),
  ]);
  console.log('poster -> climate-first-bank-poster.webp');
}

function buildSoundEffects() {
  const jobs = [
    { input: 'hover.wav', output: 'sfx-hover.mp3' },
    { input: 'select.wav', output: 'sfx-select.mp3' },
    { input: 'section.wav', output: 'sfx-section.mp3' },
    { input: 'home.wav', output: 'sfx-home.mp3' },
  ];

  for (const job of jobs) {
    const input = source(job.input);
    if (!input) {
      console.log(`skip   -> ${job.input} not found`);
      continue;
    }

    ffmpeg([
      '-y',
      '-i', input,
      '-ac', '1',
      '-b:a', '96k',
      path.join(publicDir, job.output),
    ]);
    console.log(`audio  -> ${job.output}`);
  }
}

await buildImages();
buildChannelVideo();
buildSoundEffects();
