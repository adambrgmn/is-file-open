import { spawn } from 'child_process';

const createDataCollector = () => {
  const data = [];

  return {
    add(d) {
      data.push(d.toString().trim());
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

      if (stderrData.length > 0) {
        const err = new Error(stderrData[0]);
        err.fullMessage = stderrData.join('\n');
        return reject(err);
      }

      return resolve(stdoutData.join('\n'));
    });
  });

const splitLine = line => line.split(/\s+/g);
const numToNum = input => {
  if (input.includes(',')) return input;
  const num = parseFloat(input, 10);
  return Number.isNaN(num) ? input : num;
};
const linesToObject = fields => line =>
  line.reduce(
    (acc, e, i) => Object.assign({}, acc, { [fields[i].toLowerCase()]: e }),
    {}
  );

const processLsofOutput = lsofOutput => {
  const [fieldsLine, ...fileLines] = lsofOutput.trim().split('\n');

  const fields = splitLine(fieldsLine);
  const files = fileLines
    .map(splitLine)
    .map(l => l.map(numToNum))
    .map(linesToObject(fields));

  return files;
};

export default async filePath => {
  const lsofOutput = await lsof(filePath);
  const processes = processLsofOutput(lsofOutput);

  return { isOpen: processes.length > 0, processes };
};
