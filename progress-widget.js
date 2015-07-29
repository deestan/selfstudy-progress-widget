function ProgressWidget(tiers, parentId) {
  var numTiers = tiers.length;
  var tierHeight;
  var allBlobs = [];

  function insertHeightLines(parentId) {
    var parent = document.getElementById(parentId);
    var bbox = parent.parentElement.getBBox();
    var height = bbox.height;
    tierHeight = height / numTiers;
    var lineDistance = tierHeight;
    for (var i=0; i < numTiers; i++) {
      var y = (i * height) / numTiers;
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
      var cy = bbox.height - getYPosition(blob);
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
      parent.appendChild(circle);

      blobAnimations.push(animation);
      allBlobs.push(blob);
    }
  }

  function getYPosition(blob) {
    var secsLeft = (blob.nextTime - Date.now()) / 1000;
    if (secsLeft < 0)
      secsLeft = 0;
    var tierIdx = null;
    for (var tierIdx=tiers.length - 1; tierIdx > 0; tierIdx--)
      if (tiers[tierIdx].startSec < secsLeft && secsLeft < tiers[tierIdx].endSec)
        break;
    var tierBaseY = tierIdx * tierHeight;
    var tierTimeSpan = tiers[tierIdx].endSec - tiers[tierIdx].startSec;
    var timePosInTierNorm = (secsLeft - tiers[tierIdx].startSec) / tierTimeSpan;
    var heightInTier = tierHeight * timePosInTierNorm;
    return tierBaseY + heightInTier;
  }
  
  function moveBlobs() {
    for (var i=0; i < allBlobs.length; i++) {
      var animation = blobAnimations[i];
      var blob = allBlobs[i];
      var y = parseFloat(animation.parentElement.getAttribute("cy"), 10);
      var oldY = y;
      y = 600 - getYPosition(blob);
      animation.setAttribute("calcMode", "linear");
      if (y < oldY) {
        animation.parentElement.setAttribute("r", ((1 + Math.random() * 5) >> 0) * 5);
        animation.setAttribute("calcMode", "spline");
      }
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
