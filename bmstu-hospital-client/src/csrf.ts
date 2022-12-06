export function getCsrfToken(): string {
    return document.cookie.split('csrftoken=').pop()?.split(';').shift() as string
}

export function removeCsrfCookie() {
    document.cookie = 'csrftoken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}