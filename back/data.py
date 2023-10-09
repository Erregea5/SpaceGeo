import earthaccess
import sys
sys.path.append('../modules/')

earthaccess.login(persist=True)

def getEmitData(point):
    results={}
    names=[('EMITL2ARFL','terrain'),('EMITL2BMIN','mineral')]#,('EMITL2CH4ENH','enhanced mineral')]
    for name in names:
        result = earthaccess.search_data(
            short_name=name[0],
            point=point,
            count=100
        )
        if len(result)!=0:
            temp=[]
            for r in result:
                umm=r.values().mapping['umm']
                temp.append({
                    'points':umm['SpatialExtent']['HorizontalSpatialDomain']['Geometry']['GPolygons'][0]['Boundary']['Points'],
                    'image':r.dataviz_links(),
                    'downloads':r.data_links(),
                    'time':umm['TemporalExtent']
                })
            results[name[1]]=temp

    return results