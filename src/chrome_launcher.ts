import * as ChromeLauncher from 'chrome-launcher';

export default function chromeLauncher (url: string) {
  return ChromeLauncher.launch({
    startingUrl: url
  });
}
