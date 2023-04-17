document.cookie = "username=John Doe";

// Get all cookies
var cookies = document.cookie.split(";");

// Loop through cookies and print their names and values
for (var i = 0; i < cookies.length; i++) {
  var cookie = cookies[i];
  var parts = cookie.split("=");
  var name = parts[0].trim();
  var value = parts[1].trim();
  console.log(name + ": " + value);
}

pk.eyJ1IjoiYWRpdHlhNTEwIiwiYSI6ImNsZmpsbmMxbzAyMmMzeW10aGNveTY2ZWkifQ.o0pfNFXREpMQTLa12dQ7Kw