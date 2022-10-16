require("dotenv").config();

const { Model } = require("mongoose");
const mongoose = require("mongoose");

//mongoose.connect(process.env.MONGO_URI).then((success) => {}).catch(e=> console.error(e));



const { Schema } = mongoose;

const locationSchema = new Schema({
  filmType: {type: String},
  filmProducerName: {type: String},
  endDate: {type: Date},
  filmName: {type: String},
  district: {type: String},
  sourceLocationId: {type: String},
  filmDirectorName: {type: String},
  address: {type: String},
  startDate: {type: Date},
  year: {type: String},
  geolocation: {
    coordinates: {type: [Number]},
    type: {type: String, enum:['Point']}
  }
});
  
const Location = mongoose.model('Locations', locationSchema);
module.exports = Location;
  
const filmingLocations = require('./lieux-de-tournage-a-paris.json');
// await attend que .connect() obtienne un résultat
// Promise.all([]) permet de lancer plusieurs promesses en même temps


async function importToMongo (filmingLocations) {
    for(const filmingLocation of filmingLocations){
        const toInsert = new Location({"filmType": filmingLocation.fields.type_tournage, 
                                       "filmProducerName": filmingLocation.fields.nom_producteur,
                                       "endDate": filmingLocation.fields.endDate,
                                       "filmName": filmingLocation.fields.filmName,
                                       "district": filmingLocation.fields.district,
                                       "sourceLocationId": filmingLocation.fields.sourceLocationId,
                                       "filmDirectorName": filmingLocation.fields.filmDirectorName,
                                       "address": filmingLocation.fields.address,                                    
                                       "startDate": filmingLocation.fields.startDate,                                      
                                       "year": filmingLocation.fields.year,
                                       "geolocation": filmingLocation.fields.geo_shape})
        await toInsert.save()
    }
}



//9. Write a function to query one `Location` by its ID
async function oneLocationById (id) {
  return Location.findById(id)
}

//10. Write a function to query all `Locations` for a given `filmName`
async function queryLocationByFilmName (filmName) {
  return Location.find(filmName)
}

//11. Write a function to delete a `Location` by its ID
async function deleteOneLocationById (id) {
  await Location.deleteOne({sourceLocationId:id});
}
//12. Write a function to add a `Location`
async function addLoc (newobj) {
  const toInsert = new Location({"filmType": newobj.fields.type_tournage, 
                                 "filmProducerName": newobj.fields.nom_producteur,
                                  "endDate": newobj.fields.endDate,
                                  "filmName": newobj.fields.filmName,
                                  "district": newobj.fields.district,
                                  "sourceLocationId": newobj.fields.sourceLocationId,
                                  "filmDirectorName": newobj.fields.filmDirectorName,
                                  "address": newobj.fields.address,                                    
                                  "startDate": newobj.fields.startDate,                                      
                                  "year": newobj.fields.year,
                                  "geolocation": newobj.fields.geo_shape})
  await toInsert.save()
}

//13. Write a function to update a `Location`
async function updateLoc (id, modification) {
  await Location.updateOne(id,modification);
}


async function main(){
  const res = await mongoose.connect(process.env.MONGO_URI)
  console.log('success')
  const filmingLocations = require('./lieux-de-tournage-a-paris.json')
  await importToMongo(filmingLocations)
  await oneLocationById(filmingLocations[6].fields.sourceLocationId)
  await deleteOneLocationById(filmingLocations[6].fields.sourceLocationId);
}
main()