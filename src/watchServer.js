import execa from 'execa';
import webpack from 'webpack';

// Webpack compile in a try-catch
function compile(config) {
    let compiler;
    try {
        compiler = webpack(config);
    } catch (e) {
        console.error('Failed to compile.', e);
        process.exitCode = 1;
    }
    return compiler;
}

export default function watchServer(options) {
    const wServer = {
        webpackCompileCount: 0,
        serverStartCount: 0,
        serverProcess: null,
        watcher: null,

        startServer() {
            if (!this.serverProcess || !options.hot) {
                this.serverStartCount += 1;
                console.log(`Server start ${this.serverStartCount}...`);
                this.serverProcess = execa('node', [options.bundlePath], {cwd: options.cwd, stdio: 'inherit'});
            }
        },

        stopServer() {
            if (this.serverProcess) {
                this.serverProcess.kill();
            }
        },

        startWebpack() {
            const compiler = compile(options.webpackConfig);

            compiler.plugin('compile', () => {
                this.webpackCompileCount += 1;
                console.log(`Webpack compile ${this.webpackCompileCount}...`);
            });

            this.watcher = compiler.watch({ignored: /node_modules/}, (err, stats) => {
                if (!options.hot) {
                    this.stopServer();
                }

                if (err) {
                    console.error(err.stack || err);
                    if (err.details) {
                        console.error(err.details);
                    }
                    return;
                }

                if (stats.hasErrors()) {
                    console.error(stats.toString('minimal'));
                    return;
                }

                this.startServer();
            });
        },

        stopWebpack() {
            if (this.watcher) {
                this.watcher.close();
            }
        },

        start() {
            this.startWebpack();

            ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT', 'exit', 'uncaughtException'].forEach(event =>
                process.on(event, (err) => {
                    if (err) {
                        console.error('ERROR', err);
                    }
                    this.stopWebpack();
                    this.stopServer();
                }));
        },
    };

    wServer.start();

    return wServer;
}
