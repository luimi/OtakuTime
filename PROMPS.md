# Inicial
quiero convertir mi pagina web en un api y para eso necesito que me ayudes. De este html genera un script en js usando cheerio que inicie una variable llamada result y cumpla con este criterio:

## Main
Debes devolver un array con todos los capitulos en la seccion de hoy y con este modelo [{title: string,url: string, poster:string, chapter: string}]
## Search
Debes devolver un array con todos los animes con este modelo [{title: string,url: string,poster: string}]
## Episodes
Debes devolver un objeto con este modelo {title: string,poster: string, synopsis: string, episodes:[{title,url}],categories:[string],extras:[{title,content}]}, en episodes es simplemente el listado de episodios dejando en title, preferiblemente solo el numero del capitulo y en orden descendente de mayor a menor, las categorias es opcional, puede que no contenga esta informacion y en extras es posible encontrar informacion como tipo: pelicula, estado: finalizado de esta forma se debe guardar como title:content
## Episode
Debes devolver un objeto con este modelo {poster: string,title: string,links:[string],streams:[string],next: string,previous:string ,episodes; string, chapter: string} donde links sea un listado de links de descarga, streams sea un listado de links para ver, next, previuos y episodes, son links de siguiente capitulo, anterior capitulo y listado de episodios respectivamente, el poster es opcional no necesariamente se encuentra.

# Final

Usa este html como ejemplo para extraer los datos