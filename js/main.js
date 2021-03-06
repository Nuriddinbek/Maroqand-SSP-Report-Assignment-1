/*main.js - Phliker 1.0.0*/

// DOM event for specified function
$(document).ready(function(){
          /*click event when button with id searchbtn_ctr clicked*/
          $("#searchbtn_top, #searchbtn_ctr").click(function(){
            var searchText = "";
            
            // checking whether input text is empty or not 
            // assign given input as tag for api
            if ($(this).attr('id') ==='searchbtn_top' && $('#inputTextTop').val()!=="") {
              searchText = $('#inputTextTop').val();
            }
            else if($(this).attr('id')==='searchbtn_ctr' && $('#inputTextCenter').val()!==""){
              searchText = $('#inputTextCenter').val();
            }
            else{
              window.alert("Enter key word!!!");
              return false;
            }
          
            // account api key
            var flickrKey = "b0b3c93c14c637413c1e76143110dd6f";
            var per_page_display = 40;
            // apiData object declaration for api request
            var apiData = {
              tags: searchText,
              nojsoncallback: 1,
              format: "json",
              api_key: flickrKey,
              per_page: 40
            }
              // api url with given api key, tag name and per page quantity
            var flickrApiUrl = "https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key="+flickrKey+"&tags="+searchText+"&format=json&per_page="+per_page_display;
            
            
            // print flickr api url in console for debugging
            console.log(flickrApiUrl);
          // temporary cumulative variable for retrived images
            var imgList = "";
          // data of image retreived from flickr api
            var imgData = {
              id: 'id',
              secret: 'secret',
              server: 'server',
              farm: 'farm'
            }
            try{
              $.ajax({
            // analyze response for getting image data from api using ajax 
              url: flickrApiUrl,
              type: 'GET',
              data: apiData,
              dataType: 'json',
              

              success: function (response) {
                console.log(response);
                // check for the API key validation
                if(response.photos === undefined){
                    if(response.message === undefined){
                      window.alert("Error!");
                      return false;
                    }
                  window.alert(response.message);
                  return false;
                }
                if(response.photos.photo.length===0){
                  window.alert("Not enough content")
                  $('#inputTextTop').val(null);
                  $('#inputTextCenter').val(null);
                  return false;
                }
                // fetching photo parameters by extracting json objects parameters
              // - details of photo
                $.each(response.photos.photo, function (i, data) {
                  imgData.id = data.id;
                  imgData.secret = data.secret;
                  imgData.server=data.server;
                  imgData.farm = data.farm;
                  // dynamic div  element for each image
                  imgList = imgList + '<div class="inner-div"><img id = "' + imgData.id + '" src = "https://farm'+imgData.farm+'.staticflickr.com/'+imgData.server+'/'+imgData.id+'_'+imgData.secret+'_n.jpg"/></div>';
       
                }),

                // append retreived div photos to outer div             
                $(".outer-div").html(imgList);
                // event click function for image
                imgSelect(flickrKey);  

              },
              
              error: function( error ){
                window.alert("Error " + error);
                return false;
                
              },
              complete: function( xhr, status){
                //console.log(xhr);
                //console.log(status);
                console.log("The request is completed");
              }               
            });
            }
            catch(err){
              window.alert('not reachable');
            }

      });
});
// image click function 
function imgSelect(flickrKey){
      $("img").click(function(){

    // default image info  
    var singleImgInfo = {
      country: 'undefined',
      region: 'undefined',
      place: 'undefined',
      title: 'undefined'
    }
      // get selected image id and source
      var clickedID = $(this).attr('id');
      var clickedImgSrc = $(this).attr('src');
      var imgSource = "";

      // replace _n small size(320 on longest side) with _z mdeium size(640 on longest side)
      clickedImgSrc = clickedImgSrc.replace("_n", "_z");
      // api url for image info
      var singleUrl = "https://api.flickr.com/services/rest/?&method=flickr.photos.getInfo&api_key="+flickrKey+"&photo_id="+clickedID;
      // jquery method for JSON object 
      $.getJSON(singleUrl, {
        nojsoncallback: 1,
        format: "json"
      })
      .done(function(data){
        // log out retreived json data object
        console.log(data);
        /*imgSource = '<div id="myModal" class="modal"><img class=modal-content id="img01"/><div id="caption"><p id="title"><strong>Title: </strong></p>'+
        '</ br><p id="country"><strong>Country: </strong></p></ br><p id="region"><strong>Region: </strong></p></ br><p id="place">'+
        '<strong>Place: </strong></p></div></div>';
        $(".nextdiv").html(imgSource);*/
        // fetch element with id 
      var modal = document.getElementById('singleImgModal');
      var modalImg = document.getElementById("clickedImg");
      var captionText = document.getElementById("caption");
      
      modal.style.display = "block";
      modalImg.src = clickedImgSrc;
      

      // get the info about selected image using api url:
      // first check for the existance of each details of photo
      // details of photo: title, country, region, place 
      if(data.photo.location!==undefined){
        if(data.photo.location.country!==undefined){
          singleImgInfo.country = data.photo.location.country._content;
        }
        if(data.photo.location.region!==undefined){
          singleImgInfo.region = data.photo.location.region._content;
        }
        if(data.photo.location.county!==undefined){
          singleImgInfo.place = data.photo.location.county._content;
        }
          
      }
      if(data.photo.title!==undefined){
          singleImgInfo.title = data.photo.title._content;
      }  
      
      // change content of paragraphs using jquery selectors
      $("p.title").text(singleImgInfo.title);
      $("p.country").text(singleImgInfo.country);
      $("p.region").text(singleImgInfo.region);
      $("p.place").text(singleImgInfo.place);
      
      /*captionText.innerHTML = "Country: " + singleImgInfo.country + "\n"
    + "Region: " + singleImgInfo.region + "\n"
    + "Place: " + singleImgInfo.place + "\n"
    + "Title: " + singleImgInfo.title;*/                                     
      
      // when body clicked hide modal
      $('body').click(function() {
        modal.style.display = "none"; 
       });
      });
    });  
}
/*
function getSizeSmall(id, key){
  var Url = "https://api.flickr.com/services/rest/?&method=flickr.photos.getSizes&api_key="+key+"&photo_id="+id;
  var source = "";
  $.getJSON(Url, {
        nojsoncallback: 1,
        format: "json"
  })
  .done(function(data){
    console.log(data.sizes.size[4].source);
    source = data.sizes.size[4].source;
  })
  .fail(function(error){
  });
  return source;
}
*/
