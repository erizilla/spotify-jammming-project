const clientId = '7163ad05d3184211b0f7dd91ad86f2f9';
const redirectUri = 'http://localhost:3000/';
let accessToken;


const Spotify = {
    getAccessToken() {
        if (accessToken) {
            
            return accessToken;        
        }

        //check for access token match

        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        
        if (accessTokenMatch && expiresInMatch) {

            accessToken = accessTokenMatch[1];
            
            let expiresIn = Number(expiresInMatch[1]);
            //this clears the parameters, allowing us to grab a new access token when it expires

            window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
            // This clears the parameters, allowing us to grab a new access token when it expires.
            window.history.pushState('Access Token', null, '/');
            
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;

            window.location = accessUrl;
           
        }
    },

    search(term) {
        let accessToken = Spotify.getAccessToken();
        
        
        return fetch(`https://api.spotify.com/v1/search?q=${term}&type=track`,
        { headers : {
            Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                cover: track.album.images[2].url,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        });
        
    },

    savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;

        return fetch('https://api.spotify.com/v1/me', 
        { headers: headers
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {   
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: name })
            }).then(response => response.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`, 
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: trackUris })
                })
            })
        })
    },
    //adding existing user playlists
    getUserPlaylists() {
        

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;

        return fetch('https://api.spotify.com/v1/me', 
        { headers: headers
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {   
            userId = jsonResponse.id;
            
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: 'GET',
            }).then(response => response.json()
            ).then(jsonResponse => {
                if (!jsonResponse.playlist) {
                    return [];
                }
                return jsonResponse.playlist.items.map(playlist => ({
                                playlistId: playlist.id,
                                playlistName: playlist.name
                            }));
            })
        })
    },

    getUserInfo() {
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;

        return fetch('https://api.spotify.com/v1/me', {
            method: 'GET',
            headers: headers
        }).then(response => {
            //console.log(response.json());
            return response.json();
        }).then(jsonResponse => {
            userId = jsonResponse.id;
            return jsonResponse.map(user => ({
                name: user.display_name,
            }))
        })
    }

    
};

export default Spotify;