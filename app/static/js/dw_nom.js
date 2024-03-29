//116th Congress
json_ref = "static/js/data/HS116_members.json"

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
            text: "DW NOMINATE 116th Congress",
            font:{
                family: 'Times, serif'
            }
        },
        yaxis: {title: "Inter-Party Differences Spectrum"},
        xaxis: {title: "Liberal-Conservative Spectrum"},
        hovermode:'closest',
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis:
            {
                gridcolor: 'rgba(217, 211, 189, 1)'
            },
        yaxis:
        {
            gridcolor: 'rgba(217, 211, 189, 1)'
        }
    }

    var config = {responsive: true}
    
    Plotly.newPlot("dw", data, layout, config)
})

json_ref = "static/js/data/mainmediaorgs3.json"

function deep_copy(v1){
    v2 = JSON.parse(JSON.stringify(v1))
    return v2
}

d3.json(json_ref).then((data) => {
    var plot_width = 750+150;
    var plot_height = 750;
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
            x: -0.375,
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

        var background_shapes = [{layer: 'below',
        xref: 'paper',
        yref: 'paper',
        x0: 0,
        x1: 0.2,
        y0: 0,
        y1: 1,
        type: 'rect',
        opacity: 0.75,
        //visible: false,
        visible: true,        
        fillcolor: 'blue'},
       {layer: 'below',
        xref: 'paper',
        yref: 'paper',
        x0: 0.2,
        x1: 0.4,
        y0: 0,
        y1: 1,
        type: 'rect',
        opacity: 0.75,
        //visible: false,
        visible: true,
        fillcolor: 'lightblue'},
       {layer: 'below',
        xref: 'paper',
        yref: 'paper',
        x0: 0.4,
        x1: 0.6,
        y0: 0,
        y1: 1,
        type: 'rect',
        opacity: 0.75,
        //visible: false,
        visible: true,
        fillcolor: 'grey'},
       {layer: 'below',
        xref: 'paper',
        yref: 'paper',
        x0: 0.6,
        x1: 0.8,
        y0: 0,
        y1: 1,
        type: 'rect',
        opacity: 0.75,
        //visible: false,
        visible: true,
        fillcolor: 'pink'},
       {layer: 'below',
        xref: 'paper',
        yref: 'paper',
        x0: 0.8,
        x1: 1,
        y0: 0,
        y1: 1,
        type: 'rect',
        opacity: 0.75,
        //visible: false,
        visible: true,
        fillcolor: 'red'}]

        var layout = {
            width: plot_width,
            height: plot_height,
            margin: {l: margin_l, r: margin_r},
            title: {
                text: "DW NOMINATE Media",
                font:{
                    family: 'Times, serif'
                }
            },
            paper_bgcolor: 'rgb(247,241,219)',
            plot_bgcolor: 'rgb(247,241,219)',
            yaxis: {title: "Inter-Party Differences Spectrum",
                    range: [-1,1],
                    gridcolor: 'rgba(217, 211, 189, 1)'
                },
            xaxis: {title: "Liberal-Conservative Spectrum",
                    range: [-1,1],
                    gridcolor: 'rgba(217, 211, 189, 1)'
                },
            hovermode:'closest',
            legend: {x: -0.4, y:1},
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            updatemenus: [{
                x: -0.1,
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
            },
        {  
            x: -0.1,
            y: 0.875,
            yanchor: 'top',
            //type: 'buttons',
            buttons: [
                {args: ['shapes', []],
                label: 'Background Off',
                method: 'relayout'},
                {args: ['shapes', background_shapes],
                label: 'Background On',
                method: 'relayout'}
            ]
        }],
            annotations: def_annotation,
            shapes: background_shapes.map(function(d){
                d.visible = false;
                return (d)
            }
                )
        };
        
    
    Plotly.newPlot("media_dw_focused", traces, layout)

    // function updateShapes(x1, x2){
    //     x1 = (x1+1)/2;
    //     x2 = (x2+1)/2;
    //     console.log('x1', x1, 'x2', x2)
    //     //console.log(myPlot.layout.shapes)
    //     shapes_list = myPlot.layout.shapes
    //     let i = 0;
    //     for (shape of shapes_list){
    //         console.log(i)
    //         i += 1;
    //         diff1 = shape.x0 - x1 + (0.2*i)
    //         diff2 = shape.x1 - x2 + (0.2*i)
            
    //         console.log('x1 difference', shape.x0 - x1)
    //         console.log('x2 difference', shape.x1 - x2)
            

    //     }
    // }

    //Scales Error Circles
    myPlot.on("plotly_relayout", function(eventdata) {
        //console.log('relayout')
        var update = []
        let x1 = eventdata['xaxis.range[0]']
        let x2 = eventdata['xaxis.range[1]']

        if (x2 !== undefined) {
        console.log('If. x1', x1, 'x2', x2)

        update = marker_size.map(s=>
                s * (plot_width - margin_l - margin_r) /
                (x2 - x1))
        if (myPlot.layout.shapes[0].visible && (x1 != -1 | x2 == 1)){
            shapeUpdate = myPlot.layout.shapes.map(function(d){
                d.visible = false;
                return (d)
            });
            myPlot.layout.shapes = shapeUpdate
        }
        else if (!myPlot.layout.shapes[0].visible && (x1 === -1 | x2 === 1)){
            shapeUpdate = myPlot.layout.shapes.map(function(d){
                d.visible = true;
                return (d)
            });
            myPlot.layout.shapes = shapeUpdate;
        }
        }
        else {
        
        if(eventdata.shapes){
            shapeUpdate = eventdata.shapes.map(function(d){
                    d.visible = true;
                    return (d)
                });
            myPlot.layout.shapes = shapeUpdate;
            console.log(shapeUpdate)
        }
        else{
            console.log('Else. x1', x1, 'x2', x2)

            update = marker_size.map(s=>s*(plot_width-
                margin_l - margin_r)/(xaxis_stop-xaxis_start))
        }
        };
    //Does not rescale Dem or GOP error
      Plotly.restyle("media_dw_focused", "marker.size", [update], [0]);
      

    });
})