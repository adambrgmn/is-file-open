import test from 'ava';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';

import isFileOpen from '../src/index';

const open = promisify(fs.open);
const close = promisify(fs.close);

test('Module: isFileOpen (open file)', async t => {
  const filePath = path.resolve(__dirname, '../README.md');
  const fd = await open(filePath, 'r+');

  const should = 'Should return true if file is open';
  const result = await isFileOpen(filePath);

  t.is(result.isOpen, true, should);
  await close(fd);
});

test('Module: isFileOpen (closed file)', async t => {
  const filePath = path.resolve(__dirname, '../package.json');
  const should = 'Should return false if file is not open';
  const result = await isFileOpen(filePath);

  t.is(result.isOpen, false, should);
});

test('Module: isFileOpen (non existing file)', async t => {
  const filePath = path.resolve(__dirname, '../false-file.txt');
  const should = 'Should throw an error if the file does not exist';

  try {
    await isFileOpen(filePath);
    t.fail(should);
  } catch (e) {
    t.truthy(e.message.includes('No such file or directory'), should);
  }
});

test('Module: isFileOpen (directory)', async t => {
  const filePath = path.resolve(__dirname, '..');
  const should = 'Should return true if dir is in use';
  const result = await isFileOpen(filePath);

  t.is(result.isOpen, true, should);
});
