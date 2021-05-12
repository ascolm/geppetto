import * as ChromeLauncher from 'chrome-launcher';

export default function chromeLauncher (url: string) {
  throw new Error();
  return ChromeLauncher.launch({
    startingUrl: url
  });
}
