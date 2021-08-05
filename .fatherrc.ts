import { readdirSync } from 'fs';
import { join } from 'path';

const headPkgs = [''];
const tailPkgs = [''];
//@ts-ignore
const otherPkgs = readdirSync(join(__dirname, 'packages')).filter(
  (pkg) => pkg.charAt(0) !== '.' && !headPkgs.includes(pkg) && !tailPkgs.includes(pkg)
);

export default {
  target: 'browser',
  cjs: { type: 'rollup', lazy: false },
  disableTypeCheck: true,
  pkgs: [...headPkgs, ...otherPkgs, ...tailPkgs]
};
