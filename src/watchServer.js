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
    const wServer = {
        serverProcess: null,
        watcher: null,

        restartServer() {
            const isDead = this.isDead();

            if (options.hot && !isDead) {
                return;
            }

            this.stopServer();

            console.log(`Starting server...`);
            this.serverProcess = execa('node', [options.bundlePath], {cwd: options.cwd, stdio: 'inherit'});
        },

        stopServer() {
            if (!this.isDead()) {
                this.serverProcess.kill();
                this.serverProcess.killed = true;
            }
        },

        isDead() {
            if (!this.serverProcess) {
                return true;
            }

            return !!(this.serverProcess.killed || this.serverProcess.exitCode);
        },

        startWebpack() {
            const compiler = compile(options.webpackConfig);

            compiler.plugin('compile', () => {
                console.log(`Compiling...`);
            });

            this.watcher = compiler.watch({ignored: /node_modules/}, (error, stats) => {
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

                this.restartServer();
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
                process.on(event, (error) => {
                    this.stopWebpack();
                    this.stopServer();
                    if (error) {
                        console.error('ERROR', error);
                    }
                }));
        },
    };

    wServer.start();

    return wServer;
}
