module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    pluginOptions: {
        electronBuilder: {
            externals: ['serialport'],
            nodeIntegration: true
        }
    }
}