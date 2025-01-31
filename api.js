export const api = {
    get(url) {
        if (url === '/lots') {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([
                        {
                            price: 16,
                            name: 'Apple',
                            description: 'Good apple',
                        },
                        {
                            price: 32,
                            name: 'Orange',
                            description: 'Good Orange',
                        },
                    ])
                }, 1500)
            })
        }
    },
}
