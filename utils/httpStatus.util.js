/**
 200 OK : C'est la réponse HTTP standard pour une requête réussie. Si vous avez effectué une requête GET, vous pouvez renvoyer un code 200 et la représentation des données demandées dans le corps de la réponse.
 201 Created : Ce code est renvoyé lorsqu'une nouvelle ressource a été créée en réponse à une requête POST.
 204 No Content : Ce code est renvoyé lorsqu'une requête a été exécutée avec succès, mais il n'y a aucune représentation à renvoyer (par exemple, lorsqu'une requête DELETE a été exécutée avec succès).
 400 Bad Request : Ce code est renvoyé lorsque les données envoyées dans la requête ne sont pas valides. Par exemple, lorsque les champs obligatoires ne sont pas présents ou ne sont pas valides.
 401 Unauthorized : Ce code est renvoyé lorsqu'une requête nécessite une authentification valide et que cette authentification n'a pas été fournie ou est incorrecte.
 403 Forbidden : Ce code est renvoyé lorsqu'une requête est refusée car l'authentification a été fournie, mais que l'utilisateur n'a pas les autorisations nécessaires pour accéder à la ressource demandée.
 404 Not Found : Ce code est renvoyé lorsqu'une ressource n'a pas été trouvée.
 500 Internal Server Error : Ce code est renvoyé lorsqu'une erreur interne du serveur a empêché de traiter la requête.
 */

module.exports = {
    OK:{code:200,message:"OK"},
    CREATED:{code:201,message:"CREATED"},
    DELETE:{code:202,message:"DELETE"},// TODO : Ligne inutile et fausse (à supprimer plutard), il est utilisé dans le controlleur Booking
    NO_CONTENT:{code:204,message:"NO_CONTENT"},
    BAD_REQUEST:{code:400,message:"BAD_REQUEST"},
    UNAUTHORIZED:{code:401,message:"UNAUTHORIZED"},
    FORBIDDEN:{code:403,message:"FORBIDDEN"},
    NOT_FOUND:{code:404,message:"NOT_FOUND"},
    CONFLICT:{code:409,message:"CONFLICT"},
    INTERNAL_SERVER_ERROR:{code:500,message:"INTERNAL_SERVER_ERROR"},
    SERVICE_UNAVAILABLE:{code:503,message:"SERVICE_UNAVAILABLE"}
}
