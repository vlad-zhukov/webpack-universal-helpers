import execa from 'execa';
import webpack from 'webpack';

export default function watchServer({webpackConfig, bundlePath, cwd}) {
    let webpackCompileCount = 0;
    let serverStartCount = 0;
    let serverProcess;

    function startServer() {
        serverStartCount += 1;
        console.log(`Server start ${serverStartCount}...`);
        serverProcess = execa('node', [bundlePath], {cwd});
        serverProcess.stdout.pipe(process.stdout);
        serverProcess.stderr.pipe(process.stderr);
    }

    function stopServer() {
        if (serverProcess) {
            serverProcess.kill();
        }
    }

    const compiler = webpack(webpackConfig);

    compiler.plugin('compile', () => {
        webpackCompileCount += 1;
        console.log(`Webpack compile ${webpackCompileCount}...`);
    });

    const watcher = compiler.watch({}, (errors, stats) => {
        stopServer();
        if (errors || stats.hasErrors()) {
            console.error(`${stats.toString('errors-only')}\n`);
        }
        else {
            startServer();
        }
    });

    function exit() {
        watcher.close();
        stopServer();
    }

    ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT', 'exit', 'uncaughtException'].forEach(event => process.on(event, exit));
}
