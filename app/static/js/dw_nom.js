//116th Congress
json_ref = "static/js/data/HS116_members.json"

d3.json(json_ref).then((json_data) => {
    var ctx = document.getElementById('dw_chart').getContext('2d');

    let dem = json_data.filter(d => d.party_code === 100);
    let gop = json_data.filter(d => d.party_code === 200);
    let ind = json_data.filter(d => d.party_code != 100 && d.party_code != 200)
    
    var myChart = new Chart(ctx, {
        type: 'scatter',
    
        data:{
            datasets:[{
                label: 'Democrats',
                data: dem.map(d => {
                    point = {};
                    point.x = d.nominate_dim1; 
                    point.y = d.nominate_dim2;
                    point.bioname = d.bioname;
                    return point}),
                    backgroundColor: 'blue'
            },
            {
                label: 'Republicans',                
                data: gop.map(d => {
                    point = {};
                    point.x = d.nominate_dim1; 
                    point.y = d.nominate_dim2;
                    point.bioname = d.bioname;
                    return point}),
                    backgroundColor: 'red'
            },
            {
                label: 'Independents',                
                data: ind.map(d => {
                    point = {};
                    point.x = d.nominate_dim1; 
                    point.y = d.nominate_dim2;
                    point.bioname = d.bioname;
                    return point}),
                    backgroundColor: 'grey'
            }]
        },
        options: {
            tooltips:{
                callbacks: {
                    label: function(tooltipItem, data){
                        //console.log(data.datasets)
                        //console.log(data.datasets[0]['data'][tooltipItem['index']])
                        let item = data.datasets[tooltipItem.datasetIndex]['data'][tooltipItem.index];
                        return ['('+item.y+item.x+')',item.bioname];
                    }
                }
            }
        }
    })

   // console.log(myChart.data)
/*     var plot_width = 600;
    var plot_height = 600;
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

    Plotly.newPlot("dw", data, layout) */
})


json_ref = "static/js/data/mainmediaorgs3.json"

function deep_copy(v1){
    v2 = JSON.parse(JSON.stringify(v1))
    return v2
}

