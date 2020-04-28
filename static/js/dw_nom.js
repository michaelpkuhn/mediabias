json_ref = "../HS116_members.json"

d3.json(json_ref).then((data) => {
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
        title: {
            text: "DW NOMINATE 116th Congress"
        },
        yaxis: {title: "Inter-Party Differences Spectrum"},
        xaxis: {title: "Liberal-Conservative Spectrum"},
        hovermode:'closest'
    }

    Plotly.newPlot("dw", data, layout)
})

json_ref = "../testtable.json"

d3.json(json_ref).then((data) => {
    
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