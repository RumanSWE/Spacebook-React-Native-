import { SearchByTextOptions, SearchByCoordinatesOptions, Coordinates, Place, MapStyle, Geofence, GeofenceId, GeofenceInput, GeofenceOptions, ListGeofenceOptions, ListGeofenceResults, SaveGeofencesResults, DeleteGeofencesResults } from './Geo';
export interface GeoProvider {
    getCategory(): string;
    getProviderName(): string;
    configure(config: object): object;
    getAvailableMaps(): MapStyle[];
    getDefaultMap(): MapStyle;
    searchByText(text: string, options?: SearchByTextOptions): Promise<Place[]>;
    searchByCoordinates(coordinates: Coordinates, options?: SearchByCoordinatesOptions): Promise<Place>;
    saveGeofences(geofences: GeofenceInput[], options?: GeofenceOptions): Promise<SaveGeofencesResults>;
    getGeofence(geofenceId: GeofenceId, options?: ListGeofenceOptions): Promise<Geofence>;
    listGeofences(options?: ListGeofenceOptions): Promise<ListGeofenceResults>;
    deleteGeofences(geofenceIds: string[], options?: GeofenceOptions): Promise<DeleteGeofencesResults>;
}
