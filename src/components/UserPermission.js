export const can = (permission, userPermissions) => {
    // console.log(permission, userPermissions)
    return (userPermissions || []).find((p) => p == permission) ? true : false 
}
