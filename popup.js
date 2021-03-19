// Update the relevant fields with the new data.
const setDOMInfo = trailData => {
  //document.getElementById('trail_name').textContent = trailData.name;
  //document.getElementById('latitude').textContent = trailData.latitude;
  //document.getElementById('longitude').textContent = trailData.longitude;
  document.getElementById('elev_gain').textContent = Math.round(trailData.elev_gain*3.28084) + 'ft';
  //document.getElementById('length').textContent = (trailData.length*0.000621371).toFixed(2) + 'mi';
  document.getElementById('user_elevation').textContent = Math.round(trailData.user_elevation*3.28084) +'ft';
  document.getElementById('effort').textContent = trailData.effort+'%';
  document.getElementById('feels_like').textContent = (trailData.effort/100 * trailData.length*0.000621371).toFixed(2) + 'mi';

  document.getElementById('start_elev').textContent = trailData.elev_start;
  //document.getElementById('end_elev').textContent = trailData.elev_end;
  //document.getElementById('max_elev').textContent = trailData.elev_max;
  //document.getElementById('min_elev').textContent = trailData.elev_min;
};

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', () => {
  // ...query for the active tab...
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tabs => {
    // ...and send a request for the DOM info...
    chrome.tabs.sendMessage(
        tabs[0].id,
        {from: 'popup', subject: 'DOMInfo'},
        // ...also specifying a callback to be called 
        //    from the receiving end (content script).
        setDOMInfo);
  });
});

chrome.runtime.onMessage.addListener((msg, sender, response) => {
    // First, validate the message's structure.
    if ((msg.from === 'alltrails') && (msg.subject === 'weatherData')) {

        var dates = [];
        var avgs = [];
        var highs = [];
        var lows = [];

        //strip dates and temp data into individual arrays
        for (var i = msg.data.length - 1; i >= 0; i--) {
            dates.push(msg.data[i].date.slice(5));
            avgs.push(msg.data[i].avgtempF);
            highs.push(msg.data[i].maxtempF);
            lows.push(msg.data[i].mintempF);
        }

        var ctx = document.getElementById("chart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label: 'Averages',
                    borderColor: "orange",
                    data: avgs,
                    fill: false,
                    pointRadius: 0
                },{
                    label: 'Highs',
                    borderColor: "grey",
                    data: highs,
                    fill: false,
                    pointRadius: 0
                },{
                    label: 'Lows',
                    borderColor: "grey",
                    data: lows,
                    fill: false,
                    pointRadius: 0
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        },
                        scaleLabel: {
                             display: true,
                             labelString: 'Temp (F)',
                             fontSize: 10 
                          }
                    }]            
                },
                legend:{
                    display: false
                }
            }
        });

    }
});
