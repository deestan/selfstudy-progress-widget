function insertHeightLines(numTiers, parentId) {
  var parent = document.getElementById(parentId);
  var bbox = parent.parentElement.getBBox();
  var height = bbox.height;
  var lineDistance = height / (numTiers - 1);
  for (var i=0; i < numTiers; i++) {
    var y = (i * height) / (numTiers - 1);
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("stroke", "#ffffff");
    line.setAttribute("stroke-width", 2);
    line.setAttribute("x1", 0);
    line.setAttribute("y1", y);
    line.setAttribute("x2", 10);
    line.setAttribute("y2", y);
    parent.appendChild(line);
  }
  console.log(parent);
}

function insertBlobs(blobs, numTiers, parentId) {
  var parent = document.getElementById(parentId);
  var bbox = parent.parentElement.getBBox();

  var tierHeight = bbox.height / (numTiers - 1);
  function tierTop(tierIdx) { return (numTiers - tierIdx - 1) * tierHeight; }

  var genXseed = 0;
  function genX() {
    var xPositions = 10;
    genXseed = genXseed % xPositions;
    var margin = bbox.width / 10;
    var insideWidth = bbox.width - 2 * margin;
    return ((genXseed++ + 1) * insideWidth) / (xPositions - 1);
  }
  
  for (var i=0; i < blobs.length; i++) {
    var blob = blobs[i];
    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    var cy = tierTop(blob.tier) - blob.tierNormalizedY * tierHeight;
    circle.setAttribute("cx", genX());
    circle.setAttribute("cy", cy);
    circle.setAttribute("r", 5 * (numTiers - blob.maxTier + 1));
    circle.setAttribute("fill", "#ffffff");
    parent.appendChild(circle);
  }
}

insertHeightLines(5, "heightLines");
testBlobs = [
  { tier: 0, maxTier: 1, tierNormalizedY: 0.2 },
  { tier: 3, maxTier: 3, tierNormalizedY: 0.2 },
  { tier: 0, maxTier: 0, tierNormalizedY: 0.0 },
  { tier: 2, maxTier: 3, tierNormalizedY: 0.9 },
  { tier: 3, maxTier: 4, tierNormalizedY: 0.2 },
  { tier: 3, maxTier: 5, tierNormalizedY: 0.2 }
];
insertBlobs(testBlobs, 5, "blobs");
