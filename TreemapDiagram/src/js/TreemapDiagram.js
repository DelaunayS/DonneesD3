/*Déclarations des variables*/
const MovieSalesUrl='https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'

let MovieSalesData /*données récupérées après d3.json*/

let hierarchieData /*hiérarchisation des données de MovieSalesData*/

let color=d3.schemeAccent

const margin={top: 50, right: 30, bottom: 10, left: 70},
width=1000,
height=600

/*Formatage du nombre*/
const REGEX_GROUPS = /(\d)(?=(\d\d\d)+(?!\d))/g

function useGrouping(int, delimiter = '\u202f') {
  return int.toString().replace(REGEX_GROUPS, `$1${delimiter}`)
}

/*Zone du svg Container*/ 
let svgContainer = d3.select('#graphContainer')

const drawSvgContainer = () =>{
    svgContainer.attr("width", width)
                .attr("height", height)  
} 

/*Dessine tous les rectangles du diagramme*/
const drawRect = () =>{
        
    hierarchieData = d3.hierarchy(MovieSalesData, (node) => {
        return node['children']
        })                         
                        .sum(d => d.value)                 
                        /*trie selon les valeurs*/                               
                        .sort((a, b) => {
                        return b.value - a.value})                                            

    let treemap = d3.treemap()
                    .size([width,height])
                    .paddingInner(1)

    treemap(hierarchieData)                       

    let cell=svgContainer.selectAll('g')
                        .data(hierarchieData.leaves())
                        .enter()  

                    cell.append('rect')              
                        .attr('transform', (item) =>{
                            return 'translate(' + item['x0']+','+ item['y0']+')'
                        })
                    
                        .attr('class','tile')
                        .attr('data-name',(item) => {
                            return item['data']['name']
                        })
                        .attr('data-category',(item) => {
                            return item ['data']['category']
                        })
                        .attr('data-value',(item) => {
                            return item ['data']['value']
                        })
                        .attr('fill',(item) =>{
                            if (item['data']['category']==='Action'){
                                return color[0]
                            }
                            else if (item['data']['category']==='Drama'){
                                return color[1]
                            }
                            else if (item['data']['category']==='Adventure'){
                                return color[2]
                            }
                            else if (item['data']['category']==='Family'){
                                return color[3]
                            }
                            else if (item['data']['category']==='Animation'){
                                return color[4]
                            }
                            else if (item['data']['category']==='Comedy'){
                                return color[5]
                            }
                            else if (item['data']['category']==='Biography'){
                                return color[6]
                            }                   
                        })
                        .attr('height',(item) =>{
                                return item['y1']-item['y0']
                        })
                        .attr('width',(item) =>{
                            return item['x1']-item['x0']
                        })
                        .on('mouseover',(event,item) =>{                    
                            tooltip.transition()
                                    .style('opacity',0.9)
                                    .style('top', (event.pageY-margin.top-margin.bottom)+'px')
                                    .style('left', (event.pageX+10)+'px') 
                                    
                            tooltip.html(
                                item['data']['name']
                                +'<br/>'     
                                +useGrouping(item['data']['value'])+' $'                
                                                                
                            )                          
                              
                            document.querySelector('#tooltip').setAttribute('data-value',item['data']['value'])
                        })
                        .on('mouseout', (item) => {
                            tooltip.transition()
                                    .style('opacity',0)
                        })  

                        cell.append('foreignObject')                                               
                            .text((item) =>{
                                return (item['data']['name'])  
                            })  
                            .attr('class','textCell')
                            .attr('x',(item)=> {return item ['x0']})
                            .attr('y',(item) => { return (item['y0'])}) 
                            .attr('width',(item) => {return (item['x1']-item['x0'])})   
                            .attr('height', (item) => {return (item['y1']-item['y0'])})
                            .on('mouseover',(event,item) =>{                    
                                tooltip.transition()
                                        .style('opacity',0.9)
                                        .style('top', (event.pageY-margin.top-margin.bottom)+'px')
                                        .style('left', (event.pageX+10)+'px') 
                                        
                                tooltip.html(
                                    item['data']['name']
                                    +'<br/>'     
                                    +useGrouping(item['data']['value'])+' $'                
                                                                    
                                )                          
                                  
                                document.querySelector('#tooltip').setAttribute('data-value',item['data']['value'])
                            })
                            .on('mouseout', (item) => {
                                tooltip.transition()
                                        .style('opacity',0)
                            })  
                }

/*Création de  la legende*/
const createLegend = () =>{

    let svgLegend = d3.select('#legend') 

    svgLegend.attr("width", width/2)
             .attr("height", 85)  
             
    const itemLegendLine1 =(index) => {

            svgLegend.append('rect')
                     .attr('class','legend-item')
                     .attr('width',20)
                     .attr('height',20)
                     .attr('fill',(color[index])) 
                     .attr('transform','translate('+(5+index*120)+',15)')

            svgLegend.append('text')
                    .attr('x',(27+index*120))
                    .attr('y',30)
                    .text(()=>{
                        switch (index) {
                            case 0:
                                return 'Action'                         
                                break;
                            case 1:
                                return 'Drame'                         
                                break;
                            case 2:
                                return 'Aventure'                         
                                break;
                            case 3:
                                return 'Familial'                         
                                break;                                         
                            default:
                                break;
                        }
                    })
                }

                const itemLegendLine2 =(index) => {

                        svgLegend.append('rect')
                                .attr('class','legend-item')
                                .attr('width',20)
                                .attr('height',20)
                                .attr('fill',(color[index])) 
                                .attr('transform','translate('+(5-360+index*120)+',55)')
                    
                        svgLegend.append('text')
                                .attr('x',(27-360+index*120))
                                .attr('y',70)
                                .text(()=>{
                                    switch (index) {                                      
                                     case 4:
                                         return 'Animation'                         
                                         break;
                                     case 5:
                                         return 'Comédie'                         
                                         break;
                                     case 6:
                                         return 'Biographie'                         
                                         break;                 
                                     default:
                                         break;
                                  }
                                 })             
                        }
    
    for (let i=0 ; i<4 ; i++){
        itemLegendLine1(i)
    }
    for (let i=4 ; i<7 ; i++){
        itemLegendLine2(i)
    }   
}     

/*récupération et utilisation des données dataJson*/

d3.json(MovieSalesUrl).then(function(dataJson,error){
    if (error){
        throw console.log(error)
    }else{   
            MovieSalesData=dataJson            
        }
    
    drawSvgContainer()   
    drawRect ()  
    createLegend ()   
   
})

/*Info bulle*/
const tooltip=d3.select('body')
                .append('div')
                .attr('id','tooltip')               
                .style("opacity", 0)            