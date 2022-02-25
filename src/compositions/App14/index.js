const apis = {}

function importAll(r) {
    r.keys().forEach(key => {
        let name = key.replace(/^(\.\/)(.+)(.js)$/, '$2')
        apis[name] = r(key).default
    });
}

importAll(require.context('./', false, /^((?!index).)+.js$/))

export default function App14Compositions() {
    return apis
}