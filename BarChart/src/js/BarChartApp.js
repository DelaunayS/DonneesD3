/*Déclarations des variables*/
const dataUrl ='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'

let dataJson  //stocke les données du fichier json
let dateAndvalue //tableau avec les dates et valeurs du GDP

let yScale,xScale

const margin={top: 50, right: 30, bottom: 10, left: 70},
width=800,
height=600

/*Zone du svg Container*/ 
let svgContainer = d3.select('#graphContainer')

const drawSvgContainer = () =>{
    svgContainer.attr("width", width)
                .attr("height", height)  
}

/*Definit les propriétes des échelles des axes x et y*/
const propertyScales = () =>{

    /*Tableau avec les GDP comme données*/
    let gdpArray = dateAndvalue.map( (item) => {
        return (item[1])
    })

    /*Echelle des y*/    
    
    yScale=d3.scaleLinear()
                    .domain([0, d3.max(gdpArray)])          
                    .range([height-margin.top,margin.bottom]);    

    /*Tableau avec les années comme données*/
    let yearArray = dateAndvalue.map( (item) => {
        return new Date(item[0])
    })

    /*Echelle des x*/    
    
    xScale=d3.scaleTime()
                    .domain([d3.min(yearArray),d3.max(yearArray)])
                    .range([margin.left,width-margin.right]); 
}
            
/*Dessine toutes les barres rectangulaires du graphique*/
const drawBars = () =>{

    /*gestion des barres*/
    svgContainer.selectAll('rect')
                .data(dateAndvalue)
                .enter()
                .append('rect')
                .attr('class','bar')
                .attr('width',((width-margin.left-margin.right)/dateAndvalue.length))
                .attr('data-date', (item) => {
                    return item[0]
                })
                .attr('data-gdp', (item) => {
                    return item[1]   
                })
                .attr('height', (item) => {
                    return yScale(item[1])
                })
                .attr('x', (item,index) => {
                    return xScale(index)
                })
                .attr('y', (item) => {
                    return ((height-margin.top)-yScale(item[1]))
                })
                .on('mouseover',(event,item) =>{
                    
                    tooltip.transition()
                            .style('opacity',0.9)
                            .style('top', (event.pageY-margin.top-margin.bottom)+'px')
                            .style('left', (event.pageX+10)+'px') 
                            
                    tooltip.html(
                        item[1]+' Billion(s)'
                        +"</br>"
                        +afficheDate(item[0])
                    )                          
                      
                    document.querySelector('#tooltip').setAttribute('data-date',item[0])
                })
                .on('mouseout', (item) => {
                    tooltip.transition()
                            .style('opacity',0)
                })
}

/*Crée le titre des axes*/
const nameAxes =() =>{
    
    /*titre axe des y*/
    svgContainer.append('text')
                .attr('transform','rotate(-90)')
                .attr('x',(-height)/2)
                .attr('y',margin.right/2)
                .style('font-size',16)
                .text('Produit intérieur brut en billions de $')

    /*titre axe des x*/
    svgContainer.append('text')                
                .attr('x',width/2)
                .attr('y',height-margin.bottom/2)
                .style('font-size',16)
                .text('Année')
}

/*Crée les axes x et y*/
const createAxes = () =>{

    let xAxis=d3.axisBottom(xScale)
    let yAxis=d3.axisLeft(yScale)

    svgContainer.append("g")
                .call(xAxis)
                .attr('id','x-axis')
                .attr('transform','translate(0,'+(height-margin.top)+')')

    svgContainer.append("g")
                .call(yAxis)
                .attr('id','y-axis')
                .attr('transform','translate('+(margin.left)+',0)')     
}

/*récupération et utilisation des données dataJson*/
d3.json(dataUrl).then(function(dataJson){   
   
    dateAndvalue=dataJson.data 
    drawSvgContainer()
    propertyScales()
    drawBars ()
    nameAxes ()
    createAxes()
})  

/*Info bulle*/
const tooltip=d3.select('body')
                .append('div')
                .attr('id','tooltip')               
                .style("opacity", 0)
                
/*Affichage de la date dans l'info bulle*/
const afficheDate=(dateString)=>{
    let date = dateString.toString().split("-");
    if (date[1]==='01'){
        return (date[0]+" trimestre 1")
    }
    else if (date[1]==='04'){
        return (date[0]+" trimestre 2")
    }
    else if (date[1]==='07'){
        return (date[0]+" trimestre 3")
    }
    else {
        return (date[0]+" trimestre 4")
    }
}
