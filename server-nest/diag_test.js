const { exec } = require('child_process');
const fs = require('fs');

console.log('Running tests...');
exec('npm run test:e2e -- test/enrollment.e2e-spec.ts', { encoding: 'utf8' }, (error, stdout, stderr) => {
    console.log('Test finished. Writing output...');
    const content = `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}\n\nERROR:\n${error}`;
    fs.writeFileSync('diag_out.txt', content, 'utf8');
    console.log('Done.');
});
