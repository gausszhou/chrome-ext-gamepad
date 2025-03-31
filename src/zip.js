import gulp from 'gulp'
import zip from 'gulp-zip'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const manifest = require('../build/manifest.json')
const packageJson = require('../package.json')

gulp
  .src('build/**', { encoding: false })
  .pipe(zip(`${packageJson.name.replaceAll(' ', '-')}-${manifest.version}.zip`))
  .pipe(gulp.dest('package'))
