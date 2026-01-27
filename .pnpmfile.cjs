const fs = require('fs');
const path = require('path');

const josuiPath = path.resolve(__dirname, '../josui/packages');
const useLocalPackages = fs.existsSync(josuiPath) && !process.env.CI && !process.env.VERCEL;

// Define local overrides here instead of package.json to avoid lockfile issues
const localOverrides = {
  '@josui/core': 'link:../josui/packages/core',
  '@josui/core-web': 'link:../josui/packages/core-web',
  '@josui/react': 'link:../josui/packages/react',
  '@josui/tailwind': 'link:../josui/packages/tailwind',
  '@josui/tokens': 'link:../josui/packages/tokens',
};

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
