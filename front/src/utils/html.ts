// import { sanitize } from 'dompurify'

export function createMarkup(dirty) {
    // return { __html: sanitize(dirty) };
    return { __html: dirty };
}


export function downloadFile(url, filename) {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}