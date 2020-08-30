$(document).ready(function() {
    // https://github.com/spotify/web-api-auth-examples/blob/master/implicit_grant/public/index.html
    var stateKey = 'spotify_auth_state';
                
    function generateRandomString(length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };
    
    $("#logo").click(function() {
        //user-recently-played
        var scopes = 'user-read-private user-top-read';
        var my_client_id = 'e8f1b2d34ec14ac584c0f485e5fda645';
        var redirect_uri = 'http://ec2-3-134-97-105.us-east-2.compute.amazonaws.com/finalproject/dashboard.html';
        
        var state = generateRandomString(16);
        localStorage.setItem(stateKey, state);
    
        var url = 'https://accounts.spotify.com/authorize'
        url += '?response_type=token'
        url += '&client_id=' + encodeURIComponent(my_client_id);
        url += '&scope=' + encodeURIComponent(scopes);
        url += '&redirect_uri=' + encodeURIComponent(redirect_uri);
        url += '&state=' + encodeURIComponent(state);
                    
        window.location = url;
    });
});