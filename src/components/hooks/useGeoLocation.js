import React, { useState, useEffect } from "react";

const useGeoLocation = () => {
    const [location, setLocation] = useState({
        loaded: false,
        coordinates: { lat: "", lng: "" },
    });
    const [permission, setPermission] = useState(true);

    const onSuccess = (location) => {
        setLocation({
            loaded: true,
            coordinates: {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
            },
        });
    };

    const onError = (error) => {
        setLocation({
            loaded: true,
            error: {
                code: error.code,
                message: error.message,
            },
        });
    };

    const handlePermissionChange = (event) => {
        setPermission(event.target.state === "granted");
    };

    navigator.permissions.query({ name: "geolocation" }).then((permissionStatus) => {
        setPermission(permissionStatus.state === "granted");
        permissionStatus.onchange = handlePermissionChange;
    });


    useEffect(() => {
        
        if (!("geolocation" in navigator) || !(permission==='granted')){
            onError({
                code: 0,
                message: "Geolocation not supported",
            });
        }
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
        
    }, [permission]);

    //Want to use geolocation link

    // import useGeoLocation from "../../../hooks/useGeoLocation";

    // const location = useGeoLocation();

    // function createGoogleMapsLink(coords) {
    //     const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=`+coords.lat+','+coords.lng;
    //     window.open(googleMapsUrl,'_blank');
    //   }

    //   {location.loaded &&
    //     <button onClick={createGoogleMapsLink(location.coordinates)}> Click</button>}



    return location;
};

export default useGeoLocation;