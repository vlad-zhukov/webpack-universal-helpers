import execa from 'execa';
import webpack from 'webpack';

export default {
    options: null,

    webpackCompileCount: 0,
    serverStartCount: 0,
    serverProcess: null,
    watcher: null,

    startServer() {
        this.serverStartCount += 1;
        console.log(`Server start ${this.serverStartCount}...`);
        this.serverProcess = execa('node', [this.options.bundlePath], {cwd: this.options.cwd, stdio: 'inherit'});
    },

    stopServer() {
        if (this.serverProcess) {
            this.serverProcess.kill();
        }
    },

    startWebpack() {
        const compiler = webpack(this.options.webpackConfig);

        compiler.plugin('compile', () => {
            this.webpackCompileCount += 1;
            console.log(`Webpack compile ${this.webpackCompileCount}...`);
        });

        this.watcher = compiler.watch({ignored: /node_modules/}, (err, stats) => {
            this.stopServer();

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

    start(options) {
        this.options = options;
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
