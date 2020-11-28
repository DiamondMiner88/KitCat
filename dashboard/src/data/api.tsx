import Cookies from 'universal-cookie';

export const REDIRECT_URL = `https://discord.com/api/oauth2/authorize?client_id=${
    process.env.REACT_APP_CLIENT_ID
}&redirect_uri=${encodeURIComponent(
    process.env.REACT_APP_DISCORD_REDIRECT_URL as string
)}&response_type=code&scope=guilds%20identify`;

// interface UserData {}
let _user_data: any | null = null;

export function getUser(): void {
    if (_user_data) return resolve(_user_data);

        const cookies = new Cookies();
        if (cookies.get('access-token')) {
            fetch('https://discord.com/api/users/@me', {
                headers: {
                    authorization: `Bearer ${cookies.get('access-token')}`,
                },
            })
                .then((res) => res.json())
                .then((json) => {
                    _user_data = json;
                    console.log(json);
                    resolve(json);
                })
                .catch((e) => reject(e));
        } else reject(null);
}
