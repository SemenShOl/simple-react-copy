const scripts = document.querySelectorAll('script[text="shishkin"]')
console.log('scripts:', scripts)

function convertCodeToBrowser(code) {
    return Babel.transform(code, {
        presets: ['stage-2'],
    }).code
}

scripts.forEach(async (script) => {
    fetch(script.src)
        .then((response) => {
            return response.text()
        })
        .then((code) => {
            const convertedCode = convertCodeToBrowser(code)
            const scriptElement = document.createElement('script')
            scriptElement.textContent = convertedCode
            document.body.append(scriptElement)
        })
})
