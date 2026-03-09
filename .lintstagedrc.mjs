export default {
  // Format staged files with prettier on every commit
  '*.{ts,tsx,js,json,css,md}': (files) =>
    `npx prettier --write ${files.map((f) => `"${f}"`).join(' ')}`,
}
