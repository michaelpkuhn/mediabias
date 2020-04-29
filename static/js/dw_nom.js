json_ref = "../HS116_members.json"

d3.json(json_ref).then((data) => {
    var plot_width = 750;
    var plot_height = 750;
    var margin_l = 100;
    var margin_r = 100;
    dem = data.filter(d => d.party_code === 100);
    gop = data.filter(d => d.party_code === 200);
    ind = data.filter(d => d.party_code != 100 && d.party_code != 200)
    
    function createTrace(dict, d_name, d_color){
        var trace = {
            x: dict.map(d => d.nominate_dim1),
            y: dict.map(d => d.nominate_dim2),
            hovertext: dict.map(d=> d.bioname),
            type: "scatter",
            mode: 'markers',
            marker: {color: d_color},
            name: d_name
    
        }
        return trace
    }

    dem_trace = createTrace(dem, 'Democrat', 'blue')
    gop_trace = createTrace(gop, 'Republican', 'red')
    ind_trace = createTrace(ind, 'Independent', 'grey')

    var data = [dem_trace, gop_trace, ind_trace]

    var layout = {
        width: plot_width,
        height: plot_height,
        margin: {l: margin_l, r: margin_r},
        title: {
            text: "DW NOMINATE 116th Congress"
        },
        yaxis: {title: "Inter-Party Differences Spectrum"},
        xaxis: {title: "Liberal-Conservative Spectrum"},
        hovermode:'closest'
    }

    Plotly.newPlot("dw", data, layout)
})

/* json_ref = "../testtable.json"

d3.json(json_ref).then((data) => {
    var plot_width = 750;
    var plot_height = 750;
    var margin_l = 100;
    var margin_r = 100;
    function createTrace(dict, d_name, d_color){
        var trace = {
            x: dict.map(d => d.nominate_dim1),
            y: dict.map(d => d.nominate_dim2),
            hovertext: dict.map(d=> "Website: "+d.site+'<br>'+"Count: "+d.count),
            type: "scatter",
            mode: 'markers',
            marker: {color: d_color, size: dict.map(d=>d.count/100)},
            name: d_name
    
        }
        console.log(dict.map(d=>d.size))
        return trace
    }

    media_trace = createTrace(data, 'Media', 'Green')

    var data = [media_trace]

    var layout = {
        width: plot_width,
        height: plot_height,
        margin: {l: margin_l, r: margin_r},
        title: {
            text: "DW NOMINATE Media"
        },
        yaxis: {title: "Inter-Party Differences Spectrum",
                range: [-1,1]},
        xaxis: {title: "Liberal-Conservative Spectrum",
                range: [-1,1]},
        hovermode:'closest'
    }

    Plotly.newPlot("media_dw", data, layout)
})
 */

json_ref = "../mainmediaorgs2.json"



d3.json(json_ref).then((data) => {
    var plot_width = 750;
    var plot_height = 750;
    var margin_l = 100;
    var margin_r = 100;
    marker_size = data.map(d=> d.dim1_stderr*1.4); // x-axis units
    //console.log(marker_size*2)
    xaxis_start = -1;
    xaxis_stop = 1;

    function createTrace(dict, d_name, d_color){
        var trace = {
            x: dict.map(d => d.nominate_dim1),
            //y: dict.map(d => 0),
            y: dict.map(d => d.nominate_dim2),
            hovertext: dict.map(d=> "Website: "+d.site+'<br>'+"Count: "+d.total
            + "<br>" + "Dim1 Standard Error: " + d.dim1_stderr),
            type: "scatter",
            mode: 'markers',
            marker: {color: d_color},//, size: dict.map(d=>d.total/100)},
            name: d_name
    
        }
        //console.log(dict.map(d=>d.size))
        return trace
    }

    myPlot = document.getElementById('media_dw_focused'),
        media_trace = createTrace(data, 'Media', 'Green')

        error_trace = createTrace(data, 'Dim1 Standard Error', '#90EE90')
        error_trace.marker.size = marker_size.map(s=>s*(plot_width-
            margin_l - margin_r)/(xaxis_stop-xaxis_start))
        console.log(error_trace.marker.size)
        //NaN
        error_trace.hoverinfo = 'skip'

        var traces = [error_trace, media_trace]

        var layout = {
            width: plot_width,
            height: plot_height,
            margin: {l: margin_l, r: margin_r},
            title: {
                text: "DW NOMINATE Media"
            },
            yaxis: {title: "Inter-Party Differences Spectrum",
                    range: [-1,1]},
            xaxis: {title: "Liberal-Conservative Spectrum",
                    range: [-1,1]},
            hovermode:'closest',
            legend: {x: .75, y:1}
        };

    Plotly.newPlot("media_dw_focused", traces, layout)

    myPlot.on("plotly_relayout", function(eventdata) {
        var update = []
        if (eventdata["xaxis.range[1]"] !== undefined) {
        console.log('If: ', eventdata['xaxis.range[1]'])

        //var update = {
        //   "error_trace.marker.size": marker_size.map(s=>
        //     s * (plot_width - margin_l - margin_r) /
        //     (eventdata["xaxis.range[1]"] - eventdata["xaxis.range[0]"])
        update = marker_size.map(s=>
                s * (plot_width - margin_l - margin_r) /
                (eventdata["xaxis.range[1]"] - eventdata["xaxis.range[0]"]))
            //update.push(u)
        }
        else {
        console.log('Else: ', eventdata['xaxis.range[1]'])

        //var update = {
        //   "error_trace.marker.size": marker_size.map(s=>s*(plot_width-
        //     margin_l - margin_r)/(xaxis_stop-xaxis_start))

            update = marker_size.map(s=>s*(plot_width-
                margin_l - margin_r)/(xaxis_stop-xaxis_start))
            //update.push(u)
        };
      //console.log(upd =update)
      Plotly.restyle("media_dw_focused", "marker.size", [update], [0]);
      //console.log(error_trace.marker.size)

    });
})

// function refplot() {
//     document.getElementById("media_dw_focused");
// }

//myPlot = document.getElementById("media_dw_focused");

//refplot.on("plotly_relayout", function(eventdata) {