d3.json(json_ref).then((json_data) => {
    var ctx = document.getElementById('dw_media_chart').getContext('2d');

    var mediaChart = new Chart(ctx, {
        type: 'scatter',
        data:{
            datasets:[{
                label: 'default',
                data: json_data.map(d => {
                    point = {};
                    point.x = d.nominate_dim1; 
                    point.y = d.nominate_dim2;
                    point.site = d.Site;
                    return point}),
                    backgroundColor: 'green'
            }//,
        //     {
        //         label: 'Neutral Control',                
        //         data: gop.map(d => {
        //             point = {};
        //             point.x = d.nominate_dim1; 
        //             point.y = d.nominate_dim2;
        //             point.bioname = d.bioname;
        //             return point}),
        //             backgroundColor: 'red'
        //     },
        //     {
        //         label: 'Democrats Only',                
        //         data: ind.map(d => {
        //             point = {};
        //             point.x = d.nominate_dim1; 
        //             point.y = d.nominate_dim2;
        //             point.bioname = d.bioname;
        //             return point}),
        //             backgroundColor: 'grey'
        //     },
        //     {
        //     label: 'Republicans Only',                
        //     data: ind.map(d => {
        //         point = {};
        //         point.x = d.nominate_dim1; 
        //         point.y = d.nominate_dim2;
        //         point.bioname = d.bioname;
        //         return point}),
        //         backgroundColor: 'grey'
        // }
    ]
        },
        options: {
            tooltips:{
                callbacks: {
                    label: function(tooltipItem, data){
                        //console.log(data.datasets)
                        //console.log(data.datasets[0]['data'][tooltipItem['index']])
                        let item = data.datasets[tooltipItem.datasetIndex]['data'][tooltipItem.index];
                        return ['('+item.y+item.x+')',item.site];
                    }
                }
            },
            scales:{
                yAxes:[{ticks:{max:1,min:-1}}],
                xAxes:[{ticks:{max:1,min:-1}}]
            }
        }
    })

    function addData(chart, label, data) {
        chart.data.labels.push(label);
        chart.data.datasets.push(data);
        console.log(label,data)
        chart.update({easing: 'linear'});
    }
    
    function removeData(chart) {
        chart.data.labels.pop();
        chart.data.datasets.pop()
        //console.log(chart.data)
        chart.update();
        //console.log('remove')
    }
    let twt_bias = {x: 0.104, y: 0.133}

    let charts = {'default':{
            label: 'default',
            data: json_data.map(d => {
                point = {};
                point.x = d.nominate_dim1; 
                point.y = d.nominate_dim2;
                point.site = d.Site;
                return point}),
                backgroundColor: 'green'
        },
        'control':{
                label: 'control',
                data: json_data.map(d => {
                    point = {};
                    point.x = d.nominate_dim1 + twt_bias.x; 
                    point.y = d.nominate_dim2 + twt_bias.y;
                    point.site = d.Site;
                    return point}),
                    backgroundColor: 'green'
    }}

    var mySelect = document.getElementById('charts');

    mySelect.onchange = function(){
        console.log('1:',mediaChart.data)
        chart_opt = mySelect.value
        current = mediaChart.data.datasets[0].label
        if (chart_opt === current){
            console.log('True')
            return null
        }
        else{
            removeData(mediaChart)

            let data = charts[chart_opt]
            //console.log(data)
            
            addData(mediaChart, 'Media Chart', data)
            //console.log('False')
        }
        console.log('2',mediaChart.data)
    }

/*     var plot_width = 600+150;
    var plot_height = 600;
    var margin_l = 250;
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

        adj_trace = deep_copy(media_trace)

        adj_trace.x = adj_trace.x.map(s => s+twt_bias.x)
        adj_trace.y = adj_trace.y.map(s => s+twt_bias.y)
        adj_trace.visible = false

        adj_error = deep_copy(error_trace)
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
        dem_error = deep_copy(dem_trace)
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
        gop_error = deep_copy(gop_trace)
        gop_error.marker.color = 'light blue'
        gop_error.name = 'Republican Standard Error'
        gop_error.marker.size = gop_marker_size.map(s=>s*(plot_width-
            margin_l - margin_r)/(xaxis_stop-xaxis_start))


        //TRACES
        var traces = [error_trace, media_trace, adj_error,adj_trace,
                        dem_error, dem_trace, gop_error, gop_trace]

        
        var def_annotation = [{
            xref: 'paper',
            yref: 'paper',
            x: -0.55,
            xanchor: 'left',
            y: .7,
            yanchor: 'top',
            text: 'The default view',
            showarrow: false,
            width: 150,
            align: 'left'
        }]

        let control_annotation = deep_copy(def_annotation)
        control_annotation[0].text = 'Plot controlled for<br>' 
        +'calculated bias of<br>' 
        +'neutral link:<br>'
        + 'Twitter.com<br>' 
        +'dim1: 0.104<br>'+ 'dim2: 0.133<br>'

        let dem_annotation = deep_copy(def_annotation)
        dem_annotation[0].text = 'Democrat Filter'
        
        let gop_annotation = deep_copy(def_annotation)
        gop_annotation[0].text = 'Republican Filter'


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
            legend: {x: -0.55, y:1},
            updatemenus: [{
                x: -0.175,
                y: 0.8,
                yanchor: 'top',
                buttons: [{
                    method: 'update',
                    args: [{'visible': [true, true, false, false, false, false,
                                        false, false]},
                            {'annotations': def_annotation}
                                    ],
                    label: 'Overall'
                },
                {
                    method: 'update',
                    args: [{'visible': [false, false, true, true, false, false,
                                        false, false]},
                            {'annotations': control_annotation}
                                    ],
                    label: 'Neutral Control'
                },
                {
                    method: 'update',
                    args: [{'visible': [false, false, false, false, true, true,
                                        false, false]},
                            {'annotations': dem_annotation}
                                    ],
                    label: 'Democrats-Only'
                },
                {
                    method: 'update',
                    args: [{'visible': [false, false,false,false,false,false,
                                        true, true]},
                            {'annotations': gop_annotation}
                                    ],
                    label: 'Republicans-Only'
                }
            ]
            }],
            annotations: def_annotation
            // annotations: [{
            //     xref: 'paper',
            //     yref: 'paper',
            //     x: -0.2,
            //     xanchor: 'right',
            //     y: .5,
            //     yanchor: 'bottom',
            //     text: 'Standard view',
            //     showarrow: false
            // }]
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

    }); */
})
