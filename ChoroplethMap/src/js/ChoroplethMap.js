/*Déclarations des variables*/
const USEducationDataUrl ='https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
const USCountyDataUrl ='https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

let USCountyData,USEducationData

let result /*pour gerer la correspondance entre les 2 bases de données*/

let legendScale

const margin={top: 10, right: 10, bottom: 10, left: 10},
width=1000,
height=600

const greens=d3.schemeGreens[6] /*gestion des différents verts*/


/*Définit le svg Container*/ 
let svgContainer = d3.select('#mapContainer')

/*Gestion de la couleur des paths*/
const pathColor = (data) =>{
  
  if (data<10){
    return (greens[0])
  }else if (data<20){
    return (greens[1])
  }else if (data<30){
    return (greens[2])
  }else if (data<40){
    return (greens[3])
  }else if (data<50){
    return (greens[4])
  }else{
    return (greens[5])
  } 
}

/*dessine les éléments contenus dans le svgContainer*/
const drawSvgContainer = () =>{
  
    svgContainer.attr("width", width)
                .attr("height", height)  
                .selectAll('path')  
                .data(USCountyData) 
                .enter()
                .append('path')
                .attr('d',d3.geoPath())
                .attr('class','county')
                .attr('data-fips',(item)=>{
                  return item['id']
                })

                /*on trouve la correspondance dans les 2 bases de données pour
                récupérer le taux de bachelier ou + */
                .attr('data-education',(itemCounty)=>{
                    result=USEducationData.find(
                     item => 
                    {return item['fips'] === itemCounty['id']}
                      )
                  return(result['bachelorsOrHigher'])
                })  

                .attr('fill',(itemCounty)=>{
                    result=USEducationData.find(
                     item => 
                    {return item['fips'] === itemCounty['id']}
                      )
                  return(pathColor(result['bachelorsOrHigher']))              
                }) 

                .on('mouseover',(event,itemCounty) =>{
                    result=USEducationData.find(
                      item => 
                    {return item['fips'] === itemCounty['id']}
                      )
                      console.log(result)

                  tooltip.transition()
                          .style('opacity',0.9)
                          .style('top', (event.pageY-margin.top-margin.bottom)+'px')
                          .style('left', (event.pageX+10)+'px') 
                          
                  tooltip.html(                     
                      result['area_name']
                      +"</br>"
                      +result['bachelorsOrHigher']+'%'   
                  )                        
                    
                 document.querySelector('#tooltip').setAttribute('data-education',result['bachelorsOrHigher'])
              })

                .on('mouseout', (item) => {
                      tooltip.transition()
                              .style('opacity',0)
                  })                     
}

/*Création de  la legende*/
const createLegend = () =>{

  let svgLegend = d3.select('#legend')
               
  let arg
  
  /*ajout d'une explication*/
  svgLegend.append('text') 
          .attr('y','25')
          .attr('x','500')          
          .html('Source : '
          +'<a style="stroke:blue" href="https://www.ers.usda.gov/data-products/county-level-data-sets/download-data.aspx">'
          +'USDA Economics Research Service'
          +'</a>')

  /*définit l'ajout d'un rectangle dans la légende*/
  const addRect = (arg) => {                  
  
      let color

      switch (arg) {
          case 0:
              color=greens[0]           
              break;
          case 1:
              color=greens[1]       
              break;    
          case 2:
              color=greens[2]             
              break;
          case 3:
              color=greens[3]            
              break;
          case 4:
              color=greens[4]       
              break;
          case 5:
              color=greens[5] 
              break;
          case 6:
              color=greens[6] 
              break;               
      default:
              break;
      }
      
      svgLegend.append('rect')
          .attr('class','legendCell') 
          .attr('fill',color)     
          .attr('width','50')
          .attr('height','25')
          .attr('y','10')
          .attr('x',(arg*50)+100)
  }  
  /*définit l'axe de la légende et ses valeurs*/

  let scaleLegend=d3.scaleLinear()
      .domain([0,0.1,0.2,0.3,0.4,0.5])
      .range([100,150])

  let formatPercent = d3.format(".0%");
  
  let legend_axis=d3.axisBottom()
      .scale(scaleLegend)
      .ticks(5)
      .tickFormat(formatPercent);
         
      svgLegend.attr("width", width)
              .attr("height", 60)         

      for (let i=0;i<6;i++){
                 addRect(i)
      }   
      
      svgLegend.append('g') 
              .call(legend_axis)
              .attr('class','legend_axis')   
              .attr('transform','translate(0,35)')    
}     


/*récupération des données contenus dans l'URL USEducationDataUrl*/
d3.json(USEducationDataUrl).then(function(data,error){   

  if (error){
    throw console.log(error)
  
  }else{
    USEducationData=data

    /*récupération des données contenus dans l'URL USCountyDataUrl*/
    d3.json(USCountyDataUrl).then(function(data,error){
      
      if (error){
        throw console.log(error)
      
      }else{
        USCountyData=topojson.feature(data, data.objects.counties).features
        drawSvgContainer ()  
        createLegend ()  
      }
    })
  }
})   

/*Info bulle*/
const tooltip=d3.select('body')
                .append('div')
                .attr('id','tooltip')               
                .style("opacity", 0)  