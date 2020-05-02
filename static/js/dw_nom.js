//116th Congress
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

/* 
Media Scalar

json_ref = "../testtable.json"

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

json_ref = "../mainmediaorgs3.json"



d3.json(json_ref).then((data) => {
    var plot_width = 750;
    var plot_height = 750;
    var margin_l = 100;
    var margin_r = 100;
    marker_size = data.map(d=> d.std_err*1.4); // x-axis units
    xaxis_start = -1;
    xaxis_stop = 1;

    function createTrace(dict, d_name, d_color){
        var trace = {
            x: dict.map(d => d.nominate_dim1),
            y: dict.map(d => d.nominate_dim2),
            hovertext: dict.map(d=> "Website: "+d.Site+'<br>'+"Count: "+d.count
            + "<br>" + "Dim1 Standard Error: " + d.std_err),
            type: "scatter",
            mode: 'markers',
            marker: {color: d_color},
            name: d_name
        }
        return trace
    }

    myPlot = document.getElementById('media_dw_focused'),
        //DEFAULT VIEW
        media_trace = createTrace(data, 'Media', 'Green')


        error_trace = createTrace(data, 'Dim1 Standard Error', '#90EE90')
        error_trace.marker.size = marker_size.map(s=>s*(plot_width-
            margin_l - margin_r)/(xaxis_stop-xaxis_start))
        
        error_trace.hoverinfo = 'skip'
        error_trace.visible = true

        //ADJUSTED FOR NEUTRAL TWITTER BIAS
        let twt_bias = {x: 0.104, y: 0.133}

        adj_trace = JSON.parse(JSON.stringify(media_trace))

        adj_trace.x = adj_trace.x.map(s => s+twt_bias.x)
        adj_trace.y = adj_trace.y.map(s => s+twt_bias.y)
        adj_trace.visible = false

        adj_error = JSON.parse(JSON.stringify(error_trace))
        adj_error.x = adj_error.x.map(s => s+twt_bias.x)
        adj_error.y = adj_error.y.map(s => s+twt_bias.y)

        adj_error.hoverinfo = 'skip'
        adj_error.visible = false

        //DEM Trace
        dem_trace = createTrace(data, 'Democrats','blue')
        dem_trace.x = data.map(d => d.dem1)
        dem_trace.y = data.map(d => d.dem2)
        dem_trace.visible = false
        
        dem_marker_size = data.map(d=> d.dem_err*1.4);
        dem_error = JSON.parse(JSON.stringify(dem_trace))
        dem_error.marker.color = 'light blue'
        dem_error.name = 'Democrat Standard Error'
        dem_error.marker.size = dem_marker_size.map(s=>s*(plot_width-
            margin_l - margin_r)/(xaxis_stop-xaxis_start))

        //GOP Trace
        gop_trace = createTrace(data, 'Republicans','red')
        gop_trace.x = data.map(d => d.gop1)
        gop_trace.y = data.map(d => d.gop2)
        gop_trace.visible = false
        
        gop_marker_size = data.map(d=> d.dem_err*1.4);
        gop_error = JSON.parse(JSON.stringify(gop_trace))
        gop_error.marker.color = 'light blue'
        gop_error.name = 'Republican Standard Error'
        gop_error.marker.size = gop_marker_size.map(s=>s*(plot_width-
            margin_l - margin_r)/(xaxis_stop-xaxis_start))


        //TRACES
        var traces = [error_trace, media_trace, adj_error,adj_trace,
                        dem_error, dem_trace, gop_error, gop_trace]

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
            legend: {x: .75, y:1},
            updatemenus: [{
                y: 0.8,
                yanchor: 'top',
                buttons: [{
                    method: 'restyle',
                    args: ['visible', [true, true, false, false, false, false,
                                        false, false]],
                    label: 'Overall'
                },
                {
                    method: 'restyle',
                    args: ['visible', [false, false, true, true, false, false,
                                        false, false]],
                    label: 'Neutral Control'
                },
                {
                    method: 'restyle',
                    args: ['visible', [false, false, false, false, true, true,
                                        false, false]],
                    label: 'Democrats-Only'
                },
                {
                    method: 'restyle',
                    args: ['visible', [false, false,false,false,false,false,
                                        true, true]],
                    label: 'Republicans-Only'
                }
            ]
            }]
        };

    Plotly.newPlot("media_dw_focused", traces, layout)

    //Scales Error Circles
    myPlot.on("plotly_relayout", function(eventdata) {
        var update = []
        if (eventdata["xaxis.range[1]"] !== undefined) {
        console.log('If: ', eventdata['xaxis.range[1]'])

        update = marker_size.map(s=>
                s * (plot_width - margin_l - margin_r) /
                (eventdata["xaxis.range[1]"] - eventdata["xaxis.range[0]"]))
        }
        else {
        console.log('Else: ', eventdata['xaxis.range[1]'])

        update = marker_size.map(s=>s*(plot_width-
            margin_l - margin_r)/(xaxis_stop-xaxis_start))
        };
    //Does not rescale Dem or GOP error
      Plotly.restyle("media_dw_focused", "marker.size", [update], [0]);

    });
})
