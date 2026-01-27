const fs = require('fs');
const path = require('path');

const rootPkg = require('./package.json');
const localOverrides = rootPkg.pnpm?.localOverrides || {};

const josuiPath = path.resolve(__dirname, '../josui/packages');
const useLocalPackages = fs.existsSync(josuiPath);

module.exports = {
  hooks: {
    readPackage(pkg) {
      if (!useLocalPackages) return pkg;

      for (const [name, localPath] of Object.entries(localOverrides)) {
        if (pkg.dependencies?.[name]) {
          pkg.dependencies[name] = localPath;
        }
      }

      return pkg;
    },
  },
};
