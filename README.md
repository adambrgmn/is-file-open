# is file open

> Checks if a file is used by another process on macOS using [lsof](https://danielmiessler.com/study/lsof/)

**NOTE** that this module is only tested on macOS 10.12 and that the implementation might not work on Linux (I've bee told that `lsof` requires `sudo`) and most certainly not on Windows either.

## Installation

```sh
# with npm
$ npm install is-file-open

# with yarn
$ yarn add is-file-open
```


## Requirements

This module is using `async/await` and a few ES2015 features therefore Node 8 or above is required.  
This module is only tested on macOS 10.12 and might not work on Linux, and will most likely not work on Windows.


## Usage

```js
const path = require('path');
const isFileOpen = require('is-file-open');

async function run() {
  const filePath = path.resolve(__dirname, 'README.md');
  const fileData = await isFileOpen(filePath);
  console.log(fileData);
}
```

This will output something similar to this:

```js
{
  isOpen: true,
  processes: [
    {
      command: 'Atom\\x20H',
      pid: 774,
      user: 'username',
      fd: '28r',
      type: 'REG',
      device: '1,2',
      'size/off': 70,
      node: 90901449,
      name: '/Users/username/README.md',
    },
    {
      command: 'node',
      pid: 11576,
      user: 'username',
      fd: '12u',
      type: 'REG',
      device: '1,2',
      'size/off': 70,
      node: 90901449,
      name: '/Users/username/README.md',
    },
  ],
};
```

The processes property is a straight translation from from the output of `lsof`.


## API

### isFileOpen(filePath)

| Arg | Type | Required |
|:----|:-----|:---------|
| filePath | `string` | :heavy_multiplication_x: |

`isFileOpen(filePath)` is an async function that eventually will resolve an object with data concerning the file.

| Prop | Type |
|:-----|:-----|
| isOpen | `boolean` |
| processes | `Array<process>` |

#### type process

`isOpenFile` resolves information about each process currently accessing the file.

| Prop | Type |
|:-----|:-----|
| command | `string` |
| pid | `number` |
| user | `string` |
| fd | `string` |
| type | `string` |
| device | `string` |
| 'size/off' | `number` |
| node | `number` |
| name | `string` |


## License

MIT © [Adam Bergman](https://github.com/adambrgmn)
