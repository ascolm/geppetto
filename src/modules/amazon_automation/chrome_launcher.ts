import * as ChromeLauncher from 'chrome-launcher';

export default function chromeLauncher (url: string): Promise<ChromeLauncher.LaunchedChrome> {
  return ChromeLauncher.launch({
    startingUrl: url
  });
}
