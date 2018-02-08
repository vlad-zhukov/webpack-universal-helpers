import execa from 'execa';
import webpack from 'webpack';

// Webpack compile in a try-catch
function compile(config) {
    let compiler;
    try {
        compiler = webpack(config);
    }
    catch (error) {
        console.error('Failed to compile.', error);
        process.exitCode = 1;
    }
    return compiler;
}

export default function watchServer(options) {
    let serverProcess = null
    let watcher = null

    function isDead() {
        if (!serverProcess) {
            return true;
        }

        return !!(serverProcess.killed || serverProcess.exitCode);
    }

    function restartServer() {
        if (options.hot && !isDead()) {
            return;
        }

        stopServer();

        console.log(`Starting server...`);
        serverProcess = execa('node', [options.bundlePath], {cwd: options.cwd, stdio: 'inherit'});
    }

    function stopServer() {
        if (!isDead()) {
            serverProcess.kill();
            serverProcess.killed = true;
        }
    }

    function startWebpack() {
        const compiler = compile(options.webpackConfig);

        compiler.plugin('compile', () => {
            console.log(`Compiling server...`);
        });

        watcher = compiler.watch({ignored: /node_modules/}, (error, stats) => {
            if (error) {
                console.error(error.stack || error);
                if (error.details) {
                    console.error(error.details);
                }
                return;
            }

            if (stats.hasErrors()) {
                console.error(stats.toString('minimal'));
                return;
            }

            restartServer();
        });
    }

    function stopWebpack() {
        if (watcher) {
            watcher.close();
        }
    }

    startWebpack();

    ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT', 'exit', 'uncaughtException'].forEach(event =>
        process.on(event, (error) => {
            stopWebpack();
            stopServer();
            if (error) {
                console.error('ERROR', error);
            }
        }));

    return {};
}
