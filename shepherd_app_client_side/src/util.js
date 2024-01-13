
export function read_file_as_string(file) {
    let reader = new FileReader()
    return new Promise((resolve, reject) => {
        reader.onerror = () => {
            reject(new DOMException("Problem parsing input file."))
        }
        reader.onload = () => {
            resolve(reader.result)
        }
        reader.readAsText(file)
    })
}

export const sleep = async ms => new Promise(r => setTimeout(r, ms));