function ProgressWidget(tiers, parentId) {
  var numTiers = tiers.length;

  function insertHeightLines(parentId) {
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
  }

  var blobObjects;
  function insertBlobs(blobs) {
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
    
    blobAnimations = [];
    for (var i=0; i < blobs.length; i++) {
      var blob = blobs[i];
      var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      var cy = tierTop(blob.tier) - blob.tierNormalizedY * tierHeight;
      circle.setAttribute("cx", genX());
      circle.setAttribute("cy", cy);
      circle.setAttribute("r", 5 * (numTiers - blob.maxTier + 1));
      circle.setAttribute("fill", "#ffffff");
      var animation = document.createElementNS("http://www.w3.org/2000/svg", "animate");
      animation.setAttribute("attributeName", "cy");
      animation.setAttribute("attributeType", "XML");
      animation.setAttribute("values", cy + " ; " + cy);
      animation.setAttribute("begin", "indefinite");
      animation.setAttribute("dur", "1s");
      animation.setAttribute("keySplines", "0 0.5 0 1");
      circle.appendChild(animation);
      blobAnimations.push(animation);
      parent.appendChild(circle);
    }
  }
  
  function moveBlobs() {
    for (var i=0; i < blobAnimations.length; i++) {
      var animation = blobAnimations[i];
      var y = parseInt(animation.parentElement.getAttribute("cy"), 10);
      var oldY = y;
      animation.setAttribute("calcMode", "linear");
      if (y >= 599) {
        y = ((300 * Math.random()) >> 0) + 200;
        animation.parentElement.setAttribute("r", ((1 + Math.random() * 5) >> 0) * 5);
        animation.setAttribute("calcMode", "spline");
      }
      y += 10;
      if (y > 600)
        y = 600;
      animation.setAttribute("values", oldY + " ; " + y);
      animation.beginElement();
    }
  }
  
  insertHeightLines("heightLines");

  setInterval(moveBlobs, 1000);

  return {
    insertBlobs: insertBlobs
  }
}
