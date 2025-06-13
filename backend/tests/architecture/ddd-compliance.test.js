const fs = require('fs');
const path = require('path');

describe('DDD Architecture Compliance', () => {
  const srcPath = path.join(__dirname, '../../src');

  test('should have correct DDD layer structure', () => {
    const expectedDirs = [
      'domain',
      'application',
      'infrastructure',
      'presentation'
    ];

    expectedDirs.forEach(dir => {
      const dirPath = path.join(srcPath, dir);
      expect(fs.existsSync(dirPath)).toBe(true);
    });
  });

  test('domain layer should contain entities and value objects', () => {
    const domainPath = path.join(srcPath, 'domain');

    expect(fs.existsSync(path.join(domainPath, 'entities'))).toBe(true);
    expect(fs.existsSync(path.join(domainPath, 'valueObjects'))).toBe(true);
    expect(fs.existsSync(path.join(domainPath, 'repositories'))).toBe(true);
    expect(fs.existsSync(path.join(domainPath, 'services'))).toBe(true);
  });

  test('application layer should contain use cases', () => {
    const appPath = path.join(srcPath, 'application');

    expect(fs.existsSync(path.join(appPath, 'useCases'))).toBe(true);
  });

  test('infrastructure layer should contain implementations', () => {
    const infraPath = path.join(srcPath, 'infrastructure');

    expect(fs.existsSync(path.join(infraPath, 'repositories'))).toBe(true);
    expect(fs.existsSync(path.join(infraPath, 'parsers'))).toBe(true);
    expect(fs.existsSync(path.join(infraPath, 'services'))).toBe(true);
    expect(fs.existsSync(path.join(infraPath, 'di'))).toBe(true);
  });

  test('presentation layer should contain controllers and routes', () => {
    const presPath = path.join(srcPath, 'presentation');

    expect(fs.existsSync(path.join(presPath, 'controllers'))).toBe(true);
    expect(fs.existsSync(path.join(presPath, 'routes'))).toBe(true);
    expect(fs.existsSync(path.join(presPath, 'middleware'))).toBe(true);
  });

  test('should not have old structure files', () => {
    const oldFiles = [
      'services',
      'controllers',
      'routes',
      'config'
    ];

    oldFiles.forEach(dir => {
      const dirPath = path.join(srcPath, dir);
      expect(fs.existsSync(dirPath)).toBe(false);
    });
  });
});
