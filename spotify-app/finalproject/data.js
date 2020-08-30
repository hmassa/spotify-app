// https://github.com/spotify/web-api-auth-examples/blob/master/implicit_grant/public/index.html
$(document).ready(function() {
    function getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g, 
            q = window.location.hash.substring(1);
        while ( e = r.exec(q)) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
        }

        return hashParams;
    }
                
    function displayTracks(id, data){
        var number = data.items.length;
        for (i = 0; i < number; i++) {
            var track = data.items[i];
            $("#"+id).append('<div class="holder"><img class="photo" src=' + track.album.images[0].url + '><p class="primary">' + track.name + '</p><p class="secondary">' + track.album.name + '</p></div>');
        }
                
    }
                
    function displayArtists(id, data){
        if (data.items.length < 10)
            var number = data.items.length;
        else 
            var number = 10;
        
        for (i = 0; i < number; i++) {
            var artist = data.items[i];
            $("#"+id).append('<div class="holder"><img class="photo" src=' + artist.images[0].url + '><p class="primary">' + artist.name + '</p><p class="secondary">' + artist.followers.total + ' followers</p></div>');
        }
                    
    }
    
    function displayGenre(id, data){
        var genreList = [];
        var number = data.items.length;
        var count = 0, flag = 0;
        
        for (var i = 0; i < number; i++){
            var genres = data.items[i].genres;
            var len = genres.length;
            for (var j = 0; j < len; j++){
                for (var k = 0; k < count; k++){
                    flag = 0;
                    if (genres[j] == genreList[k].genre){
                        flag = 1;
                        genreList[k].occurences++;
                        break;
                    }
                }
                if (flag == 0) {
                    var hold = {"genre": genres[j], "occurences": 1}
                    count = genreList.push(hold);
                }     
            }
        }
        
        console.log(genreList);

        var first = 0, second = 0, third = 0;
        var name1 = "", name2 = "", name3 = "";
        
        for (i = 0; i < count; i++){
            if (genreList[i].occurences > third){
                if (genreList[i].occurences > second){
                    if (genreList[i].occurences > first){
                        third = second;
                        name3 = name2;
                        second = first;
                        name2 = name1;
                        first = genreList[i].occurences;
                        name1 = genreList[i].genre;
                    } else {
                        third = second;
                        name3 = name2;
                        second = genreList[i].occurences;
                        name2 = genreList[i].genre;
                    }
                } else {
                    third = genreList[i].occurences;
                    name3 = genreList[i].genre;
                }
            }
        }
        $("#"+id).html("<p>1. " + name1 + "</p><p>2. " + name2 + "</p><p>3. " + name3 + "</p>");
    }
                
    var stateKey = 'spotify_auth_state';
            
    var params = getHashParams();
    var access_token = params.access_token,
    state = params.state,
    storedState = localStorage.getItem(stateKey);
                        
    if (access_token && (state == null || state !== storedState)) {
        window.location = 'http://ec2-3-134-97-105.us-east-2.compute.amazonaws.com/finalproject';
        alert('There was an error during the authentication. Please try again later.');
    } else {
      //localStorage.removeItem(stateKey);
        if (access_token) {
            // ger user's account info
            $.ajax({
                url: 'https://api.spotify.com/v1/me',
                type: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
                    $("#welcome").html('Welcome, ' + response.display_name + '! Check out the information we\'ve gathered from your Spotify listening history.'); 
                }
            });
                        
            // get all-time top tracks
            $.ajax({
                url: 'https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10',
                type: 'GET',
                headers: {
                'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
                    displayTracks('all-tracks', response);
                }
            });
                        
            //get all-time top artists
            $.ajax({
                url: 'https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50',
                type: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
                    displayArtists('all-artists', response);
                    //console.log(response);
                    displayGenre('top-genre', response);
                }
            });
                
            // get this months top tracks
            $.ajax({
                url: 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10',
                type: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
                    displayTracks('month-tracks', response);
                }
            });
                        
            // get this months top artists
            $.ajax({
                url: 'https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50',
                type: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
                    displayArtists('month-artists', response);
                    displayGenre('month-genre', response);
                }
            });
            
            
        } else {
            window.location = 'http://ec2-3-134-97-105.us-east-2.compute.amazonaws.com/finalproject';
        }
    }
});