export const isAndroid = () => {
    let isOSAvailable = false;
    if (window.cordova !== undefined){
        if (window.cordova.platformId === "android"){
            isOSAvailable = true;
        }
    }
    return isOSAvailable;
}