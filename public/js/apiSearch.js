// var keyData = "0553283685";
// $.ajax({
//   url: "https://openlibrary.org/api/books?bibkeys=ISBN:" + keyData + "&jscmd=details&callback=mycallback",
//   dataType: "jsonp",
//   success: function (data) {
//     var getData = data["ISBN:" + keyData];
//     var title = getData.details.title;
//     var author = getData.details.authors[0].name;
//     $('.title').text(title);
//     $('.author').text(author);
//   }
// });


//GMS test non final API search. rendering books in combo with test html but have not gone to printing to cats yet
// function searchBook(name) {
//   const searchQuery = document.querySelector('#search-book').value;
//   var startTime = performance.now();
//   console.log("Started Searching");
//   axios
//     .get(`http://openlibrary.org/search.json?title=${searchQuery}&limit=10`)
//     .then((response) => {
//       console.log(response.data);
//       var endTime = performance.now();
//       console.log(`Took ${endTime - startTime} milliseconds`);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

function getBooks() {
  var getAuthor = document.getElementById('author').checked
  document.getElementById('output').innerHTML = "";
  fetch("http://openlibrary.org/search.json?q=" + document.getElementById("input").value)
    .then(a => a.json())
    .then(response => {
      console.log(response);
      let userInput = document.getElementById("input").value.toLowerCase()
      let bookAmount = 0
      for (var i = 0; i < response.docs.length; i++) {
        if (bookAmount < 3) {
          try {
            if (getAuthor) {
              let lowerCaseAuthor = response.docs[i].author_name.map(author => author.toLowerCase())
              if (lowerCaseAuthor.indexOf(userInput) != -1) {
                //document.getElementById("output").innerHTML+="</h2>"+response.docs[i].author_name[0]+"<br><img src='http://covers.openlibrary.org/b/isbn/"+response.docs[i].isbn[0]+"-M.jpg'><br>";
                document.getElementById("output").innerHTML += "<h3>" + response.docs[i].author_name[0] + "</h3><h5>" + response.docs[i].title + "</h5><br><img src='http://covers.openlibrary.org/b/isbn/" + response.docs[i].isbn[0] + "-M.jpg'><br>";
                bookAmount++
              }
            } else {
              let lowerCaseTitle = response.docs[i].title.toLowerCase().replace(/[^\w\s\']|_/g, "").replace(/\s+/g, " ");
              console.log(lowerCaseTitle)
              if (lowerCaseTitle.includes(userInput)) {
                document.getElementById("output").innerHTML += "<h3>" + response.docs[i].author_name[0] + "</h3><h5>" + response.docs[i].title + "</h5><br><img src='http://covers.openlibrary.org/b/isbn/" + response.docs[i].isbn[0] + "-M.jpg'><br>";
                bookAmount++
              }
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          break
        }
      }
    })
}

//GMS moving onto new API search method

// module.exports = searchBook();