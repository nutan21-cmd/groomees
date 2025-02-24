b = a.map(book => book.author);

const distinctB = [...new Set(b)];

for (var i = 0; i < distinctB.length; i++) {
  var filt = a.filter(x => x.author == distinctB[i]);
  console.log(distinctB[i] + " books= " + filt.length);
}

for (var i = 0; i < distinctB.length; i++) {
  var filt = a.filter(x => x.author == distinctB[i]);
  if (filt.length > 15) console.log(i);
}
