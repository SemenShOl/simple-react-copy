export const api = {
    get(url) {
        if (url === '/lots') {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([
                        {
                            id: 1,
                            price: 16,
                            name: 'Apple',
                            description: 'Good apple',
                            isActive: false,
                        },
                        {
                            id: 2,
                            price: 32,
                            name: 'Orange',
                            description: 'Good Orange',
                            isActive: true,
                        },
                    ])
                }, 1500)
            })
        }
    },
}
