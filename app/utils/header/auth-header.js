/** @param localStorage */
export function authHeader(localStorage) {
    let user = JSON.parse(localStorage.getItem('user'));
    return (user && user.token) ? {'Authorization': 'Bearer' + user.token} : {};
}