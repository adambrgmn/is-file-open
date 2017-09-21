import { spawn } from 'child_process';

const createDataCollector = () => {
  let data = '';

  return {
    add(d) {
      data += d.toString();
    },
    get() {
      return data;
    },
  };
};

const lsof = filePath =>
  new Promise((resolve, reject) => {
    const proc = spawn('lsof', [filePath]);
    const stdout = createDataCollector();
    const stderr = createDataCollector();

    proc.stdout.on('data', stdout.add);
    proc.stderr.on('data', stderr.add);

    proc.on('close', () => {
      const stdoutData = stdout.get();
      const stderrData = stderr.get();

      if (stderrData) {
        const err = new Error(stderrData.split('\n')[0]);
        return reject(err);
      }

      return resolve(stdoutData);
    });
  });

const splitLine = line => line.split(/\s+/g);
const linesToObject = fields => line =>
  line.reduce((acc, e, i) => Object.assign({}, acc, { [fields[i]]: e }), {});

const processLsofOutput = lsofOutput => {
  const [fieldsLine, ...fileLines] = lsofOutput.trim().split('\n');

  const fields = splitLine(fieldsLine);
  const files = fileLines.map(splitLine).map(linesToObject(fields));

  return files;
};

export default async filePath => {
  const lsofOutput = await lsof(filePath);
  const processes = processLsofOutput(lsofOutput);

  return { isOpen: processes.length > 0, processes };
};
