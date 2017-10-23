import {Gulpclass, Task, SequenceTask} from "gulpclass";

const gulp = require("gulp");
const mocha = require("gulp-mocha");
const shell = require("gulp-shell");

@Gulpclass()
export class GulpFile
{
    /**
     * Runs typescript files compilation.
     */
    @Task()
    compile()
    {
        return gulp.src("package.json", {read: false})
            .pipe(shell(["tsc"]));
    }

    // -------------------------------------------------------------------------
    // Run tests tasks
    // -------------------------------------------------------------------------

    @Task("mocha")
    mocha()
    {
        return gulp.src('build/test/**/*.js', {read: false})
            .pipe(mocha({
                bail: true
            }));
    }

    /**
     * Compiles the code and runs tests + makes coverage report.
     */
    @SequenceTask()
    test()
    {
        return ["compile", "mocha"];
    }
}
