

module.exports = {
    apps: [
        {
            name: "question server",
            script: "main.js",
            instances: 2,
            autorestart: true,
            exec_mode : "cluster"
        }
    ]
}