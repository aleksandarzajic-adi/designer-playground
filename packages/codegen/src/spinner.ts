const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const INTERVAL_MS = 80;

export interface Spinner {
  succeed: (msg?: string) => void;
  fail: (msg?: string) => void;
  stop: (msg?: string) => void;
  update: (label: string) => void;
}

const isTTY = () => Boolean(process.stdout.isTTY);

export function startSpinner(initialLabel: string): Spinner {
  if (!isTTY()) {
    process.stdout.write(`… ${initialLabel}\n`);
    return {
      succeed: (m) => process.stdout.write(`✔ ${m ?? initialLabel}\n`),
      fail: (m) => process.stderr.write(`✖ ${m ?? initialLabel}\n`),
      stop: (m) => (m ? process.stdout.write(`${m}\n`) : undefined),
      update: (l) => process.stdout.write(`… ${l}\n`),
    };
  }

  let label = initialLabel;
  let frame = 0;
  const render = () => {
    process.stdout.write(`\r\x1b[2K${FRAMES[frame]} ${label}`);
    frame = (frame + 1) % FRAMES.length;
  };
  render();
  const handle = setInterval(render, INTERVAL_MS);

  const clear = () => {
    clearInterval(handle);
    process.stdout.write('\r\x1b[2K');
  };

  return {
    succeed: (m) => {
      clear();
      process.stdout.write(`\x1b[32m✔\x1b[0m ${m ?? label}\n`);
    },
    fail: (m) => {
      clear();
      process.stderr.write(`\x1b[31m✖\x1b[0m ${m ?? label}\n`);
    },
    stop: (m) => {
      clear();
      if (m) process.stdout.write(`${m}\n`);
    },
    update: (l) => {
      label = l;
    },
  };
}
